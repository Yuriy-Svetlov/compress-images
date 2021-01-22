'use strict';



exports.getPathGifwebp = function () {

	var platform = process.platform;

	if(platform == 'win32'){

		return __dirname+'/win/libwebp-1.1.0-windows-x64/bin/gif2webp.exe';
	}else if(platform == 'linux'){

		return __dirname+'/linux/libwebp-1.1.0-linux-x86-64/bin/gif2webp';
	}else if(platform == 'darwin'){ //Mac OS X

	  	return __dirname+'/mac/libwebp-1.1.0-mac-10.15/bin/gif2webp';
	}

    return false;
};


