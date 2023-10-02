# etf-proxy
As you can see from the very directory this project is located in, many of the services in it (`etfnews`, `auto-lab` and `sale`) are polling sites of the School of Electrical Engineering. They noticed it and blocked my server at some point, so I decided to host a proxy on a free service like [Heroku](https://heroku.com/) or [Koyeb](https://www.koyeb.com/) that relays my requests to these sites. It's built pretty badly, though, so I suggest you just place a `config.json` file in this directory with the contents of `{"disable": true}` to disable the use of this proxy in all other services.

If you want, you can use `config.sample.json` as a sample configuration for the proxy server (and client) and `Procfile` for running it on Koyeb.
