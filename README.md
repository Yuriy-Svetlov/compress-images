# compress-image

> [compress-image](https://github.com/semiromid/compress-images) Minify size your images. Image compression with extension: jpg/jpeg, svg, png, gif.




Minify size your images. Image compression with extension: jpg/jpeg, svg, png, gif.


![Image](https://raw.githubusercontent.com/semiromid/compress-images/master/screenshots/1.jpg)



### Description is not ready yet


## Install
```shell
npm install compress-images --save-dev
```

## Usage
```javascript
var compress_images = require('compress-images');
gulp.task('compress_images', function() {
   compress_images('src/img/**/*.jpg', 'build/img/', {compress_force: false, statistic: true, autoupdate: true}, false,
                                                {jpg: {engine: 'mozjpeg', command: false}},
                                                {png: {engine: false, command: false}},
                                                {svg: {engine: false, command: false}},
                                                {gif: {engine: false, command: false}});
});
```


## Examples

```javascript
var compress_images = require('compress-images');
gulp.task('compress_images', function() {
   compress_images('src/img/**/*.{jpg,JPG,jpeg,JPEG,png}', 'build/img/', {compress_force: false, statistic: true, autoupdate: true}, false,
                                                {jpg: {engine: 'mozjpeg', command: false}},
                                                {png: {engine: 'pngquant', command: false}},
                                                {svg: {engine: false, command: false}},
                                                {gif: {engine: false, command: false}});
});
```

```javascript
var compress_images = require('compress-images');
gulp.task('compress_images', function() {
   compress_images('src/img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}', 'build/img/', {compress_force: false, statistic: true, autoupdate: true}, false,
                                                {jpg: {engine: 'mozjpeg', command: ['-quality', '10']}},
                                                {png: {engine: 'pngquant', command: ['--quality=0-20']}},
                                                {svg: {engine: 'svgo', command: '--multipass'}},
                                                {gif: {engine: 'gifsicle', command: false}});
});
```



## API
gulp_jpgmin(input, output, option, globoption, enginejpg, enginepng, enginesvg, enginegif);

+ input(string) - Path to source images;

+ output(string) - Path to compressed images;

+ option{
  	+      compress_force(boolean) - [false/true] Force compression of already compressed images;

  	+      statistic(boolean) -  [false/true] Enabling / disabling statistics;

  	+      autoupdate(boolean) - [false/true] AutoUpdate the module;
        }

+ globoption(boolean|string) - Module Options [https://www.npmjs.com/package/glob]

+ enginejpg{
  		+      engine(string) - [jpegtran, mozjpeg, webp, guetzli, jpegRecompress, jpegoptim, tinify] Image compression engine;

  		+      command(array) - 
			}

+ enginepng -

+ enginesvg - 

+ enginegif -



## Bugs

* Please to write

  * github - [https://github.com/semiromid/compress-images](https://github.com/semiromid/compress-images) 

  * email - startpascal1@mail.ru
 

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
