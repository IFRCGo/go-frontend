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

