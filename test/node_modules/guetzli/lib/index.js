'use strict';
const path = require('path');
const BinWrapper = require('bin-wrapper');
const pkg = require('../package.json');

const url = `https://raw.githubusercontent.com/imagemin/guetzli-bin/v${pkg.version}/vendor/`;

module.exports = new BinWrapper()
	.src(`${url}macos/guetzli`, 'darwin')
	.src(`${url}linux/guetzli`, 'linux')
	.src(`${url}win/guetzli.exe`, 'win32')
	.dest(path.resolve(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'guetzli.exe' : 'guetzli');
