    var compress_images = require('compress-images');

    const INPUT_path_to_your_images = 'src/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}';
    const OUTPUT_path = 'build/';
    
    compress_images(INPUT_path_to_your_images, OUTPUT_path, {compress_force: false, statistic: true, autoupdate: true, pathLog: './log/compress-images/1'}, false,
                                                {jpg: {engine: 'jpegRecompress', command: ['--quality', 'high', '--min', '60']}},
                                                {png: {engine: 'pngquant', command: ['--quality=20-50']}},
                                                {svg: {engine: 'svgo', command: '--multipass'}},
                                                {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}}, function(err){
            if(err !== null){
            	//---------------------------------------
            	//if you get an ERROR ---> Can to use alternative config of compression
            	//---------------------------------------
			    if(err.engine === 'jpegRecompress'){
				    compress_images(err.input, err.output, {compress_force: false, statistic: true, autoupdate: true}, false,
				                                                {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
				                                                {png: {engine: false, command: false}},
				                                                {svg: {engine: false, command: false}},
				                                                {gif: {engine: false, command: false}}, function(err){
				            if(err !== null){
				            	//Alternative config of compression

				            }                                   	
				    });
			    }
			    //---------------------------------------

            }                                   	

    });