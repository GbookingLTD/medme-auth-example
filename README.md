# Test MedMe OAuth 2 Application

See [this origin article](https://www.sohamkamani.com/blog/javascript/2018-06-24-oauth-with-node-js/).
This is my start point.

## USAGE

For running you need to add domain `gbooking.local` to your local `hosts` file and run static server that listen `public` folder.
It will listen 80 port.
For multiplatform support I added simplest nodejs static server. You can run it so:

`gbooking.local` domain on `80` port needs for CORS policy on GBooking OAuth 2 server.

````
sudo node server.js
````

Here need `sudo` because 80 port.
