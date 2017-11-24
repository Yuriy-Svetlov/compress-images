'use strict';

var BinBuild = require('bin-build');
var log = require('logalot');
var bin = require('./');

bin.run(['--version'], function (err) {
	if (err) {
		log.warn(err.message);
		log.warn('jpegoptim pre-build test failed');
		log.info('compiling from source');

		var builder = new BinBuild()
			.src('https://github.com/tjko/jpegoptim/archive/RELEASE.1.4.3.tar.gz')
			.cmd('./configure --prefix="' + bin.dest() + '" --bindir="' + bin.dest() + '"')
			.cmd('make install');

		return builder.run(function (err) {
			if (err) {
				log.error(err.stack);
				return;
			}

			log.success('jpegoptim built successfully');
		});
	}

	log.success('jpegoptim pre-build test passed successfully');
});
