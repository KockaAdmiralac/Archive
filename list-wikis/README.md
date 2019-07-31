# Wiki lister
Initially intended to work as a spam wiki finder, this project was used for listing all wikis on Fandom and filtering through them to find spam ones. It either didn't work well or Fandom indeed does not have many old spam wikis.

## Scripts
- `main.js` - Finds all wikis and puts them in a `wikis.json` file.
    - This script is still actively used, but has since been majorly rewritten for stability.
- `trim.js` - Trims `wikis.json` into a more meaningful data file.
- `checked.js` - Reads from a `wikis-checked.txt` file that is supposed to be a dump of [R:W](https://vstf.fandom.com) and generates a `wikis-checked.json` file from them.
- `filter.js` - Filters wikis by their checked state and regexes defined in `whitelist-name.json` and `blacklist-name.json`. Blacklisted wikis afterwards go to `wikis-blacklist.json` and non-whitelisted to `wikis-filtered.json`.
- `format.js` - Formats `wikis-filtered.json` into a readable file.
- `formatbl.js` - Same as `format.js` but for blacklisted wikis.
