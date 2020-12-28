# RainCorp

## Resume

This is a simple website to test my skill in web development.

## Env setup
Before launch the site you'll have to setup the SECRET.js file which contains some
commodities like cookie_secret which is the cookie passphrase
or https passphrase.
The pattern you have to fulfill follow:

    module.exports = {
        cookie_secret: "Any key you want to setup for cookie",
        server_passphrase: "The passphrase of your https certificates",
        server_publicKey : "RSA public key",
        server_privatekey: "RSA private key"
    }
