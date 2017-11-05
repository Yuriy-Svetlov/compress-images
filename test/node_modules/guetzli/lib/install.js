'use strict';
const BinBuild = require('bin-build');
const log = require('logalot');
const bin = require('.');

bin.run(['--version'], err => {
	if (err) {
		log.warn(err.message);
		log.warn('guetzli pre-build test failed');
		log.info('compiling from source');

		const builder = new BinBuild()
			.src('https://github.com/google/guetzli/archive/v1.0.1.tar.gz')
			.cmd(`mkdir -p ${bin.dest()}`)
			.cmd(`make && mv bin/Release/${bin.use()} ${bin.path()}`);

		return builder.run(err => {
			if (err) {
				log.error(err.stack);
				return;
			}

			log.success('guetzli built successfully');
		});
	}

	log.success('guetzli pre-build test passed successfully');
});
