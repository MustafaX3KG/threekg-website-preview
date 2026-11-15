# 3KG WordPress dashboard

Theme version 1.7 introduces the structured content layer, project importer and dashboard-driven homepage content for the 3KG website.

## Dashboard areas

- **Projects** — portfolio cases, project disciplines, metadata, stories, galleries and films.
- **Services** — the six studio disciplines and their capability lists.
- **Clients** — monochrome and colour logos, links and display order.
- **Team Members** — profiles and percentage-based positions for the interactive team photograph.
- **Site Settings** — hero, about, contact, footer, SEO and integration values.
- **Import Projects** — previews and safely imports the 23 bundled portfolio cases.

All content types and their fields are available through the authenticated WordPress REST API. Media fields use WordPress Media Library URLs, and normal WordPress post status controls whether an item is published.

## Project import

Open **3KG Website → Import Projects** after activating the theme. The importer reads `assets/profile-data.js`, maps each record to the Project content type and assigns its discipline, metadata, story, gallery and film information.

New projects default to Draft. Each project receives a permanent source ID and source hash, making later imports idempotent:

- unchanged source records are skipped;
- changed source records are updated;
- existing WordPress publication status is preserved;
- the optional force-refresh control deliberately overwrites mapped fields.

Imported images and films continue to use the theme's bundled asset URLs. They are editable from each Project screen but are not duplicated into the Media Library during import.

## Content model notes

- The existing taxonomy name `project_sector` is retained so the current archive template remains compatible.
- Project overview content belongs in the main WordPress editor. The longer case chapter belongs in **Case-study story**.
- Gallery rows use `URL | alt text | caption` until the gallery UI is upgraded to a visual repeater.
- `menu_order` remains available through Page Attributes. The dedicated portfolio-order field is available for deterministic filtering and API consumers.
- Global settings are stored in the single `threekg_site_settings` option.

## Current integration boundary

The homepage portfolio grid, filters and case-study viewer use published WordPress Project records. If no published projects exist, the legacy cards and `assets/profile-data.js` remain active as a safe fallback.

Projects imported as Draft do not replace the legacy homepage. Review them in WordPress first, then publish the approved records. As soon as at least one Project is published, the homepage switches to the dashboard-driven portfolio.

Published Services and Clients replace their legacy homepage lists. Published Team Members update the seven existing interactive photograph hotspots in menu order while retaining the original masks and hover treatment. Empty content types continue to use the legacy content.

Saved global settings update the hero lines and media, About heading and introduction, contact/footer details, social links and homepage metadata. The Google Analytics tag is emitted only when a valid measurement ID has been saved; production still needs an appropriate consent configuration.

## Activation

Activate the theme once to seed the seven project disciplines and refresh the `/work/` rewrite rules. After moving an existing installation, visit **Settings → Permalinks** and save once if project URLs return 404 responses.

