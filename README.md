[![Waffle.io - Columns and their card count](https://badge.waffle.io/IFRCGo/go-infrastructure.svg?columns=all)](https://waffle.io/IFRCGo/go-infrastructure)

<h1 align="center">IFRC GO Frontend</h1>

This repository contains the user interface of the IFRC Go.

## Installation and Usage
The steps below will walk you through setting up a development environment for the frontend.

### Install Project Dependencies
To set up the development environment for this website, you'll need to install the following on your system:

- [Node](http://nodejs.org/) v8 (To manage multiple node versions we recommend [nvm](https://github.com/creationix/nvm))
- [Yarn](https://yarnpkg.com/) Package manager

### Install Application Dependencies

If you use [`nvm`](https://github.com/creationix/nvm), activate the desired Node version:

```
nvm install
```

Install Node modules:

```
yarn install
```

### Windows compatibility
- To be able to run the app, you have to change the below lines in your `package.json`:
```
"postinstall": "echo 'module.exports = {};' > app/assets/scripts/config/local.js",
"serve": "set NODE_ENV=development && gulp collecticons && set NODE_ENV=development && gulp serve",
```

### Usage

#### Config files
All the config files can be found in `app/assets/scripts/config`.
After installing the projects there will be 3 main files:
  - `local.js` - Used only for local development. On production this file should not exist or be empty.
  - `staging.js`
  - `production.js`

The `production.js` file serves as base and the other 2 will override it as needed:
  - `staging.js` will be loaded whenever the env variable `NODE_ENV` is set to staging.
  - `local.js` will be loaded if it exists.

The following options must be set: (The used file will depend on the context):
  - `api` - The address for the rra api

Example:
```
module.exports = {
  api: 'http://localhost:4000'
};
```

#### Starting the app

```
yarn serve
```
Compiles the sass files, javascript, and launches the server making the site available at `http://localhost:3000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

# Deployment

## Deploy a branch to surge.sh for testing and preview
We use surge.sh to deploy directly from a branch to test new features and fixes. To do this:
* Build `yarn build-staging`. You'll need to login to a surge account if this is the first you are running. You can create an account from the CLI.
* Deploy `yarn deploy-staging`

Once the testing is over, remember to teardown:
* `yarn teardown-surge`

If it says you don't have permissions to deploy, it likely means someone has deployed this branch already. You can chose to create another URL, or create a new branch, or get in touch with that person.

## Prepare to deploy for production
To prepare the app for deployment run:

```
yarn build-prod
```
This will package the app and place all the contents in the `dist` directory.
The app can then be run by any web server.
