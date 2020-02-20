# MedMe OAuth 2 Example

See [this origin article](https://www.sohamkamani.com/blog/javascript/2018-06-24-oauth-with-node-js/).
This is my start point.

Please if you will use this code in production use polyfill for [fetch API](https://developer.mozilla.org/ru/docs/Web/API/Fetch_API) – [Fetch API polyfill](https://github.com/github/fetch).

## USAGE WEB EXAMPLE

For running you need to add domain `gbooking.local` to your local `hosts` file and run static server that listen `public` folder.
It will listen 80 port.

`gbooking.local` domain on `80` port needs for CORS policy on GBooking OAuth 2 server.

For multiplatform support I added simplest nodejs static server. You can run it so:

````
npm install express
sudo node web/server.js
````

Here need `sudo` because 80 port.

## USAGE MOBILE EXAMPLE
