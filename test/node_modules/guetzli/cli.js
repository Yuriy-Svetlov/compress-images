#!/usr/bin/env node
'use strict';
const spawn = require('child_process').spawn;
const guetzli = require('.');

const input = process.argv.slice(2);

spawn(guetzli, input, {stdio: 'inherit'})
	.on('exit', process.exit);
