'use strict';

var path = require('path');
var BinWrapper = require('bin-wrapper');
var pkg = require('../package.json');
var url = 'https://raw.githubusercontent.com/imagemin/jpegoptim-bin/v' + pkg.version + '/vendor/';

module.exports = new BinWrapper()
	.src(url + 'osx/jpegoptim', 'darwin')
	.src(url + 'linux/jpegoptim', 'linux')
	.src(url + 'win32/jpegoptim.exe', 'win32')
	.dest(path.join(__dirname, '../vendor'))
	.use(process.platform === 'win32' ? 'jpegoptim.exe' : 'jpegoptim');
