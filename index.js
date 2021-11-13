'use strict';

var  colors = require('colors'),
     fs = require('fs'),
     glob = require("glob"),
     path = require("path"),
     execFile = require('child_process').execFile, 
     exec = require('child_process').exec,
     
     //JPG
     jpegtran = require('jpegtran-bin'),
     jpegRecompress = require('jpeg-recompress-bin'),
     cwebp = require('cwebp-bin'),
     mozjpeg = require('mozjpeg'),
     guetzli,
     jpegoptim,
     tinifyjpeg = require("tinify"),

     //PNG
     pngquant,
     optipng,
     pngout = require('pngout-bin'),
     pngcrush = require('pngcrush-bin'),
     tinifypng = require("tinify"),

     //SVG
     //https://www.npmjs.com/package/svgo

     //GIF
     gifsicle,
     giflossy,
     gif2webp = require('./lib/webp'),
     //updater = require('./lib/updater'),


     mkdirp = require('mkdirp'),
     bytes = require('bytes'),

     path_gif2webp, 
     length_files = 0,
     lock__length_files = false;



//set DEBUG=*,-not_this
//var  debug = require('debug')("glob");
//debug('[File] ');
//var  debug_updater = require('debug')("./lib/updater");


var index = function (input, output, option, findfileop, enginejpg, enginepng, enginesvg, enginegif, callback) {
    
    // JPG
    if(enginejpg.jpg.engine === "jpegoptim" && jpegoptim === undefined){
      if(checkExistsModule('jpegoptim-bin', 'npm install jpegoptim-bin --save') != true){
        return false;
      }
      jpegoptim = require('jpegoptim-bin');
    }else

    if(enginejpg.jpg.engine === "guetzli" && guetzli === undefined){
      if(checkExistsModule('guetzli', 'npm install guetzli --save') != true){
        return false;
      }
      guetzli = require('guetzli');      
    }


    

    // PNG
    if(enginepng.png.engine === "optipng" && optipng === undefined){
      if(checkExistsModule('optipng-bin', 'npm install optipng-bin --save') != true){
        return false;
      }      
      optipng = require('optipng-bin');

    }else
    if(enginepng.png.engine === "pngquant" && pngquant === undefined){
      if(checkExistsModule('pngquant-bin', 'npm install pngquant-bin@6.0.1 --save') != true){
        return false;
      }

      pngquant = require('pngquant-bin');
    }    

    // GIF
    if(enginegif.gif.engine === "gifsicle" && gifsicle === undefined){
      if(checkExistsModule('gifsicle', 'npm install gifsicle@5.2.1 --save') != true){
        return false;
      }

      gifsicle = require('gifsicle');
    }else    
    if(enginegif.gif.engine === "giflossy" && giflossy === undefined){
      if(checkExistsModule('giflossy', 'npm install giflossy --save') != true){
        return false;
      }

      giflossy = require('giflossy');
    }

    //Updater
    //debug_updater('[to]');
    //updater(fs, colors, execFile, option.autoupdate);
    //debug_updater('[from]');


    //--------------------------------------------------------------------------    
    //Options
    //--------------------------------------------------------------------------
    if(undefined == option.statistic){
        option.statistic = true;
    }
    if(undefined == option.compress_force){
        option.compress_force = false;
    }
    if(undefined == findfileop){
        findfileop = {};
    }
    if(undefined == option.pathLog){
        option.pathLog = './log/compress-images';
    }

    //--------------------------------------------------------------------------


    //JPG
    if(false == enginejpg.jpg.engine){
        if(/^.*(\.({|{[a-zA-Z,]*,)|\.)(jpg|jpeg)(,[,a-zA-Z]*}|}|)$/gi.test(input)){
          console.log(colors.red(" You didn't turn on [enginejpg], but your input path includes the 'jpg' extension; either delete the extension 'jpg' from the input path, or turn on [enginejpg: ['jpegtran'] or ['mozjpeg'] or ['webp'] or other]. Alternatively, your input path may be malformed!: Examples: src/img/**/*.{jpg,JPG,jpeg,JPEG,png} or src/img/**/*.jpg or src/img/*.jpg ..."));
          console.log(colors.red(' Input path: ')+colors.magenta(input));
          return callback(true);
        }
    }else{
        //if(!/^.*(\.({|{[a-zA-Z,]*,)|\.)(jpg|jpeg)(,[,a-zA-Z]*}|}|)$/gi.test(input)){
        //  console.log(colors.red(" You didn't turn on [enginejpg], but your input path includes the 'jpg' extension;  either delete the extension 'jpg' from path, or turn on [enginejpg: ['jpegtran'] or ['mozjpeg'] or ['webp'] or other]. Alternatively, your input path may be malformed!: Examples: src/img/**/*.{jpg,JPG,jpeg,JPEG,png} or src/img/**/*.jpg or src/img/*.jpg ..."));
        //  console.log(colors.red(' Input path: ')+colors.magenta(input));

        //  return callback(true);
        //}      
    }

    //PNG
    if(false == enginepng.png.engine){
        if(/^.*(\.({|{[a-zA-Z,]*,)|\.)(png)(,[,a-zA-Z]*}|}|)$/gi.test(input)){
          console.log(colors.red(" You didn't turn on [enginepng], but your input path includes the 'png' extension; either delete the extension 'png' from the input path, or turn on [enginepng: ['pngquant'] or ['optipng'] or ['webp'] or other]. Alternatively, your input path may be malformed!: Examples: src/img/**/*.{jpg,JPG,jpeg,JPEG,png} or src/img/**/*.png or src/img/*.png ..."));
          console.log(colors.red(' Input path: ')+colors.magenta(input));
          return callback(true);
        }
    }else{
        //if(!/^.*(\.({|{[a-zA-Z,]*,)|\.)(png)(,[,a-zA-Z]*}|}|)$/gi.test(input)){
        //  console.log(colors.red(" You didn't turn on [enginepng], but your input path includes the 'png' extension;  either delete the extension 'png' from path, or turn on [enginepng: ['pngquant'] or ['optipng'] or ['webp'] or other]. Alternatively, your input path may be malformed!: Examples: src/img/**/*.{jpg,JPG,jpeg,JPEG,png} or src/img/**/*.png or src/img/*.png ..."));
        //  console.log(colors.red(' Input path: ')+colors.magenta(input));
        //  return callback(true);
        //}      
    }


    //SVG
    if(false == enginesvg.svg.engine){
        if(/^.*(\.({|{[a-zA-Z,]*,)|\.)(svg)(,[,a-zA-Z]*}|}|)$/gi.test(input)){
          console.log(colors.red(" You didn't turn on [enginesvg], but your input path includes the 'svg' extension; either delete the extension 'svg' from the input path, or turn on [enginesvg: ['svgo'] or other]. Alternatively, your input path may be malformed!: Examples: src/img/**/*.{jpg,JPG,jpeg,JPEG,svg} or src/img/**/*.svg or src/img/*.svg ..."));
          console.log(colors.red(' Input path: ')+colors.magenta(input));
          return callback(true);
        }
    }else{
        //if(!/^.*(\.({|{[a-zA-Z,]*,)|\.)(svg)(,[,a-zA-Z]*}|}|)$/gi.test(input)){
        //  console.log(colors.red(" You didn't turn on [enginesvg], but your input path includes the 'svg' extension;  either delete the extension 'svg' from path, or turn on [enginesvg: ['svgo'] or other]. Alternatively, your input path may be malformed!: Examples: src/img/**/*.{jpg,JPG,jpeg,JPEG,svg} or src/img/**/*.svg or src/img/*.svg ..."));
        //  console.log(colors.red(' Input path: ')+colors.magenta(input));
        //  return callback(true);
        //}      
    }
    

    //GIF
    if(false == enginegif.gif.engine){
        if(/^.*(\.({|{[a-zA-Z,]*,)|\.)(gif)(,[,a-zA-Z]*}|}|)$/gi.test(input)){
          console.log(colors.red(" You didn't turn on [enginegif], but your input path includes the 'gif' extension; either delete the extension 'gif' from the input path, or turn on [enginegif: ['gifsicle'] or other]. Alternatively, your input path may be malformed!: Examples: src/img/**/*.{jpg,JPG,jpeg,JPEG,gif} or src/img/**/*.gif or src/img/*.gif ..."));
          console.log(colors.red(' Input path: ')+colors.magenta(input));
          return callback(true);
        }
    }else{
        //if(!/^.*(\.({|{[a-zA-Z,]*,)|\.)(gif)(,[,a-zA-Z]*}|}|)$/gi.test(input)){
        //  console.log(colors.red(" You didn't turn on [enginegif], but your input path includes the 'gif' extension;  either delete the extension 'gif' from path, or turn on [enginegif: ['gifsicle'] or other]. Alternatively, your input path may be malformed!: Examples: src/img/**/*.{jpg,JPG,jpeg,JPEG,gif} or src/img/**/*.gif or src/img/*.gif ..."));
        //  console.log(colors.red(' Input path: ')+colors.magenta(input));
        //  return callback(true);
        //}      
    }







    //Init 
    if(enginejpg.jpg.engine == 'tinify'){
      if(undefined != enginejpg.jpg.key){
        tinifyjpeg.key = enginejpg.jpg.key;
      }else{
        console.log(colors.red(" You have not set an API KEY for the [tinify] API. Example: {jpg: {engine: 'tinify', key: 'K_lYTUGjgbHJBGRFpXnhJBkbvLHKblhBhM', command: false}}"));
        return callback(true);
      }
    }else if(enginepng.png.engine == 'tinify'){
      if(undefined != enginepng.png.key){
        tinifypng.key = enginepng.png.key;
      }else{
        console.log(colors.red(" You have not set an API KEY for the [tinify] API. Example: {jpg: {engine: 'tinify', key: 'K_lYTUGjgbHJBGRFpXnhJBkbvLHKblhBhM', command: false}}"));
        return callback(true);
      }
    }

    if(enginegif.gif.engine == 'gif2webp'){
      path_gif2webp = gif2webp.getPathGifwebp();
    }













    var filename, path_in_part, test_8;
    /*
      path_in_part - путь типа - "src/img/", путь с звёздочками обрезается
    */
        
    //[Определяем, содержит ли путь **
    if(/\*/.test(input)){
        path_in_part = input.replace(/(\*\*.+|\*.+)/g, '');
    }else{
        filename = input.split("/").pop();
    }

    

    


    //Если указан конкретный файл то не проводим поиск всех файлов в папке
    if(path_in_part != undefined && path_in_part != null){
        ///////////////////////////////////////////////////////////////////////
        //Проводим поиск всех файлов
        ///////////////////////////////////////////////////////////////////////
        var path_out_new, ext; //полный путь вывода файла
        glob(input, findfileop, function (er, files) {
          if(files != null || er == null){

              if(files.length > 0){
                length_files = files.length;
                for (var i = 0; files.length > i; i++) {
                    path_out_new = files[i].replace(new RegExp(path_in_part, "g"), output);
                    //--------------------------------------------
                    ext = getExtensionFile(path_out_new);
                    if(enginepng.png.engine == 'webp'){
                        if(ext == 'png'){
                            //Заменяем расширение на - webp
                            path_out_new = path_out_new.replace(/\.[a-zA-Z]+$/g, '.webp');
                        }
                    }

                    if(enginejpg.jpg.engine == 'webp'){
                        if(ext == 'jpg' || ext == 'jpeg' || ext == 'JPG' ||  ext == 'JPEG'){
                            //Заменяем расширение на - webp
                            path_out_new = path_out_new.replace(/\.[a-zA-Z]+$/g, '.webp');
                        }
                    }

                    if(enginegif.gif.engine == 'gif2webp'){
                        if(ext == 'gif'){
                            //Заменяем расширение на - webp
                            path_out_new = path_out_new.replace(/\.[a-zA-Z]+$/g, '.webp');
                        }
                    }              
                    //--------------------------------------------
                    //Вызываем метод процесса сжатия
                    CompressorProcess(files[i], path_out_new); 
                }

              }else{
                console.log(colors.red(" Directory is empty!: ")+colors.magenta(input));
                writeLogError(" Directory is empty!: ", input, '-', '-');
              }
            }else{
              console.error(er);
              return callback(er);
            }
        });
    }else if(filename != undefined && filename != null){
        ///////////////////////////////////////////////////////////////////////
        //Не проводим поиск всех файлов
        ///////////////////////////////////////////////////////////////////////
        var path_out_new = output+filename; //полный путь вывода файла
        lock__length_files = true;
        
        if(enginejpg.jpg.engine == 'webp' || enginegif.gif.engine == 'gif2webp'){
          //Заменяем расширение на - webp
          path_out_new = path_out_new.replace(/\.[a-zA-Z]+$/g, '.webp');
        }

        //Вызываем метод процесса сжатия
        CompressorProcess(input, path_out_new);            
    }




    








      /*
      input - ссылка на начальный файл
      path_out_new - Полный путь с самим файлом результата сжатия - test/dir/for/file.jpg
      */
      function CompressorProcess(input, path_out_new){

          //Если включена опция принудительного сжатия уже сжатыйх файлов, то сжимаем их, инчане нет.
          if(!option.compress_force){
              //Узнаём, сжимали или мы ранее этот файл. Для этого проверяем есть ли он в output
              if(!checkFile(path_out_new)){

                //Проверяем существования файла перед сжатием
                if(!checkFile(input)){
                    console.log(colors.red("   File does not exist!")); 
                    writeLogError("File does not exist!", input, path_out_new, '-');

                    //Провееряем обновление
                    checkUpdate(); 
                    if(length_files === 0){
                        return callback(null, true);
                    }

                    return false;
                }

                //Убираем у новой директории имя файла
                var output = getPath(path_out_new), extension_f;

                //Проверяем наличие необходимых директорий для его создания
                checkDir(output, function(err, made) {
                    if(err){
                        console.log(colors.red('-----------------------------------'));
                        console.log(colors.red('An error occurred!'));
                        console.error(err)
                        console.log(colors.red('-----------------------------------'));
                        return callback(err);
                    }else{
                        if(null != made && option.statistic === true){
                            //Выводим лог о том что была создана новая директория
                            log_create_wasdir(output);                   
                        }
                        //Узнаём расширение файла
                        extension_f = getExtensionFile(input);
                        if(extension_f == 'jpg' || extension_f == 'JPG' || extension_f == 'jpeg' || extension_f == 'JPEG'){
                            //JPG Сжимаем файл
                            CompressionFileJpg(input, path_out_new, function(size_in, size_output, percent, err){

                                outputResult(input, path_out_new, enginejpg.jpg.engine, size_in, size_output, percent, err, function(error, completed){
                                    outputResultcallback(error, completed, input, path_out_new, enginejpg.jpg.engine, size_in, size_output, percent, err);
                                });
                            });                   
                        }else if(extension_f == 'png' || extension_f == 'PNG'){
                            //PNG Сжимаем файл
                            CompressionFilePng(input, path_out_new, function(size_in, size_output, percent, err){

                                outputResult(input, path_out_new, enginepng.png.engine, size_in, size_output, percent, err, function(error, completed){
                                    outputResultcallback(error, completed, input, path_out_new, enginepng.png.engine, size_in, size_output, percent, err);
                                });                                                                               
                            });                       
                        }else if(extension_f == 'svg'){
                            //SVG Сжимаем файл
                            CompressionFileSvg(input, path_out_new, function(size_in, size_output, percent){
                                
                                outputResult(input, path_out_new, enginesvg.svg.engine, size_in, size_output, percent, err, function(error, completed){
                                    outputResultcallback(error, completed, input, path_out_new, enginesvg.svg.engine, size_in, size_output, percent, err);
                                });                  
                            });                       
                        }else if(extension_f == 'gif'){
                            //GIF Сжимаем файл
                            CompressionFileGif(input, path_out_new, function(size_in, size_output, percent){

                                outputResult(input, path_out_new, enginegif.gif.engine, size_in, size_output, percent, err, function(error, completed){
                                    outputResultcallback(error, completed, input, path_out_new, enginegif.gif.engine, size_in, size_output, percent, err);
                                });               
                            });                       
                        }                  
                    }
                });
              }else{
                  //Провееряем обновление
                  checkUpdate(); 
                  if(length_files === 0){
                      return callback(null, true);
                  }//else{
                    //return callback(null, false);
                  //}   
              }
          }else{
                //Проверяем существования файла перед сжатием
                if(!checkFile(input)){
                    console.log(colors.red("   File does not exist!")); 
                    writeLogError("File does not exist!", input, path_out_new, '-');

                    //Провееряем обновление
                    checkUpdate(); 
                    if(length_files === 0){
                        return callback(null, true);
                    }

                    return false;
                }

              //Убираем у новой директории имя файла
              var output = getPath(path_out_new);
              //Проверяем есть ли необходимая директория
              checkDir(output, function(err, made){
                if(err){
                  console.log(colors.red('-----------------------------------'));
                  console.log(colors.red('An error occurred!'));
                  console.error(err)
                  console.log(colors.red('-----------------------------------'));
                }else{
                    if(null != made && option.statistic === true){
                        log_create_wasdir(output);
                    }
                    //Узнаём расширение файла
                    extension_f = getExtensionFile(input);
                    if(extension_f == 'jpg' || extension_f == 'JPG' || extension_f == 'jpeg' || extension_f == 'JPEG'){
                            //JPG Сжимаем файл
                            CompressionFileJpg(input, path_out_new, function(size_in, size_output, percent, err){
                                
                                outputResult(input, path_out_new, enginejpg.jpg.engine, size_in, size_output, percent, err, function(error, completed){
                                    outputResultcallback(error, completed, input, path_out_new, enginejpg.jpg.engine, size_in, size_output, percent, err);
                                });                 
                            });                   
                    }else if(extension_f == 'png' || extension_f == 'PNG'){
                            //PNG Сжимаем файл
                            CompressionFilePng(input, path_out_new, function(size_in, size_output, percent, err){
                                
                                outputResult(input, path_out_new, enginepng.png.engine, size_in, size_output, percent, err, function(error, completed){
                                    outputResultcallback(error, completed, input, path_out_new, enginepng.png.engine, size_in, size_output, percent, err);
                                });               
                            });                       
                    }else if(extension_f == 'svg'){
                            //SVG Сжимаем файл
                            CompressionFileSvg(input, path_out_new, function(size_in, size_output, percent){
                                
                                outputResult(input, path_out_new, enginesvg.svg.engine, size_in, size_output, percent, err, function(error, completed){
                                    outputResultcallback(error, completed, input, path_out_new, enginesvg.svg.engine, size_in, size_output, percent, err);
                                });                  
                            });                       
                    }else if(extension_f == 'gif'){
                            //GIF Сжимаем файл
                            CompressionFileGif(input, path_out_new, function(size_in, size_output, percent){
                                
                                outputResult(input, path_out_new, enginegif.gif.engine, size_in, size_output, percent, err, function(error, completed){
                                    outputResultcallback(error, completed, input, path_out_new, enginegif.gif.engine, size_in, size_output, percent, err);
                                });               
                            });                       
                    } 
                }
              }); 
          } 

      }




      function outputResultcallback(error, completed, input, path_out_new, engine, size_in, size_output, percent, err){
          let statistic = {};
          statistic.input = input;
          statistic.path_out_new = path_out_new;
          statistic.algorithm = engine;
          statistic.size_in = size_in;
          statistic.size_output = size_output;
          statistic.percent = percent;
          statistic.err = err;
          return callback(error, completed, statistic);        
      }













    //Сжатие JPG файла
    function CompressionFileJpg(input, output, callback){
      var size_in, size_output, percent; 
      
      if(option.statistic){
        //Block statistic
        //- - - - - - - - - - - - -  - - - - - - - - - - -      
        //Размер файла пред сжатием       
        size_in = getFilesizeInBytes(input);
        //- - - - - - - - - - - - -  - - - - - - - - - - -   
      }

      if(enginejpg.jpg.engine == 'jpegtran'){
        /*
        [-copy none] - убирает все метаданные из исходного файла
        [-optimize] -  оптимизирует изображение 
        [-progressive] - Это такой тип JPG, который при загрузке страницы сначала показывает общие очертания, потом догружается и доводит качество картинки до максимального. Очень удобно для медленного мобильного интернета, и потому его необходимо использовать.
        
        Example: 
        '-progressive', '-copy', 'none', '-optimize' 'output', 'input'
        */
        var array;
        if(false != enginejpg.jpg.command){
          array = enginejpg.jpg.command.concat(['-outfile', output, input]);  
        }else{
          array = ['-outfile', output, input];
        }

        execFile(jpegtran, array, function (err) {

            if(err === null){ 
                if(option.statistic){
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null);  
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
                return callback(0, 0, 0, err);
            } 
          return callback(null, null, null, null);               
        }); 
      }else if(enginejpg.jpg.engine == 'mozjpeg'){
        /*
        [-quality] - указывается качество (не обязательно)
        Example:
        ['-quality', '10']

        {jpg: {engine: 'mozjpeg', command: false}}
        {jpg: {engine: 'mozjpeg', command: ['-quality', '10']}}
        */

        var array;
        if(false != enginejpg.jpg.command){
          array = enginejpg.jpg.command.concat(['-outfile', output, input]);  
        }else{
          array = ['-outfile', output, input];
        }
        //var array = enginejpg.jpg.command.concat(output, input);

        execFile(mozjpeg, array, function (err) {
            if(err === null){           
                if(option.statistic){
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null); 
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
                return callback(0, 0, 0, err);
            } 
          return callback(null, null, null, null);                              
        });   
      }else if(enginejpg.jpg.engine == 'webp'){
        /*
        Основная команда:
        '-o' - указывает файл для вывода

        Дополнительные команды (некоторые, остальные ниже в ссылках):
        -q - from 0 to 100. The default is 75.

        ['-q', '100']

        Документация - как использовать
        https://developers.google.com/speed/webp/docs/using
        //Команды
        https://developers.google.com/speed/webp/docs/cwebp

        Example
        'input.jpg', '-o', 'output.webp'
        -q 1 'input.jpg', '-o', 'output.webp'

        {jpg: {engine: 'webp', command: false}}
        {jpg: {engine: 'webp', command: ['-q', '100']}}
        */
        var array;
        if(false != enginejpg.jpg.command){
          array = enginejpg.jpg.command.concat(input, ['-o'], output);
        }else{
          array = [input, '-o', output];
        }  

        execFile(cwebp, array, function (err) {
            if(err === null){           
                if(option.statistic){
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null); 
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
                return callback(0, 0, 0, err);
            } 
          return callback(null, null, null, null);                              
        });  
      }else if(enginejpg.jpg.engine == 'guetzli'){
        /*
        '--quality', '84'
        Проблема с сжиманием (очень долго сжимает)  на win 8.1 64 - https://github.com/google/guetzli/issues/238

        https://github.com/google/guetzli
        Example:
        base: ['input.jpg', 'output.jpg']
        */
        var array;
        if(false != enginejpg.jpg.command){
          array = enginejpg.jpg.command.concat(input, output);
        }else{
          array = [input].concat(output);
        }
        
        execFile(guetzli, array, err => {
            if(err === null){          
                if(option.statistic){
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null); 
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
                return callback(0, 0, 0, err);
            } 
          return callback(null, null, null, null);                              
        }); 
      }else if(enginejpg.jpg.engine == 'jpegRecompress'){
        /*
        https://github.com/danielgtaylor/jpeg-archive
        Example:
        base: ['input.jpg', 'output.jpg']
        ['--quality high', '--min 60', 'input.jpg', 'output.jpg']
        */
        var array;
        if(false != enginejpg.jpg.command){
          array = enginejpg.jpg.command.concat(input, output);
        }else{
          array = [input].concat(output);
        }

        execFile(jpegRecompress, array, function (err) {
            if(err === null){
                if(option.statistic){
                    //Block statistic
                    //- - - - - - - - - - - - -  - - - - - - - - - - -
                    //Узнаем размер файла после сжатия
                    size_output = getFilesizeInBytes(output);
                    
                    //Находим на сколько процентов удалось сжать файл
                    percent = size_output / size_in;
                    percent = percent * 100;
                    percent = 100 - percent;
                    percent = Math.round(percent * 100) / 100;

                    return callback(size_in, size_output, percent, null); 
                    //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
                return callback(0, 0, 0, err);
            }
          return callback(null, null, null, null);               
        }); 
      }else if(enginejpg.jpg.engine == 'jpegoptim'){
        /*
        -o, --overwrite overwrite target file even if it exists
        --strip-all
        --all-progressive - прогерссивное изображение
        -f, --force     force optimization
        -d - директория вывода изображения
        -m[0..100], --max=[0..100]
                  set maximum image quality factor (disables lossless
                  optimization mode, which is by default on)

        //Примечание:
        //https://github.com/tjko/jpegoptim/issues/54
        //Наблюдается проблема, на Windows 8.1 x64 выводит файл изображение с изменённым именем и расширением .tmp
        Это происходит из-за неправильного слэша. Вот правильный формат: "J:\111\jpegoptim-64.exe" --all-progressive -d b\1 a\olQ9Dqr.jpg
        

        https://github.com/tjko/jpegoptim
        Example:
        base:
        ['input.jpg']
        ['--all-progressive', '-d', 'output.jpg', 'input.jpg']
        */
        var array;
        if(false != enginejpg.jpg.command){
          //Если установлена опция вывода файлов в отдельную дерикторию, то добавляем в массив папку для вывода
          const input_2 = input.replace(/\//g, '\\');

          if(cheopJpegoptim(enginejpg.jpg.command)){
            //обрезаем имя файла
            let output_2 = getPath(output).replace(/\/$/g, '');
            output_2 = output_2.replace(/\//g, '\\');
            array = enginejpg.jpg.command.concat(output_2, input_2);            
          }else{
            array = enginejpg.jpg.command.concat(input_2);    
          }
        }else{
          array = [input_2];
        }

        execFile(jpegoptim, array, err => {
            if(err === null){           
                if(option.statistic){
                  
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null); 
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                } 
            }else{
                return callback(0, 0, 0, err, null);
            } 
          return callback(null, null, null, null);                                       
        });
      }else if(enginejpg.jpg.engine == 'tinify'){
            /*
            https://tinypng.com/developers/reference/nodejs
            https://github.com/tinify/tinify-nodejs
            Example:
            base:
            {jpg: {engine: 'tinify', key: "api_key", command: false}}

            {jpg: {engine: 'tinify', key: "api_key", command: ['copyright', 'creation', 'location']}}
            Можно запускать без опций, но существуют опции которые оставляют метаданные в изображении, 
            такие как авторство, время создания изображения и локаль, но тесты показали 
            что эта функция возможно не работает.
            */       
                if(option.statistic){
                    if(false != enginejpg.jpg.command){
                      console.log(colors.red("Commands with [thinify] dont working with turn on statistic - 'statistic: true'! You can will turn off statistic 'statistic: false' and use commands for [tinify]. Or you can will set 'command: false' for [tinify]."));
                    }   
                    //-------------------------------------------------
                    fs.readFile(input, function(err, sourceData) {
                        if(err === null){ 
                            //--------------------------------------
                            if (err){
                              throw err;
                            } 
                            tinifyjpeg.fromBuffer(sourceData).toBuffer(function(err, resultData) {
                              if (err){
                                throw err;
                              }
                              fs.writeFile(output, resultData, function(err) {
                                  if(err) {
                                      return console.log(err);
                                  }
                                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                                  //Block statistic
                                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                                  //Узнаем размер файла после сжатия
                                  size_output = getFilesizeInBytes(output);
                                      
                                  //Находим на сколько процентов удалось сжать файл
                                  percent = size_output / size_in;
                                  percent = percent * 100;
                                  percent = 100 - percent;
                                  percent = Math.round(percent * 100) / 100;

                                  return callback(size_in, size_output, percent, null); 
                                  //- - - - - - - - - - - - -  - - - - - - - - - - -  
                              }); 
                            });
                            //--------------------------------------
                        }else{
                            return callback(0, 0, 0, err);
                        }                            
                    }); 
                    //-------------------------------------------------                                 
                }else{
                    var array;
                    if(false != enginejpg.jpg.command){
                      if(enginejpg.jpg.command.length === 1){

                        var source = tinifyjpeg.fromFile(input);
                        var copyrighted = source.preserve(enginejpg.jpg.command[0]);
                        copyrighted.toFile(output); 
                      }else if(enginejpg.jpg.command.length === 2){

                        var source = tinifyjpeg.fromFile(input);
                        var copyrighted = source.preserve(enginejpg.jpg.command[0], enginejpg.jpg.command[1]);
                        copyrighted.toFile(output); 
                      }else if(enginejpg.jpg.command.length === 3){

                        var source = tinifyjpeg.fromFile(input);
                        var copyrighted = source.preserve(enginejpg.jpg.command[0], enginejpg.jpg.command[1], enginejpg.jpg.command[2]);
                        copyrighted.toFile(output); 
                      }         
                    }else{
                      tinifyjpeg.fromFile(input).toFile(output);
                    }
                }
  

      }else{
        console.log(colors.red("Don't [jpg] find ["+enginejpg.jpg.engine+"] engine!"));
      }
    }








    //Сжатие PNG
    function CompressionFilePng(input, output, callback){
      var size_in, size_output, percent; 
      
      if(option.statistic){
        //Block statistic
        //- - - - - - - - - - - - -  - - - - - - - - - - -      
        //Размер файла пред  сжатием       
        size_in = getFilesizeInBytes(input);
        //- - - - - - - - - - - - -  - - - - - - - - - - -   
      }

      if(enginepng.png.engine == 'pngquant'){
        /*
        --quality=0-20 - min and max are numbers in range 0 (worst) to 100 (perfect), similar to JPEG.
        Sites:
        https://pngquant.org
        https://github.com/imagemin/pngquant-bin

        Example: 
        base:
        ['-o', output, input]
        */
        var array;
        if(false != enginepng.png.command){
          if(enginepng.png.command.includes('-o')){
            array = enginepng.png.command.concat([output, input]);
          }else{
            array = enginepng.png.command.concat([input]);
          }            
        }else{
          array = ['-o', output, input];
        }

        execFile(pngquant, array, function (err) {
            if(err === null){           
                if(option.statistic){
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null);  
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
              return callback(null, null, null, err);
            }
          return callback(null, null, null, null);              
        }); 
      }else if(enginepng.png.engine == 'optipng'){
        /*
        Sites:
        http://optipng.sourceforge.net
        https://github.com/imagemin/optipng-bin
        
        Example: 
        base:
        ['-o', output, input]
        */
        var array;
        if(false != enginepng.png.command){
          array = enginepng.png.command.concat(['-out', output, input]);  
        }else{
          array = ['-out', output, input];
        }

        execFile(optipng, array, function (err) {
            if(err === null){           
                if(option.statistic){
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null);  
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
                return callback(null, null, null, err);
            }
          return callback(null, null, null, null);                            
        }); 
      }else if(enginepng.png.engine == 'webp'){
        /*
        Основная команда:
        '-o' - указывает файл для вывода

        Дополнительные команды (некоторые, остальные ниже в ссылках):
        -q - from 0 to 100. The default is 75.

        Документация - как использовать
        https://developers.google.com/speed/webp/docs/using
        //Команды
        https://developers.google.com/speed/webp/docs/cwebp

        Example
        'input.jpg', '-o', 'output.webp'
        command: ['-o'] -- базовый массив с базовой командой

        -q 1 'input.jpg', '-o', 'output.webp'
        command: ['-o', '-q', '1']
        */

        var array;
        if(false != enginepng.png.command){
          array = enginepng.png.command.concat(input, ['-o'], output);
        }else{
          array = [input, '-o', output];
        }  
        
        execFile(cwebp, array, function (err) {
            if(err === null){           
                if(option.statistic){
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null); 
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
                return callback(null, null, null, err);
            }
          return callback(null, null, null, null);                               
        }); 
      }else if(enginepng.png.engine == 'pngout'){
        /*
        Sites:
        http://advsys.net/ken/util/pngout.htm
        https://github.com/imagemin/pngout-bin
        
        Example: 
        base:
        ['input.png', 'output.png']
        ['input.png', 'output.png', '-s0', '-k0', '-f0']
        */
        var array;
        if(false != enginepng.png.command){
          array = [input, output].concat(enginepng.png.command);  
        }else{
          array = [input, output];
        }
        
        execFile(pngout, array, function (err) {
            if(err === null){           
                if(option.statistic){
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null);  
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
                return callback(null, null, null, err);
            }
          return callback(null, null, null, null);                              
        }); 
      }else if(enginepng.png.engine == 'pngcrush'){
        /*
        Sites:
        https://pmt.sourceforge.io/pngcrush
        https://github.com/imagemin/pngcrush-bin

        Example: 
        base:
        ['input.png', 'output.png']
        ['-reduce', '-brute', 'input.png', 'output.png']
        */
        var array;
        if(false != enginepng.png.command){
          array = enginepng.png.command.concat([input, output]);  
        }else{
          array = [input, output];
        }
        
        execFile(pngcrush, array, function (err) {
            if(err === null){           
                if(option.statistic){
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null);  
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
                return callback(null, null, null, err);
            } 
          return callback(null, null, null, null);                              
        }); 
      }else if(enginepng.png.engine == 'tinify'){
              /*
              https://tinypng.com/developers/reference/nodejs
              https://github.com/tinify/tinify-nodejs
              Example:
              base:
              {png: {engine: 'tinify', key: "api_key", command: false}}

              {png: {engine: 'tinify', key: "api_key", command: ['copyright', 'creation', 'location']}}
              Можно запускать без опций, но существуют опции которые оставляют метаданные в изображении, 
              такие как авторство, время создания изображения и локаль, но тесты показали 
              что эта функция возможно не работает.
              */
                       
              if(option.statistic){
                  if(false != enginepng.png.command){
                    console.log(colors.red("Commands with [thinify] dont working with turn on statistic - 'statistic: true'! You can will turn off statistic 'statistic: false' and use commands for [tinify]. Or you can will set 'command: false' for [tinify]."));
                  }   
                  //-------------------------------------------------
                  fs.readFile(input, function(err, sourceData) {
                        if(err === null){ 
                              if (err){
                                throw err;
                              } 
                              tinifypng.fromBuffer(sourceData).toBuffer(function(err, resultData) {
                                if (err){
                                  throw err;
                                }
                                fs.writeFile(output, resultData, function(err) {
                                    if(err) {
                                        return console.log(err);
                                    }
                                    //- - - - - - - - - - - - -  - - - - - - - - - - -
                                    //Block statistic
                                    //- - - - - - - - - - - - -  - - - - - - - - - - -
                                    //Узнаем размер файла после сжатия
                                    size_output = getFilesizeInBytes(output);
                                        
                                    //Находим на сколько процентов удалось сжать файл
                                    percent = size_output / size_in;
                                    percent = percent * 100;
                                    percent = 100 - percent;
                                    percent = Math.round(percent * 100) / 100;

                                    return callback(size_in, size_output, percent, null); 
                                    //- - - - - - - - - - - - -  - - - - - - - - - - -  
                                }); 
                              });
                        }else{
                            return callback(null, null, null, err);
                        }                           
                }); 
                //-------------------------------------------------                                       
              }else{
                  var array;
                  if(false != enginepng.png.command){
                    if(enginepng.png.command.length === 1){

                      var source = tinifypng.fromFile(input);
                      var copyrighted = source.preserve(enginepng.png.command[0]);
                      copyrighted.toFile(output); 
                    }else if(enginepng.png.command.length === 2){

                      var source = tinifypng.fromFile(input);
                      var copyrighted = source.preserve(enginepng.png.command[0], enginepng.png.command[1]);
                      copyrighted.toFile(output); 
                    }else if(enginepng.png.command.length === 3){

                      var source = tinifypng.fromFile(input);
                      var copyrighted = source.preserve(enginepng.png.command[0], enginepng.png.command[1], enginepng.png.command[2]);
                      copyrighted.toFile(output); 
                    }         
                  }else{
                    tinifypng.fromFile(input).toFile(output);
                  }
              }

 
          
      }else{
        console.log(colors.red("Don't [png] find ["+enginepng.png.engine+"] engine!"));
      }
    }









    //Сжатие SVG
    function CompressionFileSvg(input, output, callback){
      var size_in, size_output, percent; 
      
      if(option.statistic){
        //Block statistic
        //- - - - - - - - - - - - -  - - - - - - - - - - -      
        //Размер файла пред  сжатием       
        size_in = getFilesizeInBytes(input);
        //- - - - - - - - - - - - -  - - - - - - - - - - -   
      }

      if(enginesvg.svg.engine == 'svgo'){
        /*
        Sites:
        https://www.npmjs.com/package/svgo
        https://github.com/svg/svgo/blob/master/README.ru.md

        Example: 
        base:
        {svg: {engine: 'svgo', command: false}}
        {svg: {engine: 'svgo', command: '--multipass'}}
        */
        let com;
        if(false != enginesvg.svg.command){
          //com = "svgo "+enginesvg.svg.command+" -i "+input+" -o "+output;  
          com = enginesvg.svg.command+" -i "+input+" -o "+output; 
        }else{
          //com = "svgo -i "+input+" -o "+output;
          com = "-i "+input+" -o "+output;
        }

        com = 'node "' + path.resolve(__dirname + "/../svgo/bin/") + "/svgo" + '" ' + com;

        exec(com, (error, stdout, stderr) => {
            if(error === null){
                if(option.statistic){
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null);  
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
                return callback(null, null, null, error);
            } 
          return callback(null, null, null, null);                               
        });
      }else{
        console.log(colors.red("Don't [svg] find ["+enginesvg.svg.engine+"] engine!"));
      }
    }









    //Сжатие GIF
    function CompressionFileGif(input, output, callback){
      var size_in, size_output, percent; 
      
      if(option.statistic){
        //Block statistic
        //- - - - - - - - - - - - -  - - - - - - - - - - -      
        //Размер файла пред  сжатием       
        size_in = getFilesizeInBytes(input);
        //- - - - - - - - - - - - -  - - - - - - - - - - -   
      }

      if(enginegif.gif.engine == 'gifsicle'){
        /*
        [--colors 16] [--colors 64]- (значительно уменьшает размер изображения путём уменьшения цветов) 
        [--use-col=web] - значительно уменьшает изображение 
        [--optimize] - оптизизация без потерь  
        [--scale 0.8] - уменьшение размера

        Sites:
        https://github.com/kohler/gifsicle
        https://www.npmjs.com/package/gifsicle
        //Commands
        https://www.lcdf.org/gifsicle/man.html


        Example: 
        base:
        */
        var array;
        if(false != enginegif.gif.command){
          array = enginegif.gif.command.concat(['-o', output, input]);  
        }else{
          array = ['-o', output, input];
        }

        execFile(gifsicle, array, function (err) {
            if(err === null){
                if(option.statistic){
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null);  
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
                return callback(null, null, null, err);
            } 
          return callback(null, null, null, null);                              
        }); 
      }else if(enginegif.gif.engine == 'giflossy'){
        /*
        [--lossy=80] - процент сжатия, если не ошибаюсь

        Sites:
        https://github.com/pornel/giflossy
        https://kornel.ski/lossygif
        https://www.npmjs.com/package/giflossy

        Примечание: доступно для Linux x64 и Mac OS X
        */
        var array;
        if(false != enginegif.gif.command){
          array = enginegif.gif.command.concat(['-o', output, input]);  
        }else{
          array = ['-o', output, input];
        }
        
        execFile(giflossy, array, function (err) {
            if(err === null){          
                if(option.statistic){
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null);  
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
                return callback(null, null, null, err);
            }  
          return callback(null, null, null, null);                              
        }); 
      }else if(enginegif.gif.engine == 'gif2webp'){
        /*
        Base:
        gif2webp [options] input_file.gif -o output_file.webp

        Sites:
        https://developers.google.com/speed/webp/docs/gif2webp
        //Download
        https://developers.google.com/speed/webp/download
        */
        var array;
        if(false != enginegif.gif.command){
          array = enginegif.gif.command.concat([input, '-o', output]);  
        }else{
          array = [input, '-o', output];
        }
        
        execFile(path_gif2webp, array, {cwd: process.cwd()},  function (err) {
            if(err === null){                
                if(option.statistic){
                  //Block statistic
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                  //Узнаем размер файла после сжатия
                  size_output = getFilesizeInBytes(output);
                  
                  //Находим на сколько процентов удалось сжать файл
                  percent = size_output / size_in;
                  percent = percent * 100;
                  percent = 100 - percent;
                  percent = Math.round(percent * 100) / 100;

                  return callback(size_in, size_output, percent, null);  
                  //- - - - - - - - - - - - -  - - - - - - - - - - -
                }
            }else{
                return callback(null, null, null, err);
            } 
          return callback(null, null, null, null);                                
        });
      }else{
        console.log(colors.red("Don't [gif] find ["+enginegif.gif.engine+"] engine!"));
      }
    }


























    function writeLogError(text_err, input, path_out_new, engine){

        let str_error = 'File from: ['+input+']';
        str_error = str_error+'\r\n';
        str_error = str_error+'\r\nFile to: ['+path_out_new+']';
        str_error = str_error+'\r\n';
        str_error = str_error+'\r\nCompression algorithm: ['+engine+']';
        str_error = str_error+'\r\n';
        str_error = str_error+'\r\nDescription: '+text_err;

        checkDir(option.pathLog, function(err, made) {
            if(err){
                console.log(colors.red('-----------------------------------'));
                console.log(colors.red('An error occurred!'));
                console.error(err)
                console.log(colors.red('-----------------------------------'));
                return callback(true);
            }else{
                let datetime = new Date();
                datetime = datetime.getFullYear()+'-'+datetime.getMonth()+'-'+datetime.getDate()+' '+datetime.getHours()+'.'+datetime.getMinutes()+'.'+datetime.getSeconds()+' ('+datetime.getMilliseconds()+')';

                fs.appendFile(option.pathLog+'/'+datetime+'.txt', str_error, function (err) {
                    if (err) throw err;
                     //console.log('Log saved!');
                }); 
            }
        });                  
    }





    //Проверка на наличие файла
    function checkFile(path){
        if (fs.existsSync(path)) {
            return true;
        }else{
            return false;
        } 
    }


    //Проверка наличие директории
    function checkDir(output, callback){
      mkdirp(output, function(err, made) {
          if(err){
            callback(err, made);
          }else{
            callback(err, made);
          }
      });
    }


    function getFilesizeInBytes(filename) {
        filename = fs.statSync(filename)
        return filename["size"];
    }


    //Вывод логов о создании новой директории
    function log_create_wasdir(output){
        console.log(colors.bgYellow(colors.yellow(' New directory was created: ')+colors.yellow(output)+'  '));
        console.log(colors.bgYellow(colors.white(' New directory was created: ')+colors.magenta(output)+'  '));
        console.log(colors.bgYellow(colors.yellow(' New directory was created: ')+colors.yellow(output)+'  '));          
    }



    //Получение имени директории
    function getPath(path){
      path = path.match(/(^.*[\\\/]|^[^\\\/].*)/i);
        if(path != null){
          return path[0];
        }else{
          return false;
        }            
    }


    function cheopJpegoptim(array){
      for (var i = array.length; i >= 0; i--) {
          if('-d' == array[i]){
              return true;
          }
      }   
      return false; 
    }


    //Get extention from file
    function getExtensionFile(path){
      return path.match(/[a-zA-Z]+$/i);
    }


    function checkUpdate(){
        if(lock__length_files !== true){
          length_files = length_files - 1;
        }

        //if(length_files === 0 && lock__length_files !== true){
            //updater(fs, colors, option.autoupdate);
            //callback(null);
        //}    
    }





    function outputResult(input, path_out_new, engine, size_in, size_output, percent, err, callback){
      if(err === null && option.statistic === true){
          console.log('-----------------------------------');
          console.log(' File from: '+colors.magenta(input)+'');
          console.log(' File to: '+colors.magenta(path_out_new)+'');
          console.log(' Compression algorithm: '+colors.green('['+engine+']'));              

          if(percent >= 0){
            console.log(' Original size: '+colors.green('['+bytes(size_in)+']')+' | Compressed size: '+colors.green('['+bytes(size_output)+']')+' | Compression rate: '+colors.green('['+percent+'%]'));
          }else{
            percent = Math.abs(percent);
            console.log(colors.red(' [Alert] File size has increased!!!'));
            console.log(' Original size: '+colors.green('['+bytes(size_in)+']')+' | Compressed size: '+colors.green('['+bytes(size_output)+']')+' | Compression rate: '+colors.green('[')+colors.yellow('+')+colors.green(percent+'%]'));
          }
          console.log('-----------------------------------'); 
      }else if(err !== null){
          console.log('-----------------------------------'); 
          console.log(' File from: '+colors.magenta(input)+'');
          console.log(' File to: '+colors.magenta(path_out_new)+'');
          console.log(' Compression algorithm: '+colors.green('['+engine+']'));

          console.log(err); 
          writeLogError(err, input, path_out_new, engine);

          console.log(colors.red(' [Error] Your file was not compressed!!!'));  
          console.log(colors.green(' [Error] You can see log to:' + option.pathLog)); 
          console.log('-----------------------------------');             
      }

      //Провееряем обновление
      checkUpdate();

      if(err !== null){
        var dataError = {};
        if(length_files === 0){
          dataError.engine = engine;
          dataError.input = input;
          dataError.output = getPathOut(path_out_new);
          return callback(dataError, true);
        }else{
          dataError.engine = engine;
          dataError.input = input;
          dataError.output = getPathOut(path_out_new);
          return callback(dataError, false);
        }
      }

      if(length_files === 0){
          return callback(null, true);
      }

      return callback(null, false);
    }



    function getPathOut(path){
        path = path.match(/(^.*[\\\/]|^[^\\\/].*)/i);
        if(path != null){
          return path[0];
        }else{
          return false;
        }            
    }


    function checkExistsModule(name, install_package){
        try {
            require.resolve(name);
            return true;
        } catch(e) {
            console.log("--------------------");
            console.log(colors.red("You must install additional module ["+install_package+"]!"));
            console.log("It does not work properly on some OS! If you will get an error try use other module.");
            console.log("--------------------");
            process.exit(e.code);
        }           
    }


}
module.exports = index;
