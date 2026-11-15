<?php
/**
 * Native WordPress fields for 3KG dashboard content.
 *
 * @package ThreeKG_Revamp
 */

if (!defined('ABSPATH')) {
    exit;
}

function threekg_meta_schema() {
    return array(
        'project' => array(
            '_3kg_project_portfolio_title' => array('label' => __('Display title', 'threekg-revamp'), 'type' => 'text', 'description' => __('Optional title used in the portfolio presentation.', 'threekg-revamp')),
            '_3kg_project_subtitle' => array('label' => __('Subtitle', 'threekg-revamp'), 'type' => 'textarea'),
            '_3kg_project_client' => array('label' => __('Client', 'threekg-revamp'), 'type' => 'text'),
            '_3kg_project_year' => array('label' => __('Year', 'threekg-revamp'), 'type' => 'text'),
            '_3kg_project_market' => array('label' => __('Market', 'threekg-revamp'), 'type' => 'text'),
            '_3kg_project_scope' => array('label' => __('Scope', 'threekg-revamp'), 'type' => 'textarea', 'description' => __('Enter one service per line.', 'threekg-revamp')),
            '_3kg_project_hero_image' => array('label' => __('Hero image', 'threekg-revamp'), 'type' => 'media'),
            '_3kg_project_hero_alt' => array('label' => __('Hero image alt text', 'threekg-revamp'), 'type' => 'text'),
            '_3kg_project_story' => array('label' => __('Case-study story', 'threekg-revamp'), 'type' => 'textarea', 'description' => __('Long-form story. The main editor remains the project overview.', 'threekg-revamp')),
            '_3kg_project_gallery' => array('label' => __('Gallery', 'threekg-revamp'), 'type' => 'textarea', 'description' => __('One image per line: URL | alt text | caption.', 'threekg-revamp')),
            '_3kg_project_motion_url' => array('label' => __('Film URL', 'threekg-revamp'), 'type' => 'url'),
            '_3kg_project_motion_poster' => array('label' => __('Film poster', 'threekg-revamp'), 'type' => 'media'),
            '_3kg_project_motion_title' => array('label' => __('Film title', 'threekg-revamp'), 'type' => 'text'),
            '_3kg_project_source_url' => array('label' => __('Source URL', 'threekg-revamp'), 'type' => 'url'),
            '_3kg_project_accent' => array('label' => __('Accent colour', 'threekg-revamp'), 'type' => 'color'),
            '_3kg_project_sort_order' => array('label' => __('Portfolio order', 'threekg-revamp'), 'type' => 'number', 'default' => 0),
            '_3kg_project_featured' => array('label' => __('Feature on homepage', 'threekg-revamp'), 'type' => 'boolean', 'default' => false),
            '_3kg_project_published' => array('label' => __('Show in portfolio', 'threekg-revamp'), 'type' => 'boolean', 'default' => true),
        ),
        'service' => array(
            '_3kg_service_key' => array('label' => __('Machine key', 'threekg-revamp'), 'type' => 'text', 'description' => __('For example: brand, design or campaigns.', 'threekg-revamp')),
            '_3kg_service_summary' => array('label' => __('Short summary', 'threekg-revamp'), 'type' => 'textarea'),
            '_3kg_service_scope' => array('label' => __('Capabilities', 'threekg-revamp'), 'type' => 'textarea', 'description' => __('Enter one capability per line.', 'threekg-revamp')),
            '_3kg_service_symbol' => array('label' => __('Symbol or icon reference', 'threekg-revamp'), 'type' => 'text'),
            '_3kg_service_published' => array('label' => __('Show on website', 'threekg-revamp'), 'type' => 'boolean', 'default' => true),
        ),
        'client' => array(
            '_3kg_client_website' => array('label' => __('Website', 'threekg-revamp'), 'type' => 'url'),
            '_3kg_client_sector' => array('label' => __('Sector', 'threekg-revamp'), 'type' => 'text'),
            '_3kg_client_color' => array('label' => __('Tile colour', 'threekg-revamp'), 'type' => 'color'),
            '_3kg_client_logo_dark' => array('label' => __('Monochrome logo', 'threekg-revamp'), 'type' => 'media'),
            '_3kg_client_logo_color' => array('label' => __('Colour logo', 'threekg-revamp'), 'type' => 'media'),
            '_3kg_client_logo_alt' => array('label' => __('Logo alt text', 'threekg-revamp'), 'type' => 'text'),
            '_3kg_client_featured' => array('label' => __('Feature prominently', 'threekg-revamp'), 'type' => 'boolean', 'default' => false),
            '_3kg_client_published' => array('label' => __('Show on website', 'threekg-revamp'), 'type' => 'boolean', 'default' => true),
        ),
        'team_member' => array(
            '_3kg_team_role' => array('label' => __('Role', 'threekg-revamp'), 'type' => 'text'),
            '_3kg_team_specialty' => array('label' => __('Specialty', 'threekg-revamp'), 'type' => 'text'),
            '_3kg_team_hotspot_x' => array('label' => __('Hotspot X (%)', 'threekg-revamp'), 'type' => 'number', 'default' => 50, 'min' => 0, 'max' => 100, 'step' => 0.1),
            '_3kg_team_hotspot_y' => array('label' => __('Hotspot Y (%)', 'threekg-revamp'), 'type' => 'number', 'default' => 50, 'min' => 0, 'max' => 100, 'step' => 0.1),
            '_3kg_team_photo_alt' => array('label' => __('Photo alt text', 'threekg-revamp'), 'type' => 'text'),
            '_3kg_team_published' => array('label' => __('Show on website', 'threekg-revamp'), 'type' => 'boolean', 'default' => true),
        ),
    );
}

function threekg_meta_value_type($field) {
    if ('boolean' === $field['type']) {
        return 'boolean';
    }
    if ('number' === $field['type']) {
        return isset($field['step']) && false !== strpos((string) $field['step'], '.') ? 'number' : 'integer';
    }
    return 'string';
}

function threekg_sanitize_meta_value($value, $field) {
    switch ($field['type']) {
        case 'boolean':
            return rest_sanitize_boolean($value);
        case 'number':
            return isset($field['step']) && false !== strpos((string) $field['step'], '.') ? (float) $value : (int) $value;
        case 'url':
        case 'media':
            return esc_url_raw($value);
        case 'textarea':
            return sanitize_textarea_field($value);
        case 'color':
            return sanitize_hex_color($value);
        default:
            return sanitize_text_field($value);
    }
}

function threekg_register_post_meta_fields() {
    foreach (threekg_meta_schema() as $post_type => $fields) {
        foreach ($fields as $key => $field) {
            register_post_meta($post_type, $key, array(
                'type' => threekg_meta_value_type($field),
                'single' => true,
                'default' => isset($field['default']) ? $field['default'] : '',
                'show_in_rest' => true,
                'sanitize_callback' => function ($value) use ($field) {
                    return threekg_sanitize_meta_value($value, $field);
                },
                'auth_callback' => function () {
                    return current_user_can('edit_posts');
                },
            ));
        }
    }
}
add_action('init', 'threekg_register_post_meta_fields');

function threekg_add_meta_boxes() {
    $titles = array(
        'project' => __('Project details', 'threekg-revamp'),
        'service' => __('Service details', 'threekg-revamp'),
        'client' => __('Client details', 'threekg-revamp'),
        'team_member' => __('Team member details', 'threekg-revamp'),
    );
    foreach ($titles as $post_type => $title) {
        add_meta_box('threekg-details', $title, 'threekg_render_meta_box', $post_type, 'normal', 'high');
    }
}
add_action('add_meta_boxes', 'threekg_add_meta_boxes');

function threekg_render_meta_box($post) {
    $schema = threekg_meta_schema();
    $fields = isset($schema[$post->post_type]) ? $schema[$post->post_type] : array();
    wp_nonce_field('threekg_save_meta', 'threekg_meta_nonce');
    echo '<div class="threekg-fields">';
    foreach ($fields as $key => $field) {
        $value = get_post_meta($post->ID, $key, true);
        if ('' === $value && isset($field['default'])) {
            $value = $field['default'];
        }
        $id = 'threekg-' . sanitize_html_class($key);
        echo '<div class="threekg-field threekg-field--' . esc_attr($field['type']) . '">';
        if ('boolean' === $field['type']) {
            echo '<label for="' . esc_attr($id) . '"><input id="' . esc_attr($id) . '" name="threekg_meta[' . esc_attr($key) . ']" type="checkbox" value="1" ' . checked((bool) $value, true, false) . '> <strong>' . esc_html($field['label']) . '</strong></label>';
        } else {
            echo '<label for="' . esc_attr($id) . '"><strong>' . esc_html($field['label']) . '</strong></label>';
            if ('textarea' === $field['type']) {
                echo '<textarea class="widefat" id="' . esc_attr($id) . '" name="threekg_meta[' . esc_attr($key) . ']" rows="5">' . esc_textarea($value) . '</textarea>';
            } else {
                $html_type = in_array($field['type'], array('url', 'number', 'color'), true) ? $field['type'] : 'text';
                echo '<div class="threekg-input-row"><input class="widefat" id="' . esc_attr($id) . '" name="threekg_meta[' . esc_attr($key) . ']" type="' . esc_attr($html_type) . '" value="' . esc_attr($value) . '"';
                foreach (array('min', 'max', 'step') as $attribute) {
                    if (isset($field[$attribute])) {
                        echo ' ' . esc_attr($attribute) . '="' . esc_attr($field[$attribute]) . '"';
                    }
                }
                echo '>';
                if ('media' === $field['type']) {
                    echo '<button class="button threekg-media-button" data-target="#' . esc_attr($id) . '" type="button">' . esc_html__('Choose media', 'threekg-revamp') . '</button>';
                }
                echo '</div>';
            }
        }
        if (!empty($field['description'])) {
            echo '<p class="description">' . esc_html($field['description']) . '</p>';
        }
        echo '</div>';
    }
    echo '</div>';
}

function threekg_save_meta_fields($post_id) {
    if (!isset($_POST['threekg_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['threekg_meta_nonce'])), 'threekg_save_meta')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    $post_type = get_post_type($post_id);
    $schema = threekg_meta_schema();
    if (!isset($schema[$post_type])) {
        return;
    }
    $submitted = isset($_POST['threekg_meta']) && is_array($_POST['threekg_meta']) ? wp_unslash($_POST['threekg_meta']) : array();
    foreach ($schema[$post_type] as $key => $field) {
        $raw = 'boolean' === $field['type'] ? isset($submitted[$key]) : (isset($submitted[$key]) ? $submitted[$key] : '');
        $value = threekg_sanitize_meta_value($raw, $field);
        update_post_meta($post_id, $key, $value);
    }
}
add_action('save_post', 'threekg_save_meta_fields');

