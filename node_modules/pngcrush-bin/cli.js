#!/usr/bin/env node
'use strict';
const spawn = require('child_process').spawn;
const pngcrush = require('.');

const input = process.argv.slice(2);

spawn(pngcrush, input, {stdio: 'inherit'})
	.on('exit', process.exit);
