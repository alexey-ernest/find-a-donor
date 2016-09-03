# Find a Donor
A service for finding blood donors near you

* [Tech Stack](#tech-stack)
* [Tests](#tests)
* [How to Run](#how-to-run)

## Tech Stack
* Language - JavaScript/ES6/ES7/Babel. React components are written on ES6/ES7 using Babel transpiler.
* Back-end - Node.js/Express.js, Mongoose/MongoDB, Socket.io
* Front-end -  React/Flux/React Router/React Toolbox (Material UI), SASS/SCSS/Compass/Breakpoint for CSS
* Maps - Leaflet framework using react-leaflet components, map tiles from ArcGIS service
* Tests - Mocha for API tests


## Tests

```
$ npm install
$ npm test
```

## How to Run

Using npm:
```
$ npm install
$ npm build
$ npm start
```

Or using docker:
```
$ docker run -d --name donor -e MONGODB_CONNECTION=mongodb://<dblogin>:<dbpass>@<dbserver>:<dbport>/<dbname> -e DEBUG=find-a-donor:* -p 8080:8080 alexeyernest/find-a-donor
```
