'use strict';

var compress_images = require('compress-images'),
	assert = require('assert'),
	rimraf = require('rimraf'),
	fs = require('fs');

/*
describe('Delete all folder output and all images inside!', function () {
    it('Will be should  delete directory with all images!', function (done) {
		//---------------------------------------------------
		rimraf('test/img/output', function () { 
	        if (fs.existsSync('test/img/output')) {
				done('Directory exist !!!!!!!!!!!!!');
			}else{
				done();
			}
		});
		//---------------------------------------------------
	});   	
});
*/


describe('Test [JPG]    engine [jpegtran]    [options=false]', function () {
   	compress_images('img/input/**/*.jpg', 'img/output/', {compress_force: false, statistic: true, autoupdate: true}, false,
                                                {jpg: {engine: 'jpegtran', command: false}},
                                                {png: {engine: false, command: false}},
                                                {svg: {engine: false, command: false}},
                                                {gif: {engine: false, command: false}});
});

/*
npm test
var assert = require('assert');

describe('addition', function () {
    it('should add 1+1 correctly', function (done) {
        var onePlusOne = 1 + 1;
        assert.equal(2, onePlusOne);
        // must call done() so that mocha know that we are... done.
        // Useful for async tests.
        done();
    });
});
*/


