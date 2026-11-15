<?php
/**
 * Connects WordPress project records to the existing homepage UI.
 *
 * The legacy markup and bundled JavaScript data remain as a fallback until at
 * least one published Project exists.
 *
 * @package ThreeKG_Revamp
 */

if (!defined('ABSPATH')) {
    exit;
}

function threekg_project_category_labels() {
    return array(
        'brand' => __('Brand', 'threekg-revamp'),
        'design' => __('Design', 'threekg-revamp'),
        'campaigns' => __('Campaigns', 'threekg-revamp'),
        'production' => __('Production', 'threekg-revamp'),
        'tech' => __('Tech', 'threekg-revamp'),
        'xperience' => __('Xperience', 'threekg-revamp'),
        'selected-work' => __('Selected Work', 'threekg-revamp'),
    );
}

function threekg_get_frontend_project_posts() {
    static $projects = null;
    if (null !== $projects) {
        return $projects;
    }

    $query = new WP_Query(array(
        'post_type' => 'project',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => array('menu_order' => 'ASC', 'title' => 'ASC'),
        'order' => 'ASC',
        'no_found_rows' => true,
    ));

    $projects = array_values(array_filter($query->posts, function ($project) {
        if (!metadata_exists('post', $project->ID, '_3kg_project_published')) {
            return true;
        }
        return rest_sanitize_boolean(get_post_meta($project->ID, '_3kg_project_published', true));
    }));
    return $projects;
}

function threekg_order_project_archives($query) {
    if (is_admin() || !$query->is_main_query() || (!is_post_type_archive('project') && !is_tax('project_sector'))) {
        return;
    }
    $query->set('posts_per_page', -1);
    $query->set('orderby', array('menu_order' => 'ASC', 'title' => 'ASC'));
    $query->set('order', 'ASC');
    $query->set('meta_query', array(
        'relation' => 'OR',
        array(
            'key' => '_3kg_project_published',
            'compare' => 'NOT EXISTS',
        ),
        array(
            'key' => '_3kg_project_published',
            'value' => '1',
            'compare' => '=',
        ),
    ));
}
add_action('pre_get_posts', 'threekg_order_project_archives');

function threekg_project_category($post_id) {
    $terms = get_the_terms($post_id, 'project_sector');
    if (!$terms || is_wp_error($terms)) {
        return 'selected-work';
    }
    return $terms[0]->slug;
}

function threekg_project_id($post_id) {
    $source_id = get_post_meta($post_id, '_3kg_source_id', true);
    return $source_id ? sanitize_key($source_id) : get_post_field('post_name', $post_id);
}

function threekg_split_project_copy($copy) {
    $copy = trim(wp_strip_all_tags(strip_shortcodes((string) $copy)));
    if ('' === $copy) {
        return array();
    }
    return array_values(array_filter(array_map('trim', preg_split('/\R{2,}/', $copy))));
}

function threekg_project_gallery_data($post_id) {
    $lines = preg_split('/\R/', (string) get_post_meta($post_id, '_3kg_project_gallery', true));
    $images = array();
    foreach ($lines as $line) {
        if ('' === trim($line)) {
            continue;
        }
        $parts = array_map('trim', explode('|', $line, 3));
        $url = isset($parts[0]) ? esc_url_raw($parts[0]) : '';
        if (!$url) {
            continue;
        }
        $images[] = array(
            'src' => $url,
            'alt' => isset($parts[1]) && '' !== $parts[1] ? $parts[1] : get_the_title($post_id),
            'caption' => isset($parts[2]) ? $parts[2] : '',
            'width' => 1600,
            'height' => 1000,
        );
    }

    $hero = get_post_meta($post_id, '_3kg_project_hero_image', true);
    $hero_alt = get_post_meta($post_id, '_3kg_project_hero_alt', true);
    if (!$hero) {
        $hero = get_the_post_thumbnail_url($post_id, 'full');
    }
    if ($hero && (!$images || $images[0]['src'] !== $hero)) {
        array_unshift($images, array(
            'src' => esc_url_raw($hero),
            'alt' => $hero_alt ? $hero_alt : get_the_title($post_id),
            'caption' => '',
            'width' => 1600,
            'height' => 1000,
        ));
    }
    return $images;
}

function threekg_project_story_data($post_id) {
    $story = trim((string) get_post_meta($post_id, '_3kg_project_story', true));
    if ('' === $story) {
        return array();
    }

    $sections = array();
    $current = null;
    foreach (preg_split('/\R{2,}/', $story) as $block) {
        $block = trim($block);
        if ('' === $block) {
            continue;
        }
        if (0 === strpos($block, '## ')) {
            if ($current) {
                $sections[] = $current;
            }
            $current = array('title' => trim(substr($block, 3)), 'paragraphs' => array());
        } else {
            if (!$current) {
                $current = array('title' => __('Overview', 'threekg-revamp'), 'paragraphs' => array());
            }
            $current['paragraphs'][] = $block;
        }
    }
    if ($current) {
        $sections[] = $current;
    }
    return $sections;
}

function threekg_project_motion_data($post_id) {
    $url = get_post_meta($post_id, '_3kg_project_motion_url', true);
    if (!$url) {
        return array();
    }
    $title = get_post_meta($post_id, '_3kg_project_motion_title', true);
    return array(array(
        'src' => esc_url_raw($url),
        'poster' => esc_url_raw(get_post_meta($post_id, '_3kg_project_motion_poster', true)),
        'width' => 1280,
        'height' => 720,
        'title' => $title ? $title : get_the_title($post_id),
        'caption' => $title ? $title : get_the_title($post_id),
    ));
}

function threekg_project_javascript_data($project) {
    $post_id = $project->ID;
    $scope = array_values(array_filter(array_map('trim', preg_split('/\R/', (string) get_post_meta($post_id, '_3kg_project_scope', true)))));
    $meta = array_filter(array(
        'Client' => get_post_meta($post_id, '_3kg_project_client', true),
        'Year' => get_post_meta($post_id, '_3kg_project_year', true),
        'Market' => get_post_meta($post_id, '_3kg_project_market', true),
        'Scope' => implode(' · ', $scope),
    ), function ($value) {
        return '' !== $value;
    });

    return array(
        'id' => threekg_project_id($post_id),
        'name' => get_the_title($post_id),
        'category' => threekg_project_category($post_id),
        'title' => get_post_meta($post_id, '_3kg_project_subtitle', true) ?: get_the_excerpt($post_id),
        'body' => threekg_split_project_copy($project->post_content),
        'meta' => $meta,
        'images' => threekg_project_gallery_data($post_id),
        'storySections' => threekg_project_story_data($post_id),
        'motion' => threekg_project_motion_data($post_id),
        'video' => '',
    );
}

function threekg_add_project_javascript_data() {
    if (!is_front_page()) {
        return;
    }
    $projects = threekg_get_frontend_project_posts();
    if (!$projects) {
        return;
    }
    $payload = array(
        'categories' => threekg_project_category_labels(),
        'projects' => array_map('threekg_project_javascript_data', $projects),
    );
    wp_add_inline_script('threekg-profile-data', 'window.ThreeKGProfile = ' . wp_json_encode($payload) . ';', 'after');
}
add_action('wp_enqueue_scripts', 'threekg_add_project_javascript_data', 30);

function threekg_filter_icon($category) {
    $icons = array(
        'brand' => '<circle cx="12" cy="12" r="9"></circle>',
        'design' => '<path d="M12 2v20M2 12h20"></path>',
        'campaigns' => '<path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5"></path>',
        'production' => '<path d="m5 2 17 10L5 22Z"></path>',
        'tech' => '<path d="M3 3h18v18H3Z"></path>',
        'xperience' => '<path d="m3 3 18 18M3 21 21 3"></path>',
        'selected-work' => '<path d="m12 2 9 5v10l-9 5-9-5V7Z"></path>',
    );
    return isset($icons[$category]) ? $icons[$category] : '';
}

function threekg_render_project_work_section($projects) {
    $labels = threekg_project_category_labels();
    $counts = array_fill_keys(array_keys($labels), 0);
    foreach ($projects as $project) {
        $category = threekg_project_category($project->ID);
        if (isset($counts[$category])) {
            $counts[$category]++;
        }
    }

    ob_start();
    ?>
    <div aria-label="<?php esc_attr_e('Filter work by discipline', 'threekg-revamp'); ?>" class="work-filters" role="group">
      <button aria-pressed="true" class="is-active" data-work-filter="all" type="button"><?php esc_html_e('All work', 'threekg-revamp'); ?> <sup><?php echo esc_html(count($projects)); ?></sup></button>
      <?php foreach ($labels as $category => $label) : if (!$counts[$category]) { continue; } ?>
        <button aria-pressed="false" data-work-filter="<?php echo esc_attr($category); ?>" type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><?php echo threekg_filter_icon($category); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></svg><span><?php echo esc_html($label); ?></span><sup><?php echo esc_html($counts[$category]); ?></sup></button>
      <?php endforeach; ?>
    </div>
    <div class="work__editorial portfolio-grid" data-profile-work>
      <?php foreach ($projects as $index => $project) :
          $post_id = $project->ID;
          $project_id = threekg_project_id($post_id);
          $category = threekg_project_category($post_id);
          $images = threekg_project_gallery_data($post_id);
          $image = $images ? $images[0] : array('src' => threekg_fallback_image($index), 'alt' => get_the_title($post_id));
          $scope = array_values(array_filter(array_map('trim', preg_split('/\R/', (string) get_post_meta($post_id, '_3kg_project_scope', true)))));
          $accent = get_post_meta($post_id, '_3kg_project_accent', true) ?: '#30302e';
          ?>
        <a aria-label="<?php echo esc_attr(sprintf(__('%1$s — %2$s. View project', 'threekg-revamp'), get_the_title($post_id), isset($labels[$category]) ? $labels[$category] : $category)); ?>" class="portfolio-card reveal is-in" data-project="<?php echo esc_attr($project_id); ?>" data-work-category="<?php echo esc_attr($category); ?>" href="#project-<?php echo esc_attr($project_id); ?>" style="--project-color:<?php echo esc_attr($accent); ?>"<?php echo $index >= 6 ? ' hidden' : ''; ?>>
          <span class="portfolio-card__image"><img alt="<?php echo esc_attr($image['alt']); ?>" loading="lazy" src="<?php echo esc_url($image['src']); ?>"></span>
          <span class="portfolio-card__overlay"><span class="portfolio-card__details"><small class="mono"><?php echo esc_html(isset($labels[$category]) ? $labels[$category] : $category); ?></small><strong><?php echo esc_html(get_the_title($post_id)); ?></strong><span class="portfolio-card__scope"><?php foreach (array_slice($scope, 0, 3) as $item) : ?><span><?php echo esc_html($item); ?></span><?php endforeach; ?></span><span class="mono portfolio-card__open"><?php esc_html_e('View project ↗', 'threekg-revamp'); ?></span></span></span>
        </a>
      <?php endforeach; ?>
    </div>
    <div class="work__foot reveal"><span aria-live="polite" class="mono" id="workCount"><?php echo esc_html(str_pad((string) min(6, count($projects)), 2, '0', STR_PAD_LEFT) . ' / ' . count($projects) . ' projects'); ?></span><button class="mono" id="showAllWork" type="button"<?php echo count($projects) <= 6 ? ' hidden' : ''; ?>><?php echo esc_html(sprintf(__('view all %d projects ↓', 'threekg-revamp'), count($projects))); ?></button></div>
    </section>
    <?php
    return trim(ob_get_clean());
}

function threekg_get_visible_content($post_type, $visibility_key) {
    $query = new WP_Query(array(
        'post_type' => $post_type,
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => array('menu_order' => 'ASC', 'title' => 'ASC'),
        'order' => 'ASC',
        'no_found_rows' => true,
    ));
    return array_values(array_filter($query->posts, function ($post) use ($visibility_key) {
        if (!metadata_exists('post', $post->ID, $visibility_key)) {
            return true;
        }
        return rest_sanitize_boolean(get_post_meta($post->ID, $visibility_key, true));
    }));
}

function threekg_render_services($services) {
    ob_start();
    ?><ul class="services__list"><?php foreach ($services as $service) :
        $key = get_post_meta($service->ID, '_3kg_service_key', true) ?: $service->post_name;
        $key = sanitize_title($key);
        $scope = array_values(array_filter(array_map('trim', preg_split('/\R/', (string) get_post_meta($service->ID, '_3kg_service_scope', true)))));
        ?><li class="svc-card services__card" data-service="<?php echo esc_attr($key); ?>"><h3 class="svc-card__name"><a aria-describedby="scope-<?php echo esc_attr($key); ?>" aria-label="<?php echo esc_attr(sprintf(__('Explore %s samples', 'threekg-revamp'), get_the_title($service))); ?>" class="service-title" data-filter="<?php echo esc_attr($key); ?>" href="#work"><svg aria-hidden="true" class="service-symbol" viewBox="-120 -120 240 240"></svg><?php echo esc_html(get_the_title($service)); ?></a></h3><ul class="svc-card__scope" id="scope-<?php echo esc_attr($key); ?>"><?php foreach ($scope as $item) : ?><li><?php echo esc_html($item); ?></li><?php endforeach; ?></ul></li><?php endforeach; ?></ul><?php
    return trim(ob_get_clean());
}

function threekg_render_clients($clients) {
    ob_start();
    ?><ul class="clients__grid client-wall"><?php foreach ($clients as $client) :
        $sector = get_post_meta($client->ID, '_3kg_client_sector', true);
        $logo = get_post_meta($client->ID, '_3kg_client_logo_color', true) ?: get_post_meta($client->ID, '_3kg_client_logo_dark', true);
        if (!$logo) {
            $logo = get_the_post_thumbnail_url($client->ID, 'full');
        }
        $alt = get_post_meta($client->ID, '_3kg_client_logo_alt', true) ?: get_the_title($client);
        $color = get_post_meta($client->ID, '_3kg_client_color', true) ?: '#30302e';
        ?><li><button aria-expanded="false" aria-label="<?php echo esc_attr(get_the_title($client) . ($sector ? ' — ' . $sector : '')); ?>" class="client-tile" style="--client-color:<?php echo esc_attr($color); ?>" type="button"><span aria-hidden="true" class="client-tile__mark"><?php if ($logo) : ?><img alt="<?php echo esc_attr($alt); ?>" loading="lazy" src="<?php echo esc_url($logo); ?>"><?php else : ?><strong><?php echo esc_html(get_the_title($client)); ?></strong><?php endif; ?></span><span aria-hidden="true" class="client-tile__details"><strong><?php echo esc_html(get_the_title($client)); ?></strong><?php if ($sector) : ?><span><?php echo esc_html($sector); ?></span><?php endif; ?></span></button></li><?php endforeach; ?></ul><?php
    return trim(ob_get_clean());
}

function threekg_render_contact_footer() {
    $email = threekg_get_site_setting('contact_email');
    $phone = threekg_get_site_setting('contact_phone');
    $address = threekg_get_site_setting('contact_address');
    $website = threekg_get_site_setting('website_url', home_url('/'));
    $cta = threekg_get_site_setting('contact_cta_label', __('Start a conversation', 'threekg-revamp'));
    $copyright = threekg_get_site_setting('footer_copyright', '© ' . wp_date('Y') . ' 3KG');
    $cta_url = $email ? 'mailto:' . antispambot($email) : $website;
    ob_start();
    ?><footer class="footer" id="contact"><span class="mono footer__cap reveal"><?php esc_html_e('(get in touch)', 'threekg-revamp'); ?></span><a class="footer__cta reveal" href="<?php echo esc_url($cta_url); ?>"><?php echo esc_html($cta); ?> <span class="footer__arrow">↗</span></a><div class="footer__grid"><div class="mono footer__col"><span class="footer__label"><?php esc_html_e('studio', 'threekg-revamp'); ?></span><span>3KG</span><?php if ($address) : ?><span><?php echo nl2br(esc_html($address)); ?></span><?php endif; ?><?php if ($phone) : ?><a href="tel:<?php echo esc_attr(preg_replace('/[^0-9+]/', '', $phone)); ?>"><?php echo esc_html($phone); ?></a><?php endif; ?><?php if ($email) : ?><a href="mailto:<?php echo esc_attr(antispambot($email)); ?>"><?php echo esc_html(antispambot($email)); ?></a><?php endif; ?></div><div class="mono footer__col"><span class="footer__label"><?php esc_html_e('web', 'threekg-revamp'); ?></span><a href="<?php echo esc_url($website); ?>"><?php echo esc_html(wp_parse_url($website, PHP_URL_HOST) ?: $website); ?> ↗</a><?php if (threekg_get_site_setting('instagram_url')) : ?><a href="<?php echo esc_url(threekg_get_site_setting('instagram_url')); ?>" rel="noopener" target="_blank">Instagram ↗</a><?php endif; ?><?php if (threekg_get_site_setting('linkedin_url')) : ?><a href="<?php echo esc_url(threekg_get_site_setting('linkedin_url')); ?>" rel="noopener" target="_blank">LinkedIn ↗</a><?php endif; ?></div><div class="mono footer__col"><span class="footer__label"><?php esc_html_e('explore', 'threekg-revamp'); ?></span><a href="#work"><?php esc_html_e('Work ↗', 'threekg-revamp'); ?></a><a href="#services"><?php esc_html_e('What we do ↗', 'threekg-revamp'); ?></a><a href="#top"><?php esc_html_e('Back to top ↑', 'threekg-revamp'); ?></a><span><?php echo esc_html($copyright); ?></span></div></div></footer><?php
    return trim(ob_get_clean());
}

function threekg_replace_once($pattern, $replacement, $subject, &$count = null) {
    return preg_replace_callback($pattern, function () use ($replacement) {
        return $replacement;
    }, $subject, 1, $count);
}

function threekg_apply_global_homepage_settings($html) {
    $settings = get_option('threekg_site_settings', array());
    if (!$settings) {
        return $html;
    }
    if (!empty($settings['hero_line_one'])) {
        $html = preg_replace_callback('#(<span class="hero-line hero-line--strategy">).*?(</span>)#s', function ($matches) use ($settings) { return $matches[1] . esc_html($settings['hero_line_one']) . $matches[2]; }, $html, 1);
    }
    if (!empty($settings['hero_line_two'])) {
        $html = preg_replace_callback('#(<span class="hero-line hero-line--impact">).*?(</span>)#s', function ($matches) use ($settings) { return $matches[1] . esc_html($settings['hero_line_two']) . $matches[2]; }, $html, 1);
    }
    if (!empty($settings['hero_poster'])) {
        $html = preg_replace_callback('#(<video[^>]+id="brandFilm"[^>]+poster=")[^"]*(")#s', function ($matches) use ($settings) { return $matches[1] . esc_url($settings['hero_poster']) . $matches[2]; }, $html, 1);
    }
    if (!empty($settings['hero_video'])) {
        $html = preg_replace_callback('#(<video[^>]+id="brandFilm".*?<source src=")[^"]*(")#s', function ($matches) use ($settings) { return $matches[1] . esc_url($settings['hero_video']) . $matches[2]; }, $html, 1);
    }
    if (!empty($settings['about_heading'])) {
        $heading = nl2br(esc_html($settings['about_heading']));
        $html = preg_replace_callback('#(<div class="studio-intro__identity">.*?<h2>).*?(</h2>)#s', function ($matches) use ($heading) { return $matches[1] . $heading . $matches[2]; }, $html, 1);
    }
    if (!empty($settings['about_intro'])) {
        $intro = nl2br(esc_html($settings['about_intro']));
        $html = preg_replace_callback('#(<p class="studio-intro__lead">).*?(</p>)#s', function ($matches) use ($intro) { return $matches[1] . $intro . $matches[2]; }, $html, 1);
    }
    return threekg_replace_once('#<footer class="footer" id="contact">.*?</footer>#s', threekg_render_contact_footer(), $html);
}

function threekg_add_team_javascript_data() {
    if (!is_front_page()) {
        return;
    }
    $members = threekg_get_visible_content('team_member', '_3kg_team_published');
    if (!$members) {
        return;
    }
    $payload = array();
    foreach (array_slice($members, 0, 7) as $member) {
        $x = get_post_meta($member->ID, '_3kg_team_hotspot_x', true);
        $y = get_post_meta($member->ID, '_3kg_team_hotspot_y', true);
        $payload[] = array(
            'name' => get_the_title($member),
            'specialty' => get_post_meta($member->ID, '_3kg_team_specialty', true) ?: get_post_meta($member->ID, '_3kg_team_role', true),
            'x' => '' === $x ? 50 : (float) $x,
            'y' => '' === $y ? 50 : (float) $y,
        );
    }
    $script = '(function(members){document.querySelectorAll(".team-hotspot").forEach(function(hotspot,index){var member=members[index];if(!member)return;hotspot.style.setProperty("--person-x",member.x+"%");hotspot.style.setProperty("--person-y",member.y+"%");hotspot.setAttribute("aria-label",member.name+": "+member.specialty);var name=hotspot.querySelector("strong");var specialty=hotspot.querySelector(".team-hotspot__label span");if(name)name.textContent=member.name;if(specialty)specialty.textContent=member.specialty;});})(' . wp_json_encode($payload) . ');';
    wp_add_inline_script('threekg-website', $script, 'after');
}
add_action('wp_enqueue_scripts', 'threekg_add_team_javascript_data', 40);

function threekg_output_site_meta() {
    if (!is_front_page()) {
        return;
    }
    $description = threekg_get_site_setting('default_meta_description');
    $social_image = threekg_get_site_setting('default_social_image');
    $verification = threekg_get_site_setting('google_site_verification');
    if ($description) {
        echo '<meta name="description" content="' . esc_attr($description) . '">' . "\n";
        echo '<meta property="og:description" content="' . esc_attr($description) . '">' . "\n";
    }
    if ($social_image) {
        echo '<meta property="og:image" content="' . esc_url($social_image) . '">' . "\n";
    }
    if ($verification) {
        echo '<meta name="google-site-verification" content="' . esc_attr($verification) . '">' . "\n";
    }
}
add_action('wp_head', 'threekg_output_site_meta', 5);

function threekg_enqueue_analytics() {
    $measurement_id = strtoupper(threekg_get_site_setting('google_analytics_id'));
    if (!$measurement_id || !preg_match('/^G-[A-Z0-9]+$/', $measurement_id)) {
        return;
    }
    wp_enqueue_script('threekg-google-analytics', 'https://www.googletagmanager.com/gtag/js?id=' . rawurlencode($measurement_id), array(), null, false);
    wp_add_inline_script('threekg-google-analytics', "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config'," . wp_json_encode($measurement_id) . ');', 'after');
}
add_action('wp_enqueue_scripts', 'threekg_enqueue_analytics', 50);

function threekg_render_dynamic_homepage($html) {
    $projects = threekg_get_frontend_project_posts();
    if ($projects) {
        $pattern = '#<div aria-label="Filter work by discipline".*?</section>(?=<section class="clients" id="clients">)#s';
        $replacement = threekg_render_project_work_section($projects);
        $result = threekg_replace_once($pattern, $replacement, $html, $count);
        if (1 === $count) {
            $html = $result;
        }
    }

    $services = threekg_get_visible_content('service', '_3kg_service_published');
    if ($services) {
        $html = threekg_replace_once('#<ul class="services__list">.*?</ul>(?=\s*</div>\s*</section><section class="work")#s', threekg_render_services($services), $html);
    }

    $clients = threekg_get_visible_content('client', '_3kg_client_published');
    if ($clients) {
        $html = threekg_replace_once('#<ul class="clients__grid client-wall">.*?</ul>(?=\s*<div class="work__foot reveal">)#s', threekg_render_clients($clients), $html);
    }

    return threekg_apply_global_homepage_settings($html);
}

