<?php
/**
 * Content types used by the 3KG website dashboard.
 *
 * @package ThreeKG_Revamp
 */

if (!defined('ABSPATH')) {
    exit;
}

function threekg_content_type_labels($singular, $plural) {
    return array(
        'name' => $plural,
        'singular_name' => $singular,
        'add_new' => sprintf(__('Add %s', 'threekg-revamp'), $singular),
        'add_new_item' => sprintf(__('Add New %s', 'threekg-revamp'), $singular),
        'edit_item' => sprintf(__('Edit %s', 'threekg-revamp'), $singular),
        'new_item' => sprintf(__('New %s', 'threekg-revamp'), $singular),
        'view_item' => sprintf(__('View %s', 'threekg-revamp'), $singular),
        'search_items' => sprintf(__('Search %s', 'threekg-revamp'), $plural),
        'not_found' => sprintf(__('No %s found.', 'threekg-revamp'), strtolower($plural)),
        'not_found_in_trash' => sprintf(__('No %s found in Trash.', 'threekg-revamp'), strtolower($plural)),
        'all_items' => sprintf(__('All %s', 'threekg-revamp'), $plural),
        'archives' => sprintf(__('%s Archives', 'threekg-revamp'), $singular),
        'attributes' => sprintf(__('%s Attributes', 'threekg-revamp'), $singular),
        'menu_name' => $plural,
    );
}

function threekg_register_content_types() {
    $shared = array(
        'public' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'show_in_menu' => 'threekg-dashboard',
        'map_meta_cap' => true,
    );

    register_post_type('project', array_merge($shared, array(
        'labels' => threekg_content_type_labels(__('Project', 'threekg-revamp'), __('Projects', 'threekg-revamp')),
        'description' => __('Portfolio case studies displayed across the website.', 'threekg-revamp'),
        'menu_icon' => 'dashicons-portfolio',
        'has_archive' => true,
        'rewrite' => array('slug' => 'work', 'with_front' => false),
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'page-attributes', 'custom-fields'),
        'rest_base' => 'projects',
    )));

    register_post_type('service', array_merge($shared, array(
        'labels' => threekg_content_type_labels(__('Service', 'threekg-revamp'), __('Services', 'threekg-revamp')),
        'description' => __('The disciplines and capabilities shown in the Services section.', 'threekg-revamp'),
        'menu_icon' => 'dashicons-admin-tools',
        'has_archive' => false,
        'rewrite' => array('slug' => 'services', 'with_front' => false),
        'supports' => array('title', 'editor', 'thumbnail', 'revisions', 'page-attributes', 'custom-fields'),
        'rest_base' => 'services',
    )));

    register_post_type('client', array_merge($shared, array(
        'labels' => threekg_content_type_labels(__('Client', 'threekg-revamp'), __('Clients', 'threekg-revamp')),
        'description' => __('Client logos and links shown in the Clients section.', 'threekg-revamp'),
        'menu_icon' => 'dashicons-groups',
        'has_archive' => false,
        'rewrite' => false,
        'supports' => array('title', 'thumbnail', 'revisions', 'page-attributes', 'custom-fields'),
        'rest_base' => 'clients',
    )));

    register_post_type('team_member', array_merge($shared, array(
        'labels' => threekg_content_type_labels(__('Team Member', 'threekg-revamp'), __('Team Members', 'threekg-revamp')),
        'description' => __('People and hotspot positions used by the interactive Team section.', 'threekg-revamp'),
        'menu_icon' => 'dashicons-businessperson',
        'has_archive' => false,
        'rewrite' => false,
        'supports' => array('title', 'editor', 'thumbnail', 'revisions', 'page-attributes', 'custom-fields'),
        'rest_base' => 'team',
    )));

    register_taxonomy('project_sector', array('project'), array(
        'labels' => array(
            'name' => __('Disciplines', 'threekg-revamp'),
            'singular_name' => __('Discipline', 'threekg-revamp'),
            'search_items' => __('Search Disciplines', 'threekg-revamp'),
            'all_items' => __('All Disciplines', 'threekg-revamp'),
            'edit_item' => __('Edit Discipline', 'threekg-revamp'),
            'update_item' => __('Update Discipline', 'threekg-revamp'),
            'add_new_item' => __('Add New Discipline', 'threekg-revamp'),
            'new_item_name' => __('New Discipline Name', 'threekg-revamp'),
            'menu_name' => __('Disciplines', 'threekg-revamp'),
        ),
        'description' => __('Brand, Design, Campaigns, Production, Tech, Xperience and Selected Work.', 'threekg-revamp'),
        'public' => true,
        'hierarchical' => false,
        'show_admin_column' => true,
        'show_in_rest' => true,
        'rewrite' => array('slug' => 'discipline', 'with_front' => false),
    ));
}
add_action('init', 'threekg_register_content_types');

function threekg_seed_disciplines() {
    $disciplines = array('Brand', 'Design', 'Campaigns', 'Production', 'Tech', 'Xperience', 'Selected Work');
    foreach ($disciplines as $discipline) {
        if (!term_exists($discipline, 'project_sector')) {
            wp_insert_term($discipline, 'project_sector');
        }
    }
}

function threekg_flush_rewrites_on_switch() {
    threekg_register_content_types();
    threekg_seed_disciplines();
    flush_rewrite_rules();
}
add_action('after_switch_theme', 'threekg_flush_rewrites_on_switch');

