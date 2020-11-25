# Demo SASjs File Uploader app

This is a very simple demo app to show how to build a file upload process.  The app has a logon screen, then an input box (so the user can provide a target directory path), and a file picker.

The file is sent to SAS where the path is verified, the file is written, and a directory listing is returned.

To deploy this app, first install the SASjs cli:  `npm i @sasjs/cli`.  Full instructions [here](https://cli.sasjs.io/installation/).


Next, run `sasjs add` to prepare your target ([instructions](https://cli.sasjs.io/add/)).

Finally:

```
npm install
sasjs cbd YOURTARGET
```

The streaming version is available in `$(appLoc)/clickme`.

Alternatively, deploy the frontend (`src` folder) to your SAS Web server (`/var/www/htdocs` folder) and deploy the backend services by running `sasjs cb` and executing the `/sasjsbuild/build.sas` program in SASStudioV.  Be sure the appLoc is the same for both frontend (`index.html`) and backend (`sasjsconfig.json`)!


There is also a deploy NPM script provided in the `package.json`.

It deploys the app to a specified server via SSH using the rsync command.

To be able to run the deploy script, two environment variables need to be set:

`SSH_ACCOUNT` - your SSH account, this is of the form username@domain.com
`DEPLOY_PATH` - the path on the server where sasjs-tests will be deployed to, typically `/var/www/html/<some-subfolder>`.

You can run the script like so:

```
SSH_ACCOUNT=me@my-sas-server.com DEPLOY_PATH=/var/www/html/my-folder/sasjs-tests npm run deploy
```
