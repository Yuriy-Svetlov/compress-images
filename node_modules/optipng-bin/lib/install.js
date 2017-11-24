'use strict';
const BinBuild = require('bin-build');
const log = require('logalot');
const bin = require('.');

bin.run(err => {
	if (err) {
		log.warn(err.message);
		log.warn('optipng pre-build test failed');
		log.info('compiling from source');

		new BinBuild()
			.src('https://downloads.sourceforge.net/project/optipng/OptiPNG/optipng-0.7.6/optipng-0.7.6.tar.gz')
			.cmd(`./configure --with-system-zlib --prefix="${bin.dest()}" --bindir="${bin.dest()}"`)
			.cmd('make install')
			.run(err => {
				if (err) {
					log.error(err.stack);
					return;
				}

				log.success('optipng built successfully');
			});

		return;
	}

	log.success('optipng pre-build test passed successfully');
});
