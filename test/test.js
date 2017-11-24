'use strict';

var compress_images = require("./../index.js"),
	assert = require('assert'),
	rimraf = require('rimraf'),
	mkdirp = require('mkdirp'),
	execFile = require('child_process').execFile, 
	jpegtran = require('jpegtran-bin'),
	fs = require('fs');


    //console.log(path);

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

    it('should will be done!', function (done) {
                mkdirp('test/img/output/jpg/', function(err, made) {
                    if(err){
                        console.log(colors.red('-----------------------------------'));
                        console.log(colors.red('Was error!'));
                        console.error(err)
                        console.log(colors.red('-----------------------------------'));
                    }else{
                        if(null != made){
                            //Выводим лог о том что была создана новая директория
                            //log_create_wasdir(output); 
                            console.log('Была создана новая директория - test/img/output/jpg/'); 

						        execFile(jpegtran, ['-outfile', 'test/img/output/jpg/web.jpg', 'test/img/input/jpg/web.jpg'], function (err) {

                                    if(err){
                                        done('Error !!!!!!!!!!!!!');
                                    }else{
                                        done();
                                    }
						        	//this.timeout(3000);
						            //Block statistic
						            //- - - - - - - - - - - - -  - - - - - - - - - - -
						                //setTimeout(function () {
							                //Узнаем размер файла после сжатия
							                //var size_output = fs.statSync('test/img/output/jpg/web.jpg');
							            //    console.log(size_output); 
							            //    done();
										//}, 4000);  
						            //- - - - - - - - - - - - -  - - - - - - - - - - -
						        });               
                        }else{
                            done();
                        }                 
                    }
                });
    });


   	//compress_images('test/img/input/**/*.jpg', 'test/img/output/', {compress_force: false, statistic: true, autoupdate: true}, false,
    //                                            {jpg: {engine: 'jpegtran', command: false}},
    //                                            {png: {engine: false, command: false}},
    //                                            {svg: {engine: false, command: false}},
    //                                            {gif: {engine: false, command: false}});
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


