# giflossy-bin [![npm version](https://img.shields.io/npm/v/giflossy.svg)](https://www.npmjs.com/package/giflossy) [![npm downloads](https://img.shields.io/npm/dm/giflossy.svg)](https://www.npmjs.com/package/giflossy) [![Build Status](https://travis-ci.org/jihchi/giflossy-bin.svg?branch=master)](https://travis-ci.org/jihchi/giflossy-bin) [![Build status](https://ci.appveyor.com/api/projects/status/lblrhmvt58uyqcmc?svg=true)](https://ci.appveyor.com/project/jihchi/giflossy-bin)

> [giflossy](https://github.com/pornel/giflossy) is an encoder (based on gifsicle) which implements lossy LZW compression. It can reduce animgif file sizes by 30%—50% at a cost of some dithering/noise..

> gifsicle manipulates GIF image files in many different ways. Depending on command line options, it can merge several GIFs into a GIF animation; explode an animation into its component frames; change individual frames in an animation; turn interlacing on and off; add transparency and much more.

## Install

```
$ npm install --save giflossy
```

## Included Binaries

- [x] Mac OS X
- [x] Linux x64
- [ ] Linux x86
- [ ] Windows x64
- [ ] Windows x86

## Usage

```js
const {execFile} = require('child_process');
const giflossy = require('giflossy');

execFile(giflossy, ['-O3' '--lossy=80', '-o', 'output.gif', 'input.gif'], err => {
	console.log('Image minified!');
});
```


## CLI

```
$ npm install --global giflossy
```

```
$ giflossy --help
```


## License

MIT © [Jih-Chi Lee](https://github.com/jihchi)
