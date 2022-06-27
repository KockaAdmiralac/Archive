# Double rename redirect resolver
A cross-wiki maintenance script written after Ripto22475 renamed to Riptoze and then to [Icier](https://community.fandom.com/wiki/User:Icier). The global action has been documented [here](https://kocka.fandom.com/wiki/KockaBot#Icier_rename).

## Scripts
- `makelist.js` - Creates a list of wiki subdomains to find userpages on from a specified `wikis.json` file (see `list-wikis` archive).
- `list.js` - Finds userpages on all listed wikis and puts them into a `found.json` file.
- `getjs.js` - Filters out `.js`/`.css` subpages from `found.json`.
- `edit.js` - Fixes double redirects on pages listed in `found.json`. Credentials are to be added to `config.json`.
