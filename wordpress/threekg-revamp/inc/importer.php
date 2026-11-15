<?php
/**
 * Idempotent importer for the project library bundled with the theme.
 *
 * @package ThreeKG_Revamp
 */

if (!defined('ABSPATH')) {
    exit;
}

function threekg_register_importer_menu() {
    add_submenu_page(
        'threekg-dashboard',
        __('Import Projects', 'threekg-revamp'),
        __('Import Projects', 'threekg-revamp'),
        'manage_options',
        'threekg-import-projects',
        'threekg_render_importer_page'
    );
}
add_action('admin_menu', 'threekg_register_importer_menu', 20);

function threekg_read_bundled_projects() {
    $path = get_template_directory() . '/assets/profile-data.js';
    if (!is_readable($path)) {
        return new WP_Error('source_missing', __('The bundled project source could not be read.', 'threekg-revamp'));
    }

    $raw = file_get_contents($path);
    if (false === $raw) {
        return new WP_Error('source_read_failed', __('The bundled project source could not be loaded.', 'threekg-revamp'));
    }

    $start = strpos($raw, '{');
    $end = strrpos($raw, '}');
    if (false === $start || false === $end || $end <= $start) {
        return new WP_Error('source_invalid', __('The bundled project source does not contain a valid data object.', 'threekg-revamp'));
    }

    $data = json_decode(substr($raw, $start, $end - $start + 1), true);
    if (!is_array($data) || empty($data['projects']) || !is_array($data['projects'])) {
        return new WP_Error('source_json_invalid', sprintf(__('Project data could not be decoded: %s', 'threekg-revamp'), json_last_error_msg()));
    }

    return $data;
}

function threekg_find_imported_project($source_id) {
    $matches = get_posts(array(
        'post_type' => 'project',
        'post_status' => 'any',
        'posts_per_page' => 1,
        'fields' => 'ids',
        'meta_key' => '_3kg_source_id',
        'meta_value' => $source_id,
        'no_found_rows' => true,
        'suppress_filters' => true,
    ));
    if ($matches) {
        return (int) $matches[0];
    }

    $project = get_page_by_path(sanitize_title($source_id), OBJECT, 'project');
    return $project ? (int) $project->ID : 0;
}

function threekg_import_asset_url($path) {
    if (!$path) {
        return '';
    }
    if (preg_match('#^https?://#i', $path)) {
        return esc_url_raw($path);
    }
    return esc_url_raw(trailingslashit(get_template_directory_uri()) . ltrim($path, '/'));
}

function threekg_import_meta_value($record, $key) {
    return isset($record['meta'][$key]) ? (string) $record['meta'][$key] : '';
}

function threekg_import_story($sections) {
    if (!is_array($sections)) {
        return '';
    }
    $blocks = array();
    foreach ($sections as $section) {
        if (!empty($section['title'])) {
            $blocks[] = '## ' . (string) $section['title'];
        }
        if (!empty($section['paragraphs']) && is_array($section['paragraphs'])) {
            $blocks = array_merge($blocks, array_map('strval', $section['paragraphs']));
        }
    }
    return implode("\n\n", $blocks);
}

function threekg_import_gallery($images) {
    if (!is_array($images)) {
        return '';
    }
    $lines = array();
    foreach ($images as $image) {
        $url = threekg_import_asset_url(isset($image['src']) ? $image['src'] : '');
        if (!$url) {
            continue;
        }
        $alt = isset($image['alt']) ? sanitize_text_field($image['alt']) : '';
        $caption = isset($image['caption']) ? sanitize_text_field($image['caption']) : '';
        $lines[] = implode(' | ', array($url, $alt, $caption));
    }
    return implode("\n", $lines);
}

function threekg_import_project_record($record, $index, $new_status = 'draft', $force = false) {
    if (empty($record['id']) || empty($record['name'])) {
        return new WP_Error('record_invalid', __('A project record is missing its ID or name.', 'threekg-revamp'));
    }

    $source_id = sanitize_key($record['id']);
    $source_hash = hash('sha256', wp_json_encode($record));
    $existing_id = threekg_find_imported_project($source_id);
    $existing_hash = $existing_id ? get_post_meta($existing_id, '_3kg_source_hash', true) : '';

    if ($existing_id && !$force && hash_equals((string) $existing_hash, $source_hash)) {
        return array('status' => 'skipped', 'post_id' => $existing_id, 'name' => $record['name']);
    }

    $body = !empty($record['body']) && is_array($record['body']) ? implode("\n\n", array_map('strval', $record['body'])) : '';
    $post = array(
        'ID' => $existing_id,
        'post_type' => 'project',
        'post_title' => sanitize_text_field($record['name']),
        'post_name' => sanitize_title($source_id),
        'post_content' => wp_kses_post($body),
        'post_excerpt' => isset($record['title']) ? sanitize_text_field($record['title']) : '',
        'menu_order' => (int) $index + 1,
    );
    if (!$existing_id) {
        $post['post_status'] = in_array($new_status, array('draft', 'publish'), true) ? $new_status : 'draft';
    }

    $post_id = wp_insert_post(wp_slash($post), true);
    if (is_wp_error($post_id)) {
        return $post_id;
    }

    $images = !empty($record['images']) && is_array($record['images']) ? $record['images'] : array();
    $hero = $images ? threekg_import_asset_url(isset($images[0]['src']) ? $images[0]['src'] : '') : '';
    $hero_alt = $images && isset($images[0]['alt']) ? $images[0]['alt'] : $record['name'];
    $motion = !empty($record['motion'][0]) && is_array($record['motion'][0]) ? $record['motion'][0] : array();
    $scope = str_replace(array(' · ', ' | '), "\n", threekg_import_meta_value($record, 'Scope'));
    $source_url = !empty($record['contentSource']['sourceUrl']) ? $record['contentSource']['sourceUrl'] : '';

    $meta = array(
        '_3kg_source_id' => $source_id,
        '_3kg_source_hash' => $source_hash,
        '_3kg_source_keys' => !empty($record['sourceKeys']) ? wp_json_encode($record['sourceKeys']) : '',
        '_3kg_project_story_json' => !empty($record['storySections']) ? wp_json_encode($record['storySections']) : '',
        '_3kg_project_portfolio_title' => sanitize_text_field($record['name']),
        '_3kg_project_subtitle' => isset($record['title']) ? sanitize_text_field($record['title']) : '',
        '_3kg_project_client' => threekg_import_meta_value($record, 'Client'),
        '_3kg_project_year' => threekg_import_meta_value($record, 'Year'),
        '_3kg_project_market' => threekg_import_meta_value($record, 'Market'),
        '_3kg_project_scope' => $scope,
        '_3kg_project_hero_image' => $hero,
        '_3kg_project_hero_alt' => sanitize_text_field($hero_alt),
        '_3kg_project_story' => threekg_import_story(isset($record['storySections']) ? $record['storySections'] : array()),
        '_3kg_project_gallery' => threekg_import_gallery($images),
        '_3kg_project_motion_url' => threekg_import_asset_url(isset($motion['src']) ? $motion['src'] : ''),
        '_3kg_project_motion_poster' => threekg_import_asset_url(isset($motion['poster']) ? $motion['poster'] : ''),
        '_3kg_project_motion_title' => isset($motion['title']) ? sanitize_text_field($motion['title']) : '',
        '_3kg_project_source_url' => esc_url_raw($source_url),
        '_3kg_project_sort_order' => (int) $index + 1,
        '_3kg_project_featured' => $index < 6,
        '_3kg_project_published' => true,
    );
    foreach ($meta as $key => $value) {
        update_post_meta($post_id, $key, $value);
    }

    $category = isset($record['category']) ? sanitize_key($record['category']) : '';
    $term_names = array(
        'brand' => 'Brand',
        'design' => 'Design',
        'campaigns' => 'Campaigns',
        'production' => 'Production',
        'tech' => 'Tech',
        'xperience' => 'Xperience',
        'selected-work' => 'Selected Work',
    );
    if (isset($term_names[$category])) {
        wp_set_object_terms($post_id, $term_names[$category], 'project_sector', false);
    }

    return array('status' => $existing_id ? 'updated' : 'created', 'post_id' => $post_id, 'name' => $record['name']);
}

function threekg_run_project_import($projects, $new_status, $force) {
    $summary = array('created' => 0, 'updated' => 0, 'skipped' => 0, 'errors' => array());
    foreach ($projects as $index => $record) {
        $result = threekg_import_project_record($record, $index, $new_status, $force);
        if (is_wp_error($result)) {
            $summary['errors'][] = array(
                'name' => isset($record['name']) ? $record['name'] : sprintf(__('Record %d', 'threekg-revamp'), $index + 1),
                'message' => $result->get_error_message(),
            );
            continue;
        }
        $summary[$result['status']]++;
    }
    return $summary;
}

function threekg_render_importer_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    $data = threekg_read_bundled_projects();
    echo '<div class="wrap threekg-admin"><h1>' . esc_html__('Import Projects', 'threekg-revamp') . '</h1>';
    echo '<p>' . esc_html__('Preview and import the portfolio records bundled with this theme. Imports are matched by the permanent source ID, so running the importer again does not create duplicates.', 'threekg-revamp') . '</p>';

    if (is_wp_error($data)) {
        echo '<div class="notice notice-error"><p>' . esc_html($data->get_error_message()) . '</p></div></div>';
        return;
    }

    if ('POST' === $_SERVER['REQUEST_METHOD'] && isset($_POST['threekg_import_action'])) {
        check_admin_referer('threekg_import_projects', 'threekg_import_nonce');
        $new_status = isset($_POST['new_status']) && 'publish' === $_POST['new_status'] ? 'publish' : 'draft';
        $force = !empty($_POST['force_import']);
        $summary = threekg_run_project_import($data['projects'], $new_status, $force);
        $notice_class = $summary['errors'] ? 'notice-warning' : 'notice-success';
        echo '<div class="notice ' . esc_attr($notice_class) . ' is-dismissible"><p>' . sprintf(
            esc_html__('Import complete: %1$d created, %2$d updated, %3$d unchanged, %4$d errors.', 'threekg-revamp'),
            $summary['created'],
            $summary['updated'],
            $summary['skipped'],
            count($summary['errors'])
        ) . '</p></div>';
        foreach ($summary['errors'] as $error) {
            echo '<div class="notice notice-error"><p><strong>' . esc_html($error['name']) . ':</strong> ' . esc_html($error['message']) . '</p></div>';
        }
    }

    $existing_count = 0;
    foreach ($data['projects'] as $project) {
        if (!empty($project['id']) && threekg_find_imported_project(sanitize_key($project['id']))) {
            $existing_count++;
        }
    }

    echo '<section class="threekg-panel"><h2>' . esc_html__('Import options', 'threekg-revamp') . '</h2>';
    echo '<p>' . sprintf(esc_html__('%1$d source projects found; %2$d already exist in WordPress.', 'threekg-revamp'), count($data['projects']), $existing_count) . '</p>';
    echo '<form method="post">';
    wp_nonce_field('threekg_import_projects', 'threekg_import_nonce');
    echo '<input name="threekg_import_action" type="hidden" value="import">';
    echo '<p><label for="threekg-new-status"><strong>' . esc_html__('Status for new projects', 'threekg-revamp') . '</strong></label><br><select id="threekg-new-status" name="new_status"><option value="draft">' . esc_html__('Draft — review before publishing', 'threekg-revamp') . '</option><option value="publish">' . esc_html__('Published', 'threekg-revamp') . '</option></select></p>';
    echo '<p><label><input name="force_import" type="checkbox" value="1"> ' . esc_html__('Force refresh records even when the bundled source has not changed', 'threekg-revamp') . '</label></p>';
    submit_button(__('Import or update projects', 'threekg-revamp'), 'primary', 'submit', false);
    echo '</form></section>';

    echo '<section class="threekg-panel"><h2>' . esc_html__('Source preview', 'threekg-revamp') . '</h2><div class="threekg-table-wrap"><table class="widefat striped"><thead><tr><th>' . esc_html__('Project', 'threekg-revamp') . '</th><th>' . esc_html__('Discipline', 'threekg-revamp') . '</th><th>' . esc_html__('Images', 'threekg-revamp') . '</th><th>' . esc_html__('Films', 'threekg-revamp') . '</th><th>' . esc_html__('WordPress status', 'threekg-revamp') . '</th></tr></thead><tbody>';
    foreach ($data['projects'] as $project) {
        $existing_id = !empty($project['id']) ? threekg_find_imported_project(sanitize_key($project['id'])) : 0;
        $status = $existing_id ? get_post_status($existing_id) : __('Not imported', 'threekg-revamp');
        echo '<tr><td><strong>' . esc_html(isset($project['name']) ? $project['name'] : '') . '</strong><br><code>' . esc_html(isset($project['id']) ? $project['id'] : '') . '</code></td><td>' . esc_html(isset($project['category']) ? $project['category'] : '') . '</td><td>' . esc_html(!empty($project['images']) ? count($project['images']) : 0) . '</td><td>' . esc_html(!empty($project['motion']) ? count($project['motion']) : 0) . '</td><td>' . esc_html($status) . '</td></tr>';
    }
    echo '</tbody></table></div></section></div>';
}

