<?php
ini_set('memory_limit', '-1');
set_time_limit(0);

/*
 * Генерирует sitemap
 */
define('CONNECTION', true);
require_once(__DIR__ . '/config.dist.php');

$options = getopt("d:");

if (empty($options['d'])) {
    $domain = $_SERVER['SERVER_NAME'];
} else {
    $domain = $options['d'];
}

$domainParts = explode('.', $domain);
$subdomain = 'main';

if (count($domainParts) == 3) {
    $subdomain = $domainParts[0];
}


$indexContent = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
$indexContent .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";





/////// OTHER /////////
$sitemapName = 'sitemap-' . $subdomain . '-oth.xml';

$fname = __DIR__ . '/../public/sitemaps/' . $sitemapName;

if (!$handle = fopen($fname, 'w+')) {
    return false;
}

$content = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
$content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

if (fwrite($handle, $content) === FALSE) {
    return false;
}

$others = [];

$sitePages = $db->query("
  SELECT
    url
  FROM adv_site_content
  WHERE page_type = 1 and id <> 1 AND NOT url LIKE '/cp/%'
")->fetch_assoc_array();

foreach ($sitePages as $sitePage) {
    $others[] = $sitePage['url'];
}

$others[] = '/countries/';

$countryPages = $db->query("
  SELECT
    c.alpha2
  FROM adv_countries c
  LEFT JOIN adv_locations_has_adverts ha ON ha.location_id = c.id_location
  WHERE ha.has_adverts = 1
")->fetch_assoc_array();

foreach ($countryPages as $countryPage) {
    $others[] = '/cities/' . $countryPage['alpha2'] . '/';
}

foreach ($others as $other) {
    $url = 'https://' . $domain . $other;

    $content = "\t" . '<url>' . "\n";
    $content .= "\t\t" . '<loc>' . $url . '</loc>' . "\n";
    $content .= "\t\t" . '<lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
    $content .= "\t\t" . '<changefreq>always</changefreq>' . "\n";
    $content .= "\t\t" . '<priority>1.0</priority>' . "\n";
    $content .= "\t" . '</url>' . "\n";

    if (fwrite($handle, $content) === FALSE) {
        return false;
    }
}

$content = '</urlset>';

if (fwrite($handle, $content) === FALSE) {
    return false;
}

fclose($handle);

$indexContent .= "\t" . '<sitemap>' . "\n";
$indexContent .= "\t\t" . '<loc>https://' . $domain . '/sitemaps/' . $sitemapName . '</loc>' . "\n";
$indexContent .= "\t\t" . '<lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
$indexContent .= "\t" . '</sitemap>' . "\n";



///////// COUNTRIES ////////
$countries = $db->query("
  SELECT
    c.alpha2,
    c.id_location
  FROM adv_countries c
  LEFT JOIN adv_locations_has_adverts ha ON ha.location_id = c.id_location
  WHERE ha.has_adverts = 1
")->fetch_assoc_array();

foreach ($countries as $country) {
    $points_count = $db->query('
        SELECT
          count(l.id)
        FROM adv_locations l
        LEFT JOIN adv_locations_has_adverts ha ON ha.location_id = l.id
        WHERE ha.has_adverts = 1 AND l.root_id = ?i
    ', $country['id_location'])->getOne();

    $limit = 50000;

    $i = 1;
    for ($offset = 0; $offset <= $points_count; $offset += $limit) {
        $sitemapName = 'sitemap-' . $subdomain . '-locs-' . $country['alpha2'] . '-' . $i . '.xml';

        $fname = __DIR__ . '/../sitemaps/' . $sitemapName;

        if (!$handle = fopen($fname, 'w+')) {
            return false;
        }

        $content = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        if (fwrite($handle, $content) === FALSE) {
            return false;
        }

        $points = $db->query("
            SELECT
              l.id,
              l.slug
            FROM adv_locations l
            LEFT JOIN adv_locations_has_adverts ha ON ha.location_id = l.id
            WHERE ha.has_adverts = 1 AND l.root_id = ?i
            LIMIT $offset, $limit
        ", $country['id_location']);

        while (($point = $points->fetch_assoc())) {

            $pointSlug = $point['slug'];
            if ($country['id_location'] === $point['id']) {
                $pointSlug = 'all';
            }

            $url = 'https://' . $domain . '/' . $country['alpha2'] . '/' . $pointSlug . '/';

            $content = "\t" . '<url>' . "\n";
            $content .= "\t\t" . '<loc>' . $url . '</loc>' . "\n";
            $content .= "\t\t" . '<lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
            $content .= "\t\t" . '<changefreq>always</changefreq>' . "\n";
            $content .= "\t\t" . '<priority>1.0</priority>' . "\n";
            $content .= "\t" . '</url>' . "\n";

            if (fwrite($handle, $content) === FALSE) {
                return false;
            }
        }

        $content = '</urlset>';

        if (fwrite($handle, $content) === FALSE) {
            return false;
        }

        fclose($handle);


        $indexContent .= "\t" . '<sitemap>' . "\n";
        $indexContent .= "\t\t" . '<loc>https://' . $domain . '/sitemaps/' . $sitemapName . '</loc>' . "\n";
        $indexContent .= "\t\t" . '<lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
        $indexContent .= "\t" . '</sitemap>' . "\n";

        $i++;
    }
}




//////// ADVERTS /////////
$advs_count = $db->query('
    SELECT count(id) FROM adv_adverts WHERE is_published = 1
')->getOne();

$limit = 50000;

$i = 1;
for ($offset = 0; $offset <= $advs_count; $offset += $limit) {
    $sitemapName = 'sitemap-' . $subdomain . '-advs-' . $i . '.xml';

    $fname = __DIR__ . '/../sitemaps/' . $sitemapName;

    if (!$handle = fopen($fname, 'w+')) {
        return false;
    }

    $content = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    if (fwrite($handle, $content) === FALSE) {
        return false;
    }

    $advs = $db->query("
        SELECT url, date_updated FROM adv_adverts WHERE is_published = 1 LIMIT $offset, $limit
    ");

    while (($adv = $advs->fetch_assoc())) {
        $url = 'https://' . $domain . $adv['url'];

        $content = "\t" . '<url>' . "\n";
        $content .= "\t\t" . '<loc>' . $url . '</loc>' . "\n";
        $content .= "\t\t" . '<lastmod>' . date('Y-m-d', $adv['date_updated']) . '</lastmod>' . "\n";
        $content .= "\t\t" . '<changefreq>always</changefreq>' . "\n";
        $content .= "\t\t" . '<priority>1.0</priority>' . "\n";
        $content .= "\t" . '</url>' . "\n";

        if (fwrite($handle, $content) === FALSE) {
            return false;
        }
    }

    $content = '</urlset>';

    if (fwrite($handle, $content) === FALSE) {
        return false;
    }

    fclose($handle);


    $indexContent .= "\t" . '<sitemap>' . "\n";
    $indexContent .= "\t\t" . '<loc>https://' . $domain . '/sitemaps/' . $sitemapName . '</loc>' . "\n";
    $indexContent .= "\t\t" . '<lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
    $indexContent .= "\t" . '</sitemap>' . "\n";

    $i++;
}



/////// CATEGORIES /////////

$categories = $db->query("
    SELECT id, slug_id FROM adv_category WHERE id <> 2009
");

$categoriesArr = [];

while (($category = $categories->fetch_assoc())) {
    $p = $category['id'];
    $cat_path = [];
    $cat_path[] = $category['slug_id'];
    while (($p = $db->query("SELECT id_parent FROM adv_category WHERE id=?i", $p)->getOne()) != 0) {
        $slugp = $db->query("SELECT slug_id FROM adv_category WHERE id=?i", $p)->getOne();

        $cat_path[] = $slugp;
    }

    $categoriesArr[] = implode('/', array_reverse($cat_path));
}


$countries = $db->query("
  SELECT
    c.alpha2,
    c.id_location
  FROM adv_countries c
  LEFT JOIN adv_locations_has_adverts ha ON ha.location_id = c.id_location
  WHERE ha.has_adverts = 1
")->fetch_assoc_array();

foreach ($countries as $country) {
    $points = $db->query("
        SELECT
          l.id,
          l.slug
        FROM adv_locations l
        LEFT JOIN adv_locations_has_adverts ha ON ha.location_id = l.id
        WHERE ha.has_adverts = 1 AND l.root_id = ?i
    ", $country['id_location']);

    $limit = 50000;

    $i = 0;
    $j = 0;

    $catLinks = [];

    while (($point = $points->fetch_assoc())) {
        $pointSlug = $point['slug'];
        if ($country['id_location'] === $point['id']) {
            $pointSlug = 'all';
        }

        foreach ($categoriesArr as $category) {
            $j++;

            $url = 'https://' . $domain . '/' . $country['alpha2'] . '/' . $pointSlug . '/' . $category;

            $catLinks[] = $url;

            if ($j === $limit) {
                $j = 0;
                $i++;

                $sitemapName = 'sitemap-' . $subdomain . '-cats-' . $country['alpha2'] . '-' . $i . '.xml';

                $fname = __DIR__ . '/../sitemaps/' . $sitemapName;

                if (!$handle = fopen($fname, 'w+')) {
                    return false;
                }

                $content = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
                $content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

                if (fwrite($handle, $content) === FALSE) {
                    return false;
                }



                foreach ($catLinks as $catLink) {
                    $content = "\t" . '<url>' . "\n";
                    $content .= "\t\t" . '<loc>' . $catLink . '</loc>' . "\n";
                    $content .= "\t\t" . '<lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
                    $content .= "\t\t" . '<changefreq>always</changefreq>' . "\n";
                    $content .= "\t\t" . '<priority>1.0</priority>' . "\n";
                    $content .= "\t" . '</url>' . "\n";

                    if (fwrite($handle, $content) === FALSE) {
                        return false;
                    }
                }



                $content = '</urlset>';

                if (fwrite($handle, $content) === FALSE) {
                    return false;
                }

                fclose($handle);


                $indexContent .= "\t" . '<sitemap>' . "\n";
                $indexContent .= "\t\t" . '<loc>https://' . $domain . '/sitemaps/' . $sitemapName . '</loc>' . "\n";
                $indexContent .= "\t\t" . '<lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
                $indexContent .= "\t" . '</sitemap>' . "\n";

                $catLinks = [];
            }
        }
    }


    if (!empty($catLinks)) {
        $i++;

        $sitemapName = 'sitemap-' . $subdomain . '-cats-' . $country['alpha2'] . '-' . $i . '.xml';

        $fname = __DIR__ . '/../sitemaps/' . $sitemapName;

        if (!$handle = fopen($fname, 'w+')) {
            return false;
        }

        $content = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        if (fwrite($handle, $content) === FALSE) {
            return false;
        }



        foreach ($catLinks as $catLink) {
            $content = "\t" . '<url>' . "\n";
            $content .= "\t\t" . '<loc>' . $catLink . '</loc>' . "\n";
            $content .= "\t\t" . '<lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
            $content .= "\t\t" . '<changefreq>always</changefreq>' . "\n";
            $content .= "\t\t" . '<priority>1.0</priority>' . "\n";
            $content .= "\t" . '</url>' . "\n";

            if (fwrite($handle, $content) === FALSE) {
                return false;
            }
        }



        $content = '</urlset>';

        if (fwrite($handle, $content) === FALSE) {
            return false;
        }

        fclose($handle);


        $indexContent .= "\t" . '<sitemap>' . "\n";
        $indexContent .= "\t\t" . '<loc>https://' . $domain . '/sitemaps/' . $sitemapName . '</loc>' . "\n";
        $indexContent .= "\t\t" . '<lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
        $indexContent .= "\t" . '</sitemap>' . "\n";
    }
}

//////// USERS /////////
$users_count = $db->query('
    SELECT 
      count(u.id)
    FROM adv_users u
    LEFT JOIN adv_adverts a ON a.id_user = u.id
    WHERE u.is_blocked = 0 AND (a.is_published = 1 OR a.is_sold = 1)
')->getOne();

$limit = 50000;

$i = 1;
for ($offset = 0; $offset <= $users_count; $offset += $limit) {
    $sitemapName = 'sitemap-' . $subdomain . '-usrs-' . $i . '.xml';

    $fname = __DIR__ . '/../sitemaps/' . $sitemapName;

    if (!$handle = fopen($fname, 'w+')) {
        return false;
    }

    $content = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $content .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

    if (fwrite($handle, $content) === FALSE) {
        return false;
    }

    $users = $db->query("
        SELECT
          u.hash, u.online_lasttime
        FROM adv_users u
        LEFT JOIN adv_adverts a ON a.id_user = u.id
        WHERE u.is_blocked = 0 AND (a.is_published = 1 OR a.is_sold = 1)
        LIMIT $offset, $limit
    ");

    while (($user = $users->fetch_assoc())) {
        $url = 'https://' . $domain . '/user/' . $user['hash'];

        $content = "\t" . '<url>' . "\n";
        $content .= "\t\t" . '<loc>' . $url . '</loc>' . "\n";
        $content .= "\t\t" . '<lastmod>' . date('Y-m-d', ($user['online_lasttime'] == 0 ? time() : $user['online_lasttime'])) . '</lastmod>' . "\n";
        $content .= "\t\t" . '<changefreq>always</changefreq>' . "\n";
        $content .= "\t\t" . '<priority>1.0</priority>' . "\n";
        $content .= "\t" . '</url>' . "\n";

        if (fwrite($handle, $content) === FALSE) {
            return false;
        }
    }

    $content = '</urlset>';

    if (fwrite($handle, $content) === FALSE) {
        return false;
    }

    fclose($handle);


    $indexContent .= "\t" . '<sitemap>' . "\n";
    $indexContent .= "\t\t" . '<loc>https://' . $domain . '/sitemaps/' . $sitemapName . '</loc>' . "\n";
    $indexContent .= "\t\t" . '<lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
    $indexContent .= "\t" . '</sitemap>' . "\n";

    $i++;
}





//////// SITEMAP /////////
$indexContent .= '</sitemapindex>' . "\n";

$fname = __DIR__ . '/../sitemaps/sitemap-' . $subdomain . '.xml';
if (!$handle = fopen($fname, 'w+')) {
    return false;
}

if (fwrite($handle, $indexContent) === FALSE) {
    return false;
}

fclose($handle);