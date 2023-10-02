# whatsapp-discord
Simple WhatsApp -> Discord relay service using WhatsApp Web. This is intended for personal use, but if you find the idea inspiring feel free to use some of the code for a proper production-ready relay.

It is able to integrate with [Twinkle's `ipc` module](https://github.com/Dorumin/Twinkle/tree/master/src/plugins/ipc) for a two-way relay as well as the [SI database](https://github.com/KockaAdmiralac/Archive/tree/master/etf/si-discord) for associating phone numbers with names.

## Installation
To install all required packages, use:
```console
$ npm install
```

## Configuration
Rename `config.sample.json` to `config.json` and change the options in there to your needs.

## Running
```
$ npm start
```
