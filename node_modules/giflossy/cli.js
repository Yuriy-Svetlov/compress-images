#!/usr/bin/env node
'use strict';
var spawn = require('child_process').spawn;
var giflossy = require('./');

var input = process.argv.slice(2);

spawn(giflossy, input, {stdio: 'inherit'})
	.on('exit', process.exit);
