'use strict';

var path = require('path');
var log = require('logalot');
var bin = require('./');
var args = [
	path.join(__dirname, '../test/fixtures/test.png'),
	path.join(__dirname, '../test/fixtures/test-optimized.png'),
	'-s4',
	'-c6',
	'-y'
];

bin.run(args, function (err) {
	if (err) {
		log.error(err.stack);
		return;
	}

	log.success('pngout pre-build test passed successfully');
});
