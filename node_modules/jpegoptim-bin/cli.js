#!/usr/bin/env node
'use strict';

var spawn = require('child_process').spawn;
var jpegoptim = require('./');
var input = process.argv.slice(2);

spawn(jpegoptim, input, {stdio: 'inherit'})
	.on('exit', process.exit);
