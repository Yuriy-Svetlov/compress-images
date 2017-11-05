'use strict';
var BinBuild = require('bin-build');
var log = require('logalot');
var bin = require('./');

bin.run(['--version'], function (err) {
	if (err) {
		log.warn(err.message);
		log.warn('giflossy pre-build test failed');
		log.info('compiling from source');

		var cfg = [
			'./configure --disable-gifview --disable-gifdiff',
			'--prefix="' + bin.dest() + '" --bindir="' + bin.dest() + '"'
		].join(' ');

		var builder = new BinBuild()
			.src('https://github.com/pornel/giflossy/archive/lossy/1.82.1.tar.gz')
			.cmd('autoreconf -ivf')
			.cmd(cfg)
			.cmd('make install');

		return builder.run(function (err) {
			if (err) {
				log.error(err.stack);
				return;
			}

			log.success('giflossy built successfully');
		});
	}

	log.success('giflossy pre-build test passed successfully');
});
