'use strict';

var os = require('os');
var BinBuild = require('bin-build');
var log = require('logalot');
var bin = require('./');

var cpuNum = os.cpus().length;

bin.run(['-version'], function (err) {
	if (err) {
		log.warn(err.message);
		log.warn('mozjpeg pre-build test failed');
		log.info('compiling from source');

		var cfg = [
			'./configure --disable-shared',
			'--prefix="' + bin.dest() + '" --bindir="' + bin.dest() + '"',
			'--libdir="' + bin.dest() + '"'
		].join(' ');

		var builder = new BinBuild()
			.src('https://github.com/mozilla/mozjpeg/archive/v3.1.tar.gz')
			.cmd('autoreconf -fiv')
			.cmd(cfg)
			.cmd('make --jobs=' + String(cpuNum))
			.cmd('make install --jobs=' + String(cpuNum));

		return builder.run(function (err) {
			if (err) {
				log.error(err.stack);
				return;
			}

			log.success('mozjpeg built successfully');
		});
	}

	log.success('mozjpeg pre-build test passed successfully');
});
