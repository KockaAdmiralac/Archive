# twinkle
I used [Twinkle](https://github.com/Dorumin/Twinkle) at the [Undertale Wiki Discord](https://discord.undertale.wiki/) for verifying users and other utilities. Now we're using a [Cloudflare Workers-based bot](https://github.com/utdrwiki/bot) so these plugins are no longer needed.

Custom made plugins include:

- `welcome`: Welcomes users to the Undertale/Deltarune Wiki server and automatically assigns a role if they previously verified.
- `autorole`: Automatically assigns roles to users if they are found in a database. This was never actually used for anything, I think.

Custom made commands include:

- `!verify`: Verifies a user's Fandom account, assigns them a role for it, and reports it through a webhook. This version also checks whether the user was previously banned, but the new version no longer does that.
- `!clean`: Like Twinkle's `!clear`, but allows us to specify a default message ID to clear to in a channel.
- `!when`: Tells the percentage of time that elapsed between 2018-10-31 and 2025-10-31. Rumia asked for this.
