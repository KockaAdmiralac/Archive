# dimitrije

## Installation
1. Download Minecraft server JAR file from [Mojang's site](https://minecraft.net/en-us/download/server/).
2. Run `npm install` in the project directory.
3. Input `cert.pem` and `key.pem` files in the `keys` directory for the HTTPS certificate. Alternatively, run `selfsigned.sh` inside that directory to generate self-signed HTTPS certificates.

## Running
- To run the server, use `npm start`.
- The server will first create an `eula.txt` file in which you'll have to change `eula=false` to `eula=true` to agree to Minecraft Server's End User License Agreement.
