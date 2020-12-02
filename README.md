# Demo SASjs File Uploader app

This is a very simple demo app to show how to build a file upload process.  The app has a logon screen, then an input box (so the user can provide a target directory path), and a file picker.

The file is sent to SAS where the path is verified, the file is written, and a directory listing is returned.

![screenshot of sasjs file uploader](https://i.imgur.com/alHXcTK.png)

## Fast Deploy
This app can be deployed as a streaming SAS app in two lines of code:

```
filename sasjs url "https://raw.githubusercontent.com/sasjs/fileuploader/master/runme.sas";
%inc sasjs;
```

You can now open it at `YOURSERVER/SASJobExecution?_program=/Public/app/fileuploader/clickme`.

## Building from Source

To deploy this app, first install the SASjs CLI - full instructions [here](https://cli.sasjs.io/installation/).

Next, run `sasjs add` to prepare your target ([instructions](https://cli.sasjs.io/add/)).

Then run the below to deploy the backend (SAS) services:

```
npm install
sasjs cbd -t YOURTARGET
```

If you don't have the ability to `sasjs add` due to not having access to a client / secret, you can instead run `sasjs cb` and execute the resulting `sasjsbuild/build.sas` script in SAS Studio V to create the backend services.

## Frontend

### Configuration

Open `index.html` and make sure the value for `appLoc` is the same as that used when deploying the backend (`sasjsconfig.json`).

Also, update the `<script>` tag so that SASjs is pointing to a CDN (or copy the file from `node_modules` into the `src` folder and use a relative reference).

### Deployment

The frontend (`src` folder) is deployed to your SAS Web server (`/var/www/htdocs` folder) - you can upload manually, or using the supplied NPM script in `package.json`.

To be able to run the deploy script, two environment variables need to be set:

`SSH_ACCOUNT` - your SSH account, this is of the form username@domain.com
`DEPLOY_PATH` - the path on the server where sasjs-tests will be deployed to, typically `/var/www/html/<some-subfolder>`.

You can run the script like so:

```
SSH_ACCOUNT=me@my-sas-server.com DEPLOY_PATH=/var/www/html/my-folder/sasjs-tests npm run deploy
```

## Closing remarks

If you have any problems, please just raise an [issue](https://github.com/sasjs/fileuploader/issues/new)!  And if you find it useful, we'd appreciate a STAR.

For more information on the SASjs framework, see https://sasjs.io
