# Compress-image

> [compress-image](https://github.com/semiromid/compress-images) Minify size your images. Image compression with extension: jpg/jpeg, svg, png, gif.

**Minify** size your images. **Image compression** with extension: **`jpg/jpeg`**, **`svg`**, **`png`**, **`gif`**. 

![Image](https://raw.githubusercontent.com/semiromid/compress-images/master/screenshots/1.jpg)

### Distinctive features


You can use different engines and methods for compress images with many options quality.

* For **JPG**: `jpegtran`, `mozjpeg`, `webp`, `guetzli`, `jpegRecompress`, `jpegoptim`, `tinify`;
* For **PNG**: `pngquant`, `optipng`, `pngout`, `webp`, `pngcrush`, `tinify`;
* For **SVG**: `svgo`;
* For **GIF**: `gifsicle`, `giflossy`, `gif2webp`;

##### Combined compression

> You even can minify images on first step `mozjpeg` and on last step on `jpegoptim`. Image will be compressed with use `mozjpeg`+`jpegoptim`


##### Detect path for save image
You can specify the path to source images folder and all images in the folder will be compression and moved to another folder.

**As examples**:

You specify path to all source image**s** `[src/img/**/*.jpg]` and path to compressed image**s** `[build/img/]`.

        INPUT [src/img/**/*.jpg]
        Will be saved image [build/img/1/house/test.jpg]
        Will be saved image [build/img/2/house2/test2.jpg]
        Will be saved image [build/img/5/house5/test.jpg]



## Install
```shell
npm install compress-images --save-dev
```

## Examples how use

```javascript
   compress_images('src/img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}', 'build/img/', {compress_force: false, statistic: true, autoupdate: true}, false,
                                                {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
                                                {png: {engine: 'pngquant', command: ['--quality=0-20']}},
                                                {svg: {engine: 'svgo', command: '--multipass'}},
                                                {gif: {engine: 'gifsicle', command: false}});
```

```javascript
var gulp = require('gulp');
var compress_images = require('compress-images');

//console command a) - gulp watch
gulp.task('watch', function () {
  gulp.watch('src/img/**/*.jpg', ['compress_images']);
});

//or console command b) - gulp compress_images
gulp.task('compress_images', function() {
   compress_images('src/img/**/*.jpg', 'build/img/', {compress_force: false, statistic: true, autoupdate: true}, false,
                                                {jpg: {engine: 'mozjpeg', command: false}},
                                                {png: {engine: false, command: false}},
                                                {svg: {engine: false, command: false}},
                                                {gif: {engine: false, command: false}});
});
```




## API

**`compress_images`**(*`input`*, *`output`*, *`option`*, *`globoption`*, *`enginejpg`*, *`enginepng`*, *`enginesvg`*, *`enginegif`*)
+ **input** (type:string): Path to source image or images;  <br />
        Example:    <br />
        1. `'src/img/**/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}'`;  <br />
        2. `'src/img/**/*.jpg'`;  <br />
        3. `'src/img/*.jpg'`;  <br />
        4. `'src/img/myimagename.jpg'`;  

+ **output** (type:string): Path to compress images;  <br />
            Example:   <br />
            1. `'build/img/'`;  <br />

+ **option** (type:plainObject): Options module\`s «compress-images»; 
    + **compress_force** (type:boolean): Force compress images already compressed images *`true`* or *`false`*;
    + **statistic** (type:boolean): show image compression statistics *`true`* or *`false`*;
    + **autoupdate** (type:boolean): Auto-update module «compress_images» to the latest version *`true`* or *`false`*;  <br />
            Example:   <br />
            1. `{compress_force: false, statistic: true, autoupdate: true}`;  

+  **globoption** (type:boolean|other): Options  module\`s [glob](https://www.npmjs.com/package/glob). Also you can set `false`;

+  **enginejpg** (type:plainObject): Engine for compress **jpeg** and options compress. Key to be `jpg`;
    + **engine** (type:string): Engine for compress jpeg. Possible values:
*`jpegtran`*,*`mozjpeg`*, *`webp`*, *`guetzli`*, *`jpegRecompress`*, *`jpegoptim`*, *`tinify`*;
    + **command** (type:boolean|array): Options compress. Can be `false` or commands array.
        + For **jpegtran** - `['-progressive', '-copy', 'none', '-optimize']` in details; [jpegtran](https://libjpeg-turbo.org/);
        + For **mozjpeg** - `['-quality', '10']` in details [mozjpeg](https://github.com/mozilla/mozjpeg/);
        + For **webp** - `['-q', '60']` in details [webp](https://developers.google.com/speed/webp/);
        + For **guetzli** - `['--quality', '84']` in details [guetzli](https://github.com/google/guetzli/);
        + For **jpegRecompress** - `['--quality', 'high', '--min', '60']` in details [jpegRecompress](https://github.com/danielgtaylor/jpeg-archive/);
        + For **jpegoptim** - `['--all-progressive', '-d']` **Caution!** if do not specify `'-d'` all images will be compressed on source folder and  will be replace.  In details [jpegoptim](https://github.com/tjko/jpegoptim/);
        + For **tinify** - `['copyright', 'creation', 'location']` In details [tinify](https://tinypng.com/developers/reference/nodejs/);
    + **key** (type:string): Key which using for engine **tinify**.  In details; [tinify](https://tinypng.com/developers/reference/nodejs/);  <br />
            Example:  <br /> 
            1. `{jpg: {engine: 'mozjpeg', command: ['-quality', '60']}`;  <br />
            2. `{jpg: {engine: 'tinify', key: "sefdfdcv335fxgfe3qw", command: ['copyright', 'creation', 'location']}}`;  <br />
            3. `{jpg: {engine: 'tinify', key: "sefdfdcv335fxgfe3qw", command: false}}`;    
    
+  **enginepng** (type:plainObject): Engine for compress **png** and options compress. Key to be `png`;
    + **engine** (type:string): Engine for compress png. Possible values:
*`pngquant`*,*`optipng`*, *`pngout`*, *`webp`*, *`pngcrush`*, *`tinify`*;
    + **command** (type:boolean|array): Options compress. Can be `false` or commands array.
        + For **pngquant** - `['--quality=0-20']` in details [pngquant](https://pngquant.org/);
        + For **optipng** - in details [optipng](https://pngquant.org/);
        + For **pngout** - in details [pngout](http://advsys.net/ken/util/pngout.htm);
        + For **webp** - `['-q', '60']` in details [webp](https://developers.google.com/speed/webp/);
        + For **pngcrush** - `['-reduce', '-brute']` in details [pngcrush](https://pmt.sourceforge.io/pngcrush/);
        + For **tinify** - `['copyright', 'creation', 'location']` in details [tinify](https://tinypng.com/developers/reference/nodejs/);
    + **key** (type:string): Key which using for engine **tinify**.  In details; [tinify](https://tinypng.com/developers/reference/nodejs/);  <br />
            Example:  <br /> 
            1. `{png: {engine: 'webp', command: ['-q', '100']}`;  <br />
            2. `{png: {engine: 'tinify', key: "sefdfdcv335fxgfe3qw", command: ['copyright', 'creation', 'location']}}`;  <br />
            3. `{png: {engine: 'optipng', command: false}}`;


+  **enginesvg** (type:plainObject): Engine for compress **svg** and options compress. Key to be `svg`;
    + **engine** (type:string): Engine for compress svg. Possible values:
*`svgo`*;    
    + **command** (type:string): Options compress. Can be `false` or commands type string.
        + For **svgo** - `'--multipass'` in details [svgo](https://www.npmjs.com/package/svgo/);  <br />
                Example:  <br />
                1. `{svg: {engine: 'svgo', command: '--multipass'}`;  <br />
                2. `{svg: {engine: 'svgo', command: false}}`;


+  **enginegif** (type:plainObject): Engine for compress **gif** and options compress. Key to be `gif`;
    + **engine** (type:string): Engine for compress gif. Possible values:
*`gifsicle`*, *`giflossy`*, *`gif2webp`*;  
    + **command** (type:boolean|array): Options compress. Can be `false` or commands type array.
        + For **gifsicle** - In details [gifsicle](http://www.lcdf.org/gifsicle/);
        + For **giflossy** - In details [giflossy](http://www.lcdf.org/gifsicle/);
        + For **gif2webp** - `['-f', '80', '-mixed', '-q', '30', '-m', '2']` in details [gif2webp](https://developers.google.com/speed/webp/docs/gif2webp);    <br />
                Example:  <br />
                1. `{gif: {engine: 'gifsicle', command: false}}`;  <br />
                2. `{gif: {engine: 'giflossy', command: false}}`;  <br />
                3. `{gif: {engine: 'gif2webp', command: ['-f', '80', '-mixed', '-q', '30', '-m', '2']}}`;


_______________________

### Donate
![Image](https://raw.githubusercontent.com/semiromid/compress-images/master/screenshots/health-care.png)
Help me please if possible and support the project.

 **PayPal** | [https://www.paypal.com/myaccount/transfer/send](https://www.paypal.com/myaccount/transfer/send) **`startpascal1@mail.ru`**
 
 **Visa Card** | **`4731 1856 1426 6432`** First name and Last name: `SEMINA TAMARA` or `SEMINA TAMARA PETROVNA`
 
 **Payeer** | [payeer.com](payeer.com) No.[**`P77135727`**]
 
 **PaYoneer** | [https://www.payoneer.com](https://www.payoneer.com) **`startpascal1@mail.ru`**
 
_______________________


## Related
gif2webp [https://developers.google.com/speed/webp/docs/gif2webp](https://developers.google.com/speed/webp/docs/gif2webp) author is Google;

Node package giflossy [https://www.npmjs.com/package/giflossy](https://www.npmjs.com/package/giflossy) Author is Jihchi;

gifsicle and giflossy [http://www.lcdf.org/gifsicle/](http://www.lcdf.org/gifsicle/) author is Eddie Kohler;

gifsicle-bin [https://github.com/imagemin/gifsicle-bin](https://github.com/imagemin/gifsicle-bin) author is Kevva;

svgo [https://www.npmjs.com/package/svgo](https://www.npmjs.com/package/svgo) author is Greli;

pngcrush [https://pmt.sourceforge.io/pngcrush/](https://pmt.sourceforge.io/pngcrush/) author is Glenn Randers-Pehrson;

pngcrush-bin [https://github.com/imagemin/pngcrush-bin](https://github.com/imagemin/pngcrush-bin) author is Kevva;

webp [https://developers.google.com/speed/webp/](https://developers.google.com/speed/webp/) author is Google;

pngout [http://advsys.net/ken/util/pngout.htm](http://advsys.net/ken/util/pngout.htm) author is Kerry Watson, with updates by Ken Silverman and Matthew Fearnley;

pngout-bin [https://github.com/imagemin/pngout-bin](https://github.com/imagemin/pngout-bin) author is 1000ch;

pngquant [https://pngquant.org/](https://pngquant.org/) author is  Kornel Lesiński and contributors. It's based on code by Greg Roelofs and Jef Poskanzer;

pngquant-bin [https://github.com/imagemin/pngquant-bin](https://github.com/imagemin/pngquant-bin) author is Kevva;

tinypng [https://tinypng.com/developers/reference/nodejs](https://tinypng.com/developers/reference/nodejs) author is Voormedia;

tinyjpg [https://tinyjpg.com/](https://tinyjpg.com/) author is Voormedia;

jpegoptim [https://github.com/tjko/jpegoptim](https://github.com/tjko/jpegoptim) author is Tjko;

jpegoptim-bin [https://github.com/imagemin/jpegoptim-bin](https://github.com/imagemin/jpegoptim-bin) author is 1000ch;

jpeg-archive [https://github.com/danielgtaylor/jpeg-archive](https://github.com/danielgtaylor/jpeg-archive) author is Danielgtaylor;

jpeg-recompress-bin [https://github.com/imagemin/jpeg-recompress-bin](https://github.com/imagemin/jpeg-recompress-bin) author is 1000ch;

guetzli [https://github.com/google/guetzli](https://github.com/google/guetzli) author is Google;

guetzli-bin [https://github.com/imagemin/guetzli-bin](https://github.com/imagemin/guetzli-bin) author is 1000ch;

mozjpeg-bin [https://github.com/imagemin/mozjpeg-bin](https://github.com/imagemin/mozjpeg-bin) author is 1000ch;

mozjpeg [https://github.com/mozilla/mozjpeg](https://github.com/mozilla/mozjpeg) author is Pornel;

jpegtran-bin [https://github.com/imagemin/jpegtran-bin](https://github.com/imagemin/jpegtran-bin) author is 1000ch;

libjpeg-turbo [https://libjpeg-turbo.org/](https://libjpeg-turbo.org/) author is Dcommander;

Vectors [https://www.flaticon.com/authors/vectors-market](https://www.flaticon.com/authors/vectors-market) author is Vectors Market;

colors [https://www.npmjs.com/package/colors](https://www.npmjs.com/package/colors) author is Marak;

glob [https://www.npmjs.com/package/glob](https://www.npmjs.com/package/glob) author is Isaacs;


mkdirp [https://www.npmjs.com/package/mkdirp](https://www.npmjs.com/package/mkdirp) author is Substack;


bytes [https://www.npmjs.com/package/bytes](https://www.npmjs.com/package/bytes) author is Dougwilson;


## Bugs
  * github - [https://github.com/semiromid/compress-images/issues](https://github.com/semiromid/compress-images/issues) 

## Author
SEMINA TAMARA

## License
MIT License

Copyright (c) 2017 TAMARA SEMINA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
















