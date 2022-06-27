# Plugins
A collection of Fandom plugins I wrote that I probably won't need anymore.

- `ImageIntegrator.js` - After finding out Fandom might be deprecating the image
  whitelist, I wrote this so images can still be embedded from trusted sources
  using JavaScript, but Staff said they won't accept such a solution.
- `listnamespacepages.js` - Simple script that lists all pages in a given
  namespace that aren't redirects.
- `filelist.js` - Adds checkboxes into Special:ListFiles and adds checked pages
  into an array. I used it on [OneShot Wiki](https://oneshot.fandom.com) in the
  process of mass-categorizing files.
- `RevertToOldid.js` - Reverts a given list of pages to the last revision with
  the specified revision ID. Written for and along with 
  [Noreplyz](https://yokaiwatch.fandom.com/wiki/Special:Contribs/Noreplyz) at the
  time he was cleaning up mass-vandalism by about 1000 users on the Yo-kai Watch
  wiki.
  Since this script has been archived originally, a need for it to be used
  arised on several more wikis, including the forked RuneScape wikis. As it is
  in a dire need of a rewrite and I'm not personally using it, it has been left
  archived here.
- `liststaff.js` - Lists all images not uploaded by Staff on Community Central
  until a specified point in time.
- `kcc.js` - Otherwise known as AjaxHistory. It's like AjaxRC but for page
  history. I helped [KCCreations](https://github.com/VirtualKibou) make this but
  it never really got published I guess.
- `AntiTracking.js` - Prevents certain amount of tracking by disabling JavaScript
  components that tracked you. No longer works since UCP.
- `MoveTools.js` - Moves tools from the My Tools menu into the page header.
  I used to use this because [PseudoMonobook](https://dev.fandom.com/wiki/PseudoMonobook)
  showed the page header to the left of the page and because I wanted to have all
  tools in one place.
- `ReportFormatter.js` - At Wikia Watchers, we often had to convert reported users
  between different formats - one for [Report:Spam](https://soap.fandom.com/wiki/Report:Spam)
  and the other for [Report:Spam/Biglist](https://soap.fandom.com/wiki/Report:Spam/Biglist).
  This script showed a modal that let the user convert between these formats.
