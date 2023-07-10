# github
Polls the GitHub API for new pull requests to a configured repository.

Built for [Fandom Developers Discord](https://dev.fandom.com/wiki/Project:Discord)'s `#github` channel, where pull requests to [Fandom's MediaWiki code repository](https://github.com/Wikia/app) are logged. [Originally](https://github.com/Colouratura/ColourServices/blob/master/services/github-discord.js) by [Colouratura](https://github.com/Colouratura).

Archived after Fandom switched to the [Unified Community Platform](https://community.fandom.com/wiki/Help:Unified_Community_Platform) and stopped committing to their MediaWiki code repository, instead switching to a [private one](https://github.com/Wikia/unified-platform). At the time of writing, it has been two years since they stopped committing and they still haven't made UCP open source (even though it's still MediaWiki, and MediaWiki's license is GPL).

## Setup
- Download this project and open your console in its folder.
- Run `npm install` to install its dependencies.
- Copy `config.sample.json` to `config.json` and change the fields in it:
    - `interval` represents the number of milliseconds between GitHub API requests.
    - `repo` represents configuration of the GitHub repository location from which the pull requests should be logged.
    - `repo.org` represents the organization name under which the repository is located.
    - `repo.repo` represents the repository name.
    - `webhook` is an object with two fields, `id` and `token`, that represent the ID and token of the Discord webhook to be used for logging pull requests. Webhook URLs have the structure of: `https://discord.com/api/webhooks/{id}/{token}`.
- Run `npm start` to run the logger.
