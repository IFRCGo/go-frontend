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

