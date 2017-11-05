# pngout-bin [![Build Status](http://img.shields.io/travis/imagemin/pngout-bin.svg?style=flat)](https://travis-ci.org/imagemin/pngout-bin)

> pngout optimizes the size of PNG files losslessly


## Install

```
$ npm install --save pngout-bin
```


## Usage

```js
var execFile = require('child_process').execFile;
var pngout = require('pngout-bin');

execFile(pngout, ['input.png', 'output.png', '-s0', '-k0', '-f0'], function (err) {
	console.log('Image minified!');
});
```


## CLI

```
$ npm install --global pngout-bin
```

```
$ pngout --help
```


## License

MIT © [imagemin](https://github.com/imagemin)
