# MedMe OAuth 2 Example

See [this origin article](https://www.sohamkamani.com/blog/javascript/2018-06-24-oauth-with-node-js/).
This is my start point.

Also good point for understanding of [OAuth 2 mechanism](https://itnext.io/an-oauth-2-0-introduction-for-beginners-6e386b19f7a9).

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

You can run it so:

````
npm install express node-fetch cookie-parser
sudo node mobile/server.js
````

## Различия двух типов авторизации

Здесь разделение на 2 типа приложения - мобильное и веб - сделано условно по вероятному сценарию их использования, что 
не мешает вам использовать оба сценария и там и там. 
Мобильный - это серверный вариант авторизации, веб - авторизация на клиенте.
Их отличие в том, что на "мобильном" варианте фазы обмена токенов exchange и refresh 
сделаны на сервере приложения, тогда как в веб эти фазы выполняются в браузере.

Так же на серверном варианте используется серверный ключ. В браузере вы не сможете поменять referer -
он будет выполнять роль ключа.
