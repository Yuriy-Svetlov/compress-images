#!/usr/bin/env node
'use strict';
const spawn = require('child_process').spawn;
const optipng = require('.');

const input = process.argv.slice(2);

spawn(optipng, input, {stdio: 'inherit'})
	.on('exit', process.exit);
