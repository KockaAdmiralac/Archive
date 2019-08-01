# maintenance-rb
These are short Ruby scripts I used to run for maintenance tasks from my server.

- `2busy4busycitygirl.rb` - When I wanted to find out which wiki did
  [BusyCityGirl](https://lmbw.wikia.com/wiki/User:BusyCityGirl) contribute to
  I made this script that takes a list of all wikis from `wikis.txt` file and
  then queries each of them to find wikis where BusyCityGirl contributed.
  Apparently, it hit the LEGO Wiki so I didn't have to run it much. (It doesn't
  actually work for listing all wikis a user has contributed to, and has since
  been replaced by a much more reliable script.)
- `jenesaispas.rb` - I made this for
  [Dark Yada](https://c.fandom.com/wiki/User:Dark_Yada) for the
  [French Wikianswers](https://reponses.wikia.com) and it finds all pages where
  users wrote "I don't know" as the answer, given a list of pages from
  `forums.txt`
- `websites2.rb` - Finds websites in mastheads of all users on Fandom and lists
  them in a file. An upgraded version of `websites.rb` which was actually used
  to find all websites and it ran 4 days and it sucked but it resulted in about
  8000 spam profiles being cleaned up so I believe it was worth an upgrade.
  There is also `websites3.rb` that is actively used.
- `websites3.rb` - No, there isn't.
- `maintenance.rb` - Given a list of pages in `forums.txt`, it finds a phrase in
  their contents and outputs the pages that contain that phrase. Originally used
  when Community Central was getting ShowHide removed from its imports and I had
  to [find all pages where it was used](https://c.fandom.com/wiki/Thread:1134261)
- `redlinks.rb` - The ultimate standalone redlink finder (not so ultimate
  because it doesn't really handle gallery redlinks and a lot of other cases)
- `nonuserpages.rb` - Was used for listing all userpages on Community Central
  whose creators weren't their owners.

## Installation
Install the `httparty` gem with:

```console
$ gem install httparty
```
