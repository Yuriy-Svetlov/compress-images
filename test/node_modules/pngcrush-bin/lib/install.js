'use strict';
const BinBuild = require('bin-build');
const log = require('logalot');
const bin = require('.');

bin.run(['-version'], err => {
	if (err) {
		log.warn(err.message);
		log.warn('pngcrush pre-build test failed');
		log.info('compiling from source');

		const builder = new BinBuild()
			.src('https://downloads.sourceforge.net/project/pmt/pngcrush/1.8.13/pngcrush-1.8.13.zip')
			.cmd(`mkdir -p ${bin.dest()}`)
			.cmd(`make && mv ${bin.use()} ${bin.path()}`);

		return builder.run(err => {
			if (err) {
				log.error(err.stack);
				return;
			}

			log.success('pngcrush built successfully');
		});
	}

	log.success('pngcrush pre-build test passed successfully');
});
