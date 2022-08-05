# Supertennix TV App

## NOTICE: This project is for demostration purposes only and should never be used in a Production setting.

## Available Scripts

In the project directory, you can run:

### `npm start:dev`

Runs the app in the development mode. Loads `.env.dev` file \
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm start-80`

#### Requires admin password for computer and adding a sub-domain in `/etc/hosts` *(eg: local.supertennix.it)*

Runs app in dev mode in port 80 This works when trying to make calls that could be subject to CORS blocking.\
Loads `.env.dev` file. \
Open the URL without HTTPS *(ONLY HTTP)* (
eg: **[http://local.supertennix.it](http://local.supertennix.it)**)

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more
information.

### `npm run build:prod`

Builds the app for production to the `build` folder. Loads `.env.prod` file. \
It correctly bundles React in production mode and optimizes the build for the best performance. \
The build is minified and the filenames include the hashes.\
