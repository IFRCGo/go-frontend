### Release 4.4.3 - Multilingual Maps

 - Implement multilingual map labels
 - Fix issue with countries spanning the date line: https://github.com/IFRCGo/go-frontend/issues/1629
 - Includes hotfix to change header to point to GO survey

### Release 4.4.2 - Bugfix

Use default language `en` while editing a field report, fixes #1625


### Release 4.4.1 - Bugfix Release

Fixes a couple of critical issues:

 - National Society dropdowns not working on register page: https://github.com/IFRCGo/go-frontend/issues/1627
 - Issues with editing content in multiple languages in the Admin: https://github.com/IFRCGo/go-frontend/issues/1622 

### Release 4.4.0 - Safar(i)

_Safar_ / _Safari_ : A journey / expedition.

Release 4.4.0, codename `Safari`, has been a journey across languages, cultures and continents. Major updates in this release include translations of the platform into the 4 official languages of the IFRC. The release also includes a major overhaul of our handling of geo data, making spatial data a core part of the GO API.

Details about API changes in this release can be found here: https://github.com/IFRCGo/go-frontend/wiki/GO-API-Changes-v4.4.0---Safari

### Frontend

 - Validation fixes on Field Report form: https://github.com/IFRCGo/go-frontend/issues/1189
 - Fix Source issue on Field Report form: https://github.com/IFRCGo/go-frontend/issues/987
 - Link URLs in field report submission: https://github.com/IFRCGo/go-frontend/issues/1108
 - Clear Districts dropdown when Country dropdown is cleared in Field Report form: https://github.com/IFRCGo/go-frontend/commit/bff2f16ce6c5ef7c4b08bc8a9536d95e75ffb2e7
 - Prefetch data and add an initial loading screen: https://github.com/IFRCGo/go-frontend/issues/1386
 - Move all geospatial strings to come from API: https://github.com/IFRCGo/go-frontend/issues/1534
 - Implement translations of all static strings on frontend: https://github.com/IFRCGo/go-frontend/issues/1238
 - Create UI to manage translations: https://github.com/IFRCGo/go-frontend/issues/1240
 - Fix visibility of field reports for IFRC admins: https://github.com/IFRCGo/go-frontend/issues/1501


### Backend

 - Remove old EPI fields from backend - https://github.com/IFRCGo/go-frontend/issues/1161
 - Add Rich Text Editor support to Admin fields - https://github.com/IFRCGo/go-api/issues/670
 - Fix encoding issue with Rich Text Editor fields - https://github.com/IFRCGo/go-api/issues/837
 - Implement end-points for Tableau Web Data Connector - https://github.com/IFRCGo/go-api/issues/743
 - Management command to import geo-data from shape-field - https://github.com/IFRCGo/go-frontend/issues/938
 - Addition of centroid and bbox fields to geospatial elements in the API - https://github.com/IFRCGo/go-frontend/issues/938
 - Translation of static strings in the backend - https://github.com/IFRCGo/go-api/issues/774
 - Translations for all model text fields in the backend - https://github.com/IFRCGo/go-api/issues/719
 - Setup `Celery` to handle async translation job-flows - https://github.com/IFRCGo/go-api/issues/819
 - Add `is_ifrc_admin` boolean to users end-point in the API - https://github.com/IFRCGo/go-api/pull/845
 - Refactor views to use APIViews - https://github.com/IFRCGo/go-api/pull/840
 - Implement resending verification email - https://github.com/IFRCGo/go-api/issues/737
 - Fix Azure Storage class to help tests + local development - https://github.com/IFRCGo/go-api/issues/825
 - Change FDRS auth to use API key - https://github.com/IFRCGo/go-api/issues/851
 - Add labels to Region model in the backend - https://github.com/IFRCGo/go-api/pull/858
 - Change ElasticSearch configuration settings to improve stability - https://github.com/IFRCGo/go-frontend/issues/1353
 - Fix PDF scraper errors and added more information about errors to logs - https://github.com/IFRCGo/go-api/issues/863
 - Fix ingest_databank error - https://github.com/IFRCGo/go-api/pull/856
 - Removed child Emergencies from appearing in dropdowns - https://github.com/IFRCGo/go-frontend/issues/1487
 - Added 'Activate users' action and 'User is active' column to Pending Users page - https://github.com/IFRCGo/go-api/issues/766
 - Simplify CSV export on Emergencies end-point - https://github.com/IFRCGo/go-api/issues/708

### Release 4.3.12

Hotfix release: Fix undefined string for Potentially Affected in Field Report frontend

### Release 4.3.11

This release includes a lot of code changes to support future translations support, as well as significant changes toward implementing updated site designs.

Frontend:

 - Replace all strings on the frontend with translatable strings: https://github.com/IFRCGo/go-frontend/issues/1239
 - Use new grid framework for styling, to support RTL languages: https://github.com/IFRCGo/go-frontend/issues/1382
 - Update styles across the site to match new designs:
   - UI Elements Update: https://github.com/IFRCGo/go-frontend/issues/1325
   - Update Key Figures Styling: https://github.com/IFRCGo/go-frontend/issues/1324
   - Table styling across platform: https://github.com/IFRCGo/go-frontend/issues/1203
   - Styling cleanup of Highlighted Operations + Adding Follow buttons: https://github.com/IFRCGo/go-frontend/issues/1206
 - Improvements to Signup Workflow: https://github.com/IFRCGo/go-frontend/issues/1233
 - Fix Create a Report dropdown on mobile: https://github.com/IFRCGo/go-frontend/issues/1363
 - Rename Subscribe / Unsubscribe to Follow / Unfollow on Emergency page: https://github.com/IFRCGo/go-frontend/issues/1370

Backend:

 - Update Docker base image for deploy, to support future Geospatial work: https://github.com/IFRCGo/go-api/pull/807
 - Optimize queries / improve performance of Events API endpoint: https://github.com/IFRCGo/go-api/issues/763
 - Optimize queries / improve performance of Appeals endpoint: https://github.com/IFRCGo/go-api/pull/828
 - Fix typo in cronjob: https://github.com/IFRCGo/go-api/issues/826
 - Add User Profile to User Admin page: https://github.com/IFRCGo/go-frontend/issues/956#issuecomment-659182089


### Release 4.3.10

Hotfix release to add links to KoBo forms in Dropdown: https://github.com/IFRCGo/go-frontend/issues/1363

### Release 4.3.9

Frontend:

 - 3w: Make fields not required if reporting society is ICRC: https://github.com/IFRCGo/go-frontend/issues/1334
 - 3w: Project completed changes budget field to actual expenditure: https://github.com/IFRCGo/go-frontend/issues/1319
 - Fix display of country, region in field report listing on Emergency pages: https://github.com/IFRCGo/go-frontend/issues/1122
 - Fix redirect of Add Report button to go to Emergency page in Admin: https://github.com/IFRCGo/go-frontend/issues/1116

Backend:

 - Remove status=completed and reached_total is defined validation from 3W (This is handled on the frontend now) - https://github.com/IFRCGo/go-api/pull/792/files#diff-181356e13945b05b6ffefda13468c403L134-L136
 - Added the previous email sending method back (python's smtplib) as a backup if sending emails with the API fails - https://github.com/IFRCGo/go-api/issues/737
 - Fix some of the logs failing because of missing recordtypes
 - Retaining Django (cronjob) logs with a new volume added to the docker container - MSM ticket

### Release 4.3.8

Hotfix Release (only an API release): Fix regression in CSV exports where ENUM fields were showing verbose labels instead of db values: https://github.com/IFRCGo/go-api/pull/794

### Release 4.3.7

Hotfix release: fixes broken breadcrumbs on tabular views without filters - i.e. All Emergencies, All Operations, etc.

### Release 4.3.6

Frontend:

 - 3W: Change Supporting NS to Reporting NS in country 3w table [#1297](https://github.com/IFRCGo/go-frontend/issues/1297)
 - 3W: "Add" 3w activity -button to 3w regional page [#1296](https://github.com/IFRCGo/go-frontend/issues/1296)
 - 3W: Country page: grey screen in Edge [#1314](https://github.com/IFRCGo/go-frontend/issues/1314)
 - Implement Breadcrumbs [#770](https://github.com/IFRCGo/go-frontend/issues/770)
 - Ensure title is mandatory for Field Reports [#1141](https://github.com/IFRCGo/go-frontend/issues/1141)
 - PER: Add more year options to selector [#1230](https://github.com/IFRCGo/go-frontend/issues/1230)
 - Fixed error message when trying to submit a new - but with errors - Field Report - https://github.com/IFRCGo/go-frontend/issues/1077
 - Adjusted Elasticsearch timeouts so it won't make multiple requests at once - https://github.com/IFRCGo/go-frontend/issues/989
 - Fix page titles: https://github.com/IFRCGo/go-frontend/issues/1125

Backend:

 - Django updated from 2.2.10 to 2.2.13
 - Fixed case-insensitive check for password/username recovery - https://github.com/IFRCGo/go-frontend/issues/1300
 - Related Elasticsearch records are now deleted when GO records are deleted - https://github.com/IFRCGo/go-frontend/issues/989
 - Added 'visibility' handling for notification emails of Field Reports - [#1308](https://github.com/IFRCGo/go-frontend/issues/1308)
 - Fixed 'scrape_pdf' error - https://github.com/IFRCGo/go-api/commit/fed29fb4c827991cca0caef154e0327992bf37b8
 - Added 'record_type' to Country serializer - https://github.com/IFRCGo/go-api/issues/759
 - Added 'Notification GUID' to the backend which serves as a log of the sent out emails - https://github.com/IFRCGo/go-api/issues/737
 - Changed 'Snippets' into Rich Text Editor fields - https://github.com/IFRCGo/go-api/issues/670
 - Added 'is_covid_report' to FieldReportFilter as a query param - [#1326](https://github.com/IFRCGo/go-frontend/issues/1326)
 - Added 'record_type' to CountryFilter as a query param - https://github.com/IFRCGo/go-api/issues/759
 - Removed redundant notifications sent alongside the Weekly Digest - [#1328](https://github.com/IFRCGo/go-frontend/issues/1328)
 - Code changes required for translation framework

### Release 4.3.5

Frontend:

 - Fix language in field report form: https://github.com/IFRCGo/go-frontend/issues/1226
 - Fix validation of email addresses on registration: https://github.com/IFRCGo/go-frontend/pull/1265
 - Remove Additional Graphics text on extra tabs: https://github.com/IFRCGo/go-frontend/issues/1232
 - Add COVID-19 Sankey Diagram for 3W activities: https://github.com/IFRCGo/go-frontend/issues/1284

Backend:

 - Add Global National Society Activities API (https://github.com/IFRCGo/go-frontend/issues/1284)
 - Add Project Filter to exclude where country and RNS are same (above ticket)
 - Removed multi-upload for Situation Report and PER documents (https://github.com/IFRCGo/go-frontend/issues/1117)
 - Field Report endpoint to return the proper list of Field Reports based on visibility (https://github.com/IFRCGo/go-frontend/pull/1286)

### Release 4.3.4

Frontend:

 - Use webpack instead of gulp for the build process: https://github.com/IFRCGo/go-frontend/issues/1199
 - 3W: Add disaster type to country 3W table, import and export: https://github.com/IFRCGo/go-frontend/issues/1149
 - 3W: Add multi-region support in 3W projects: https://github.com/IFRCGo/go-frontend/issues/1145
 - 3W: Replace Health (public) and Health (clinical) with Health in the sectors: https://github.com/IFRCGo/go-frontend/issues/1218
 - 3W: Add RCCE tag in the 3W project: https://github.com/IFRCGo/go-frontend/issues/1227
 - Restructure display of Epidemic data on Emergency page: https://github.com/IFRCGo/go-frontend/issues/1161
 - Show more emergencies on Country pages: https://github.com/IFRCGo/go-frontend/issues/1132
 - Don't require login to view public field reports: https://github.com/IFRCGo/go-frontend/issues/1118
 - Fix PER mismatches between frontend and backend: https://github.com/IFRCGo/go-frontend/issues/1137
 - PER: Enable years beyond 2018-2020: https://github.com/IFRCGo/go-frontend/issues/1230
 - Removed 'Information Bulletin Published', 'Delegates' 'Number of RCRC Movement Personnel', 'Probable/Suspected/Confirmed Cases' for COVID-19 type Field Reports: (part of) https://github.com/IFRCGo/go-frontend/issues/1161
 - Switch Is Covid Report toggle to Radio buttons: https://github.com/IFRCGo/go-frontend/issues/1247
 - Add COVID-19 Sankey Diagram for 3W activities: https://github.com/IFRCGo/go-frontend/issues/1284
 
Backend:

 - Change how EPI field report source data is stored
 - Fix issue of parent_emergency not always showing for superusers
 - The Domain Whitelist is a database table now and can be adjusted through the Django Admin, instead of being a static list maintained on both ends: https://github.com/IFRCGo/go-api/issues/669


### Release 4.3.3

Frontend:
- Add new tag "RCCE" for the projects ([#1227](https://github.com/IFRCGo/go-frontend/issues/1227))

Backend:
- Add new option "RCCE" for the secondary sectors in projects ([#1227](https://github.com/IFRCGo/go-frontend/issues/1227))

### Release 4.3.2

Minor hotfix release, adds a video to the Resources page.

### Release 4.3.1

Frontend:

 - Add COVID-19 specific options for Field Report - #1160
 - Implement redesign of About / Resources page - #1094

Backend:

 - Refactor / fix issues with ElasticSearch indexing
 - Add is_disabled option to Actions to allow deprecation of actions: https://github.com/IFRCGo/go-frontend/issues/1101

### Release 4.3.0

Frontend:

- Add **3w** tab to **Country** page ([#641](https://github.com/IFRCGo/go-frontend/issues/641))
	- Create a 3w view with a map, some basic overview charts and the projects table
	- Add basic filters to the view
	- Add ability to add / edit 3w project for logged in user
	- Add ability to export the all the 3w data
- Add 3w project form ([#640](https://github.com/IFRCGo/go-frontend/issues/640))
	- Create a form to add a 3w project
	- Create dynamic fields according to the values of `Operation type` and `Programme type`. The fields `Current IFRC Operation`, `Current Emergency Operation` and `Disaster type` will be conditionally displayed accordingly.
	- Create dynamic schema and required conditions for different field (eg: People reached > Total is required only if project is marked as Completed)
	- Add a separate tag for COVID-19 specifc project / activity
- Add **3w** tab to **Region** page ([#1019](https://github.com/IFRCGo/go-frontend/issues/1019))
	- Create the view with 3w overview, movement activities and national society activities for all the countries in the region
	- Add map to show the movement activities in the countries of the selected region
	- Add ability to view projects within the countries of selected region
	- Add sankey diagram to view the national society activities
- Add ability to add the 3w project from **Emergency** page ([#1066](https://github.com/IFRCGo/go-frontend/issues/1066))
- Add [`react-icons`](https://react-icons.netlify.com/#/) for easy usage of icons
- Add [`@togglecorp/fujs`](https://github.com/toggle-corp/fujs/) for a lot of utils
- Add [`@togglecorp/faram`](https://github.com/toggle-corp/fujs/) to implement dynamic forms
- Add some faram compatible wrapped inputs (`TextInput`, `SelectInput`, `FaramCheckbox`, `DateInput`, `NumberInput`) with existing input elements
- Add some components that use [Hooks](https://reactjs.org/docs/hooks-intro.html). Custom hooks are added to `/hooks/` directory
- Add selectors for common selection approach for the redux. Selectors are added to `/selectors/` directory
- Refactor map download code (break down into components and remove unnecessary codes).

API:
 - Fetch FTS HPC Data using google sheet.
 - Add visibility support for project. (Public, Login required, IFRC Only)
 - New Programme Type `Domestic`
 - Add Bulk Project Import in Admin Panel.
 - Enable history for Project changes.
 - Add Sector/SectorTag `Health (private)` and `COVID-19`.
 - Add API for Project for region.
 - Add Multiselect filters for Project API enumfields.
 - Change Sector/SectorTag `Health` to `Health (public)`.


### Release 4.2.3

Frontend:

 - Improve field report frontend page: https://github.com/IFRCGo/go-frontend/pull/1144
 - Fix bug of loading default tab on country page: https://github.com/IFRCGo/go-frontend/pull/1143
 - Fix description text on field report form: https://github.com/IFRCGo/go-frontend/pull/1140
 - Add global header banner for COVID-19: https://github.com/IFRCGo/go-frontend/pull/1139
 - Fix bug of duplicated actions: https://github.com/IFRCGo/go-frontend/pull/1136
 - Add case count, etc. to Emergency Pages: https://github.com/IFRCGo/go-api/pull/680

API:

 - Fix timeout error while fetching Field Report CSV: https://github.com/IFRCGo/go-api/pull/681
 - Included EPI data for Field Report in the notifications https://github.com/IFRCGo/go-frontend/issues/1119
 - Add missing domains to whitelist: https://github.com/IFRCGo/go-api/commit/bceac3e5dfd907221eeb8db05d3c37c63b9f9718
 - Visual fix for Parent Events on Admin: https://github.com/IFRCGo/go-frontend/issues/1128
 - Fix PER bug with component order: https://github.com/IFRCGo/go-frontend/issues/1137

### Release 4.2.2

 - Minor hotfix: add domains to whitelist on frontend - https://github.com/IFRCGo/go-frontend/pull/1120
 - Fix links on About page: https://github.com/IFRCGo/go-frontend/issues/1069

### Release 4.2.1

 - Hotfix release to fix broken snippets on country and region pages: https://github.com/IFRCGo/go-frontend/pull/1114

### Release 4.2.0

Frontend:

 - Fix links on Country pages: https://github.com/IFRCGo/go-frontend/issues/922
 - Remove `Save and Continue` button from Field Report: https://github.com/IFRCGo/go-frontend/issues/1056
 - Improved staging deployment process and styling: https://github.com/IFRCGo/go-frontend/issues/888
 - Implement Response Document additional categories and "pinning": https://github.com/IFRCGo/go-frontend/issues/1008
 - Implement "Merge Emergencies" feature: https://github.com/IFRCGo/go-frontend/issues/1010
 - Fix display styling for existing Rich Text Editor fields: https://github.com/IFRCGo/go-frontend/issues/1011
 - Fix surge alerts not showing on Emergency Page when navigated to directly: https://github.com/IFRCGo/go-frontend/issues/1081
 - Implement Epidemic Field Report: https://github.com/IFRCGo/go-frontend/issues/1004
 - Improve Field Report API Response: https://github.com/IFRCGo/go-frontend/issues/1072
 - Change IFRC Logo: https://github.com/IFRCGo/go-frontend/pull/972
 - Allow user to organize snippets into tabs and rename tabs: https://github.com/IFRCGo/go-frontend/pull/1071

API:

 - Audit Trail Implementation: https://github.com/IFRCGo/go-api/issues/572
 - <html> tag added to notification mails, reducing their spam score for the API: https://github.com/IFRCGo/go-api/commit/5d270c824255321f9b69ae1dbc0720cd36952bd3
 - New field for ifrc.org link of Countries: https://github.com/IFRCGo/go-frontend/issues/922
 - New field (parent_event) for "merging" Emergencies for superusers, with redirect on the frontend: https://github.com/IFRCGo/go-frontend/issues/1010
 - Added German Red Cross domain to whitelist: https://github.com/IFRCGo/go-api/commit/db15bb4ee8784911d9a4613ade8a512a8a808a19
 - Error handling for Create Field Report: https://github.com/IFRCGo/go-frontend/issues/1077


### Release 4.1.2

Fixes:

 - A bug with that Rapid Response calculation (would error if one of the types was missing): https://github.com/IFRCGo/go-frontend/pull/1029
 - Showing Disaster Type correctly on Country page: #920 
 - Show data for last 30 days on Emergency page to fix discrepancy in numbers: https://github.com/IFRCGo/go-frontend/pull/1032


### Release 4.1.1

This release primarily deals with a refactor of the handling of PER forms: https://github.com/IFRCGo/go-frontend/pull/893 .

It also includes some fixes to the existing PER functionality:

 - Fix bug where all national society names did not display in dropdown: https://github.com/IFRCGo/go-frontend/issues/918
 - Fix bug(s) where incomplete data was causing preparedness pages not to render in some circumstances: https://github.com/IFRCGo/go-frontend/issues/954 https://github.com/IFRCGo/go-frontend/issues/950
 - Fix text issues in forms: https://github.com/IFRCGo/go-frontend/issues/947
 - Show PER Phase instead of PER forms in Preparedness frontend: https://github.com/IFRCGo/go-frontend/issues/844
 - Fix few bugs that were causing page crashes on PER: #946 #943 
 - Fix styling of email address in PER: #834

Some fixes to the Field Report page and forms:

 - Fix saving of Actions correctly: #984 
 - Fix display of fields on Field Report frontend: #985 

Assorted Fixes:

 - Display change in Rapid Response calculations: #965 
 - Feature Operations Card, display `-` instead of `0`: #970 
 - Add additional countries: #983 
 - Fixes to some debugging errors in Javascript console: #815

