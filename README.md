# Voltaj
### Open Source Video Encoding & Transcoding Package

voltage is a video encoding package.

## Features

- Easily use video encoding on your own node system
- Get your **server api** (express) stand up and add the jobs to the **database** (mongodb).
- Run the **Worker** app and get things done with care.

## Tech

Voltaj uses a number of open source projects to work properly:

- [node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [Joi] - awesome data validation library

And of course Voltaj itself is open source with a [public repository][voltaj]
 on GitHub.

## Installation

Voltaj requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd voltaj
npm install
npm start
```

For production environments...

```sh
npm install --production
NODE_ENV=production node app
```

## Development

Want to contribute? Great!

Voltaj uses Gulp + Webpack for fast developing.
Make a change in your file and instantaneously see your updates!

Open your favorite Terminal and run these commands.

First Tab:

```sh
node app
```

Second Tab:

```sh
gulp watch
```

(optional) Third:

```sh
karma test
```

#### Building for source

For production release:

```sh
gulp build --prod
```

Generating pre-built zip archives for distribution:

```sh
gulp build dist --prod
```

## Docker

Voltaj is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 8080, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
cd voltaj
docker build -t <youruser>/voltaj:${package.json.version} .
```

This will create the voltaj image and pull in the necessary dependencies.
Be sure to swap out `${package.json.version}` with the actual
version of Voltaj.

Once done, run the Docker image and map the port to whatever you wish on
your host. In this example, we simply map port 8000 of the host to
port 8080 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -d -p 8000:8080 --restart=always --cap-add=SYS_ADMIN --name=voltaj <youruser>/voltaj:${package.json.version}
```

> Note: `--capt-add=SYS-ADMIN` is required for PDF rendering.

Verify the deployment by navigating to your server address in
your preferred browser.

```sh
127.0.0.1:8000
```

## License

MIT

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [voltaj]: <https://github.com/voltaj/voltaj>
   [voltaj-website]: <https://voltaj.io>
   [git-repo-url]: <https://github.com/voltaj/voltaj.git>
   [node.js]: <http://nodejs.org>
   [express]: <http://expressjs.com>
   [Joi]: <http://joi.dev>