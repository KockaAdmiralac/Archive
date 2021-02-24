# Welcome redlinks
Finds and removes redlinks in welcome messages. While a similar script written by me has previously been used by [Josephyr](https://community.fandom.com/wiki/Special:Contribs/Josephyr), this one was written by request of [DarkBarbarian](https://clashofclans.fandom.com/de/wiki/Special:Contribs/DarkBarbarian).

## Scripts
- `find*.js` scripts are used for finding the redlinks. I'm not sure which one does what anymore.
    - Apparently, `find3.js` reads `res3.txt` and turns all page names found in there into page IDs and puts them into `res4.txt`.
- `remove.js` removes these redlinks, and it is to be run through a browser console on the wiki (since that would be easier than getting DarkBarbarian to install Node.js).
