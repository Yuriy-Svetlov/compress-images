# jpegoptim-bin [![Build Status](http://img.shields.io/travis/imagemin/jpegoptim-bin.svg?style=flat)](http://travis-ci.org/imagemin/jpegoptim-bin)

> [jpegoptim](https://github.com/tjko/jpegoptim) is a utility for optimizing JPEG files that provides lossless optimization (based on optimizing the Huffman tables) and "lossy" optimization based on setting a maximum quality factor


## Install

```
$ npm install --save jpegoptim-bin
```

Make sure you have the correct version of libjpeg. See [jpegoptim's README](https://github.com/tjko/jpegoptim#readme) for more information.


## Usage

```js
var execFile = require('child_process').execFile;
var jpegoptim = require('jpegoptim-bin');

var args = [
	'--override',
	'--strip-all',
	'--strip-iptc',
	'--strip-icc',
	'--all-progressive',
	'--dest=build',
	'input.jpg'
];

execFile(jpegoptim, args, function (err) {
	console.log('Image minified');
});
```


## CLI

```
$ npm install --global jpegoptim-bin
```

```
$ jpegoptim --help
```


## License

MIT © [imagemin](https://github.com/imagemin)
