<?php
/**
 * Dashboard navigation and global website settings.
 *
 * @package ThreeKG_Revamp
 */

if (!defined('ABSPATH')) {
    exit;
}

function threekg_site_settings_schema() {
    return array(
        'hero' => array(
            'title' => __('Hero & About', 'threekg-revamp'),
            'fields' => array(
                'hero_line_one' => array('label' => __('Hero line one', 'threekg-revamp'), 'type' => 'text', 'default' => 'Strategy first.'),
                'hero_line_two' => array('label' => __('Hero line two', 'threekg-revamp'), 'type' => 'text', 'default' => 'Impact always.'),
                'hero_video' => array('label' => __('Hero video', 'threekg-revamp'), 'type' => 'media'),
                'hero_poster' => array('label' => __('Hero video poster', 'threekg-revamp'), 'type' => 'media'),
                'about_heading' => array('label' => __('About heading', 'threekg-revamp'), 'type' => 'text', 'default' => 'Hello, we are Three Kilograms.'),
                'about_intro' => array('label' => __('About introduction', 'threekg-revamp'), 'type' => 'textarea'),
            ),
        ),
        'contact' => array(
            'title' => __('Contact & Footer', 'threekg-revamp'),
            'fields' => array(
                'contact_cta_label' => array('label' => __('Contact CTA label', 'threekg-revamp'), 'type' => 'text', 'default' => 'Start a conversation'),
                'contact_email' => array('label' => __('Email', 'threekg-revamp'), 'type' => 'email'),
                'contact_phone' => array('label' => __('Phone', 'threekg-revamp'), 'type' => 'text'),
                'contact_address' => array('label' => __('Studio address', 'threekg-revamp'), 'type' => 'textarea'),
                'website_url' => array('label' => __('Website URL', 'threekg-revamp'), 'type' => 'url'),
                'instagram_url' => array('label' => __('Instagram URL', 'threekg-revamp'), 'type' => 'url'),
                'linkedin_url' => array('label' => __('LinkedIn URL', 'threekg-revamp'), 'type' => 'url'),
                'footer_copyright' => array('label' => __('Copyright text', 'threekg-revamp'), 'type' => 'text', 'default' => '© 2026 3KG'),
            ),
        ),
        'seo' => array(
            'title' => __('SEO & Integrations', 'threekg-revamp'),
            'fields' => array(
                'default_meta_description' => array('label' => __('Default meta description', 'threekg-revamp'), 'type' => 'textarea'),
                'default_social_image' => array('label' => __('Default social image', 'threekg-revamp'), 'type' => 'media'),
                'google_analytics_id' => array('label' => __('Google Analytics measurement ID', 'threekg-revamp'), 'type' => 'text', 'description' => __('Example: G-XXXXXXXXXX. When set, the Google tag is loaded on the public site; configure consent requirements before production.', 'threekg-revamp')),
                'google_site_verification' => array('label' => __('Google site verification', 'threekg-revamp'), 'type' => 'text'),
            ),
        ),
    );
}

function threekg_get_site_setting($key, $fallback = '') {
    $settings = get_option('threekg_site_settings', array());
    return isset($settings[$key]) && '' !== $settings[$key] ? $settings[$key] : $fallback;
}

function threekg_sanitize_site_settings($input) {
    $input = is_array($input) ? $input : array();
    $output = array();
    foreach (threekg_site_settings_schema() as $section) {
        foreach ($section['fields'] as $key => $field) {
            $value = isset($input[$key]) ? $input[$key] : '';
            switch ($field['type']) {
                case 'email':
                    $output[$key] = sanitize_email($value);
                    break;
                case 'url':
                case 'media':
                    $output[$key] = esc_url_raw($value);
                    break;
                case 'textarea':
                    $output[$key] = sanitize_textarea_field($value);
                    break;
                default:
                    $output[$key] = sanitize_text_field($value);
            }
        }
    }
    return $output;
}

function threekg_register_site_settings() {
    register_setting('threekg_site_settings_group', 'threekg_site_settings', array(
        'type' => 'object',
        'sanitize_callback' => 'threekg_sanitize_site_settings',
        'default' => array(),
        'show_in_rest' => array(
            'schema' => array(
                'type' => 'object',
                'properties' => array(),
                'additionalProperties' => array('type' => 'string'),
            ),
        ),
    ));
}
add_action('admin_init', 'threekg_register_site_settings');

function threekg_register_dashboard_menu() {
    add_menu_page(
        __('3KG Website', 'threekg-revamp'),
        __('3KG Website', 'threekg-revamp'),
        'edit_pages',
        'threekg-dashboard',
        'threekg_render_dashboard_page',
        'dashicons-layout',
        3
    );
    add_submenu_page('threekg-dashboard', __('Dashboard', 'threekg-revamp'), __('Dashboard', 'threekg-revamp'), 'edit_pages', 'threekg-dashboard', 'threekg_render_dashboard_page');
    add_submenu_page('threekg-dashboard', __('Site Settings', 'threekg-revamp'), __('Site Settings', 'threekg-revamp'), 'manage_options', 'threekg-site-settings', 'threekg_render_site_settings_page');
}
add_action('admin_menu', 'threekg_register_dashboard_menu', 5);

function threekg_render_dashboard_page() {
    $types = array(
        'project' => array(__('Projects', 'threekg-revamp'), 'dashicons-portfolio'),
        'service' => array(__('Services', 'threekg-revamp'), 'dashicons-admin-tools'),
        'client' => array(__('Clients', 'threekg-revamp'), 'dashicons-groups'),
        'team_member' => array(__('Team Members', 'threekg-revamp'), 'dashicons-businessperson'),
    );
    echo '<div class="wrap threekg-admin"><div class="threekg-admin__hero"><div><p class="threekg-kicker">Three Kilograms</p><h1>' . esc_html__('Website dashboard', 'threekg-revamp') . '</h1><p>' . esc_html__('Manage the structured content that powers the 3KG website.', 'threekg-revamp') . '</p></div><a class="button button-primary" href="' . esc_url(admin_url('admin.php?page=threekg-site-settings')) . '">' . esc_html__('Open site settings', 'threekg-revamp') . '</a></div>';
    echo '<div class="threekg-stat-grid">';
    foreach ($types as $type => $details) {
        $counts = wp_count_posts($type);
        $published = isset($counts->publish) ? (int) $counts->publish : 0;
        echo '<a class="threekg-stat" href="' . esc_url(admin_url('edit.php?post_type=' . $type)) . '"><span class="dashicons ' . esc_attr($details[1]) . '"></span><strong>' . esc_html($published) . '</strong><span>' . esc_html($details[0]) . '</span></a>';
    }
    echo '</div>';
    echo '<div class="threekg-admin-grid"><section class="threekg-panel"><h2>' . esc_html__('Content workflow', 'threekg-revamp') . '</h2><ol><li>' . esc_html__('Add or import projects, services, clients and team members.', 'threekg-revamp') . '</li><li>' . esc_html__('Complete global contact, hero and SEO settings.', 'threekg-revamp') . '</li><li>' . esc_html__('Preview changes on staging before publishing.', 'threekg-revamp') . '</li></ol></section>';
    echo '<section class="threekg-panel"><h2>' . esc_html__('Integration status', 'threekg-revamp') . '</h2><ul class="threekg-checklist"><li class="is-ready">' . esc_html__('Dashboard content structure', 'threekg-revamp') . '</li><li>' . esc_html__('Import existing portfolio data', 'threekg-revamp') . '</li><li>' . esc_html__('Connect homepage templates', 'threekg-revamp') . '</li><li>' . esc_html__('Contact delivery, SEO and deployment', 'threekg-revamp') . '</li></ul></section></div></div>';
}

function threekg_render_site_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }
    $values = get_option('threekg_site_settings', array());
    echo '<div class="wrap threekg-admin"><h1>' . esc_html__('3KG Site Settings', 'threekg-revamp') . '</h1><p>' . esc_html__('Global content shared across the website. Changes are stored now and will appear as templates are connected.', 'threekg-revamp') . '</p>';
    echo '<form action="options.php" method="post">';
    settings_fields('threekg_site_settings_group');
    foreach (threekg_site_settings_schema() as $section) {
        echo '<section class="threekg-panel threekg-settings-section"><h2>' . esc_html($section['title']) . '</h2>';
        foreach ($section['fields'] as $key => $field) {
            $value = isset($values[$key]) ? $values[$key] : (isset($field['default']) ? $field['default'] : '');
            $id = 'threekg-setting-' . sanitize_html_class($key);
            echo '<div class="threekg-field"><label for="' . esc_attr($id) . '"><strong>' . esc_html($field['label']) . '</strong></label>';
            if ('textarea' === $field['type']) {
                echo '<textarea class="large-text" id="' . esc_attr($id) . '" name="threekg_site_settings[' . esc_attr($key) . ']" rows="4">' . esc_textarea($value) . '</textarea>';
            } else {
                $type = in_array($field['type'], array('email', 'url'), true) ? $field['type'] : 'text';
                echo '<div class="threekg-input-row"><input class="regular-text" id="' . esc_attr($id) . '" name="threekg_site_settings[' . esc_attr($key) . ']" type="' . esc_attr($type) . '" value="' . esc_attr($value) . '">';
                if ('media' === $field['type']) {
                    echo '<button class="button threekg-media-button" data-target="#' . esc_attr($id) . '" type="button">' . esc_html__('Choose media', 'threekg-revamp') . '</button>';
                }
                echo '</div>';
            }
            if (!empty($field['description'])) {
                echo '<p class="description">' . esc_html($field['description']) . '</p>';
            }
            echo '</div>';
        }
        echo '</section>';
    }
    submit_button(__('Save site settings', 'threekg-revamp'));
    echo '</form></div>';
}

function threekg_admin_assets($hook) {
    $screen = get_current_screen();
    $allowed_types = array('project', 'service', 'client', 'team_member');
    $is_threekg_page = false !== strpos((string) $hook, 'threekg');
    if (!$is_threekg_page && (!$screen || !in_array($screen->post_type, $allowed_types, true))) {
        return;
    }
    wp_enqueue_media();
    wp_enqueue_style('threekg-admin', get_template_directory_uri() . '/assets/admin.css', array(), wp_get_theme()->get('Version'));
    wp_enqueue_script('threekg-admin', get_template_directory_uri() . '/assets/admin.js', array(), wp_get_theme()->get('Version'), true);
}
add_action('admin_enqueue_scripts', 'threekg_admin_assets');

