'use strict';

var bin = require('./');
var BinBuild = require('bin-build');
var log = require('logalot');

bin.run(['-version'], function (err) {
	if (err) {
		log.warn(err.message);
		log.warn('cwebp pre-build test failed');
		log.info('compiling from source');

		var cfg = [
			'./configure --disable-shared --prefix="' + bin.dest() + '"',
			'--bindir="' + bin.dest() + '"'
		].join(' ');

		var builder = new BinBuild()
			.src('http://downloads.webmproject.org/releases/webp/libwebp-0.5.1.tar.gz')
			.cmd(cfg)
			.cmd('make && make install');

		return builder.run(function (err) {
			if (err) {
				log.error(err.stack);
				return;
			}

			log.success('cwebp built successfully');
		});
	}

	log.success('cwebp pre-build test passed successfully');
});
