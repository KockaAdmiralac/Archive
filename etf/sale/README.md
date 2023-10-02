# sale
Polls for [reserved RTI rooms](https://rti.etf.bg.ac.rs/sale/) in the next 6 months, collects changes to reservations, groups them and sends them to Discord through a webhook.

## Setup
Install required packages:
```console
npm install
```

Rename `config.sample.json` to `config.json` and update the webhook parameters in it, then run the service:
```console
npm start
```

Most recent versions of this service use the `etf-proxy` service as well. To configure it, please create a `config.json` file within the `etf-proxy` directory with the contents of `{"disable": true}`.
