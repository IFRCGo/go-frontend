[![Waffle.io - Columns and their card count](https://badge.waffle.io/IFRCGo/go-infrastructure.svg?columns=all)](https://waffle.io/IFRCGo/go-infrastructure)

<h1 align="center">IFRC GO Frontend</h1>

This repository contains the user interface of the IFRC Go.

## Installation and Usage
The steps below will walk you through setting up a development environment for the frontend.

### Install Project Dependencies
To set up the development environment for this website, you'll need to install the following on your system:

- [Node](http://nodejs.org/) v13 (To manage multiple node versions we recommend [nvm](https://github.com/creationix/nvm))
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

### Usage

#### Environment variables
All the environment variables are stored in `.env` file in the project's base directory. Currently there are 4 environment variables:
- `REACT_APP_MAPBOX_ACCESS_TOKEN` access token for the mapbox, defaults to the IFRC's mapbox token
- `REACT_APP_API_ENDPOINT` endpoint where API for go is served, defaults to the staging server's URL
- `REACT_APP_FDRS_AUTH` authentication token for FDRS API (optional)
- `REACT_APP_ENVIRONMENT` current app environment (could be one of `development` / `staging` / `production`, defaults to `development`)
- `REACT_APP_INSTRUMENTATION_KEY` application insights instrumentation key for analytics tracking

Sample `.env` file
```
REACT_APP_MAPBOX_ACCESS_TOKEN=<your_mapbox_token>
REACT_APP_API_ENDPOINT=https://dsgocdnapi.azureedge.net/
REACT_APP_INSTRUMENTATION_KEY=<your_instrumentation_key>
```

#### Starting the app

```
yarn start
```
Compiles the sass files, javascript, and launches the server making the site available at `http://localhost:3000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

# Deployment

## Deploy a branch to surge.sh for testing and preview
We use surge.sh to deploy directly from a branch to test new features and fixes. To do this:
* Build `yarn build-staging`. You'll need to login to a surge account if this is the first you are running. You can create an account from the CLI.
* Deploy `yarn deploy-surge`

Once the testing is over, remember to teardown:
* `yarn teardown-surge`

If it says you don't have permissions to deploy, it likely means someone has deployed this branch already. You can chose to create another URL, or create a new branch, or get in touch with that person.

### Possible error(s)
* `yarn deploy-surge` could result in the following error: `/bin/sh: 1: Bad substitution ...`
  * Solution: `yarn config set script-shell /bin/bash`


## Prepare to deploy for production
To prepare the app for deployment run:

```
yarn build
```
This will package the app and place all the contents in the `build` directory.
The app can then be run by any web server.


## Managing SVG Icons

For icons, we use [`collecticons-processor`](https://github.com/developmentseed/collecticons-processor) to build a custom font, which is then used on the frontend via CSS classes.

To add an icon:

 - Create an SVG file for your icon
 - Add the SVG file to `src/assets/icons/collecticons/`
 - Run `yarn run collecticons` to rebuild the icon font and re-generate the _collecticons.scss file, found in `src/styles/core/`. NOTE: Do NOT update this file by hand.
 - Use the added class in your React Markup to add the icon - this class name will be `collecticons-` + your SVG filename, so if your file was called `my-icon.svg`, the className to use will be `collecticons-my-icon`. Refer to existing code for usage examples.
 - Alternatively, you can use Icomoon to rebuild the icon font. First import the new SVG icons on the Icomoon site. Then upload the `selection.json` (src/assets/icons/icomoon/selection.json) file (which contains the icon settings) using the 'Import Icons' button. You can regenerate the font from Icomoon. For more instructions, see [Icomoon](https://icomoon.io/#docs).
