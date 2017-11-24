#!/usr/bin/env node
'use strict';

var spawn = require('child_process').spawn;
var pngout = require('./');
var input = process.argv.slice(2);

spawn(pngout, input, {stdio: 'inherit'})
	.on('exit', process.exit);
