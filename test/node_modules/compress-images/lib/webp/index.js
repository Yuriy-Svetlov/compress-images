'use strict';



exports.getPathGifwebp = function () {

	var platform = process.platform;

	if(platform == 'win32'){

		return __dirname+'/win/libwebp-0.6.0-windows-x86/bin/gif2webp.exe';
	}else if(platform == 'linux'){

		return __dirname+'/linux/libwebp-0.6.0-linux-x86-32/bin/gif2webp';
	}else if(platform == 'darwin'){ //Mac OS X

	  	return __dirname+'/mac/libwebp-0.6.0-mac-10.12/bin/gif2webp';
	}

    return false;
};


