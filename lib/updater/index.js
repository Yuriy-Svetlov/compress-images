'use strict';

var index = function (fs, colors, autoupdate) {



var dir_base = __dirname, file_path;

file_path = dir_base+'/cache.json';





fs.readFile(file_path, 'utf8', (err, data) => {
	if (err){ 
		  	throw err;
	}


	if(!isEmptyObject(data)){
		let datajson = JSON.parse(data), microtime = Date.now(), update, notify, lock = false;
		
		if(datajson.update < microtime){
			update = microtime + 259200000; //259200000 - one time in three days
			lock = true;

			//Обновляем модуль
			if(true == autoupdate){
				try {
				  	exec_command0();
				} catch (err) {
					console.error(err);
				}
			}
		}else{
			update = datajson.update;
		}

		if(datajson.notify < microtime){
			notify = microtime + 259200000; //259200000 - one time in three days
			lock = true;
			//Выводим сообщение об возможности отблагодарить автора
			thanks();
		}else{
			notify = datajson.notify;
		}

		if(lock){
			var obj = {
				"update": update,
				"notify": notify
			};
			var json = JSON.stringify(obj);
			fs.writeFile(file_path, json, 'utf8', function(){
				
			}); 			
		}
	}else{
		//Write to file
		var obj = {
			"update": Date.now() + 259200000,
			"notify": Date.now() + 259200000
		};
		var json = JSON.stringify(obj);
		fs.writeFile(file_path, json, 'utf8', function(){
				
		}); 		
	}
});	




function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}





function thanks(){
	console.log(colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     '));	
	console.log(colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     '));
	console.log(colors.bgCyan('     ') + colors.magenta(' ... ... ... ... ... ... ... ... ... ... ... ... ... ... ...'));	
	console.log(colors.bgCyan('     ') + colors.magenta(' :'));	
	console.log(colors.bgYellow('     ') + colors.magenta(' :') + ' Thank you so much for that you use this module npm «compress-image». '+colors.red('♥'));
	console.log(colors.bgYellow('     ') + colors.magenta(' :') + ' Help me please and support the project:');
	console.log(colors.bgCyan('     ') + colors.magenta(' :') + ' * ' + colors.cyan('PayPal') + ' - [https://www.paypal.com/myaccount/transfer/send]');	
	console.log(colors.bgCyan('     ') + colors.magenta(' :') + '   Email - [startpascal1@mail.ru]');		
	console.log(colors.bgYellow('     ') + colors.magenta(' :') + ' * ' + colors.yellow('Visa Card') + ' - [4731 1856 1426 6432]');	
	console.log(colors.bgYellow('     ') + colors.magenta(' :') + '   First name and Last name: [SEMINA TAMARA] or [SEMINA TAMARA PETROVNA]');	
	console.log(colors.bgCyan('     ') + colors.magenta(' :') + ' * ' + colors.yellow('Payeer') + ' - [payeer.com]  No.[P77135727]');	
	console.log(colors.bgCyan('     ') + colors.magenta(' :') + ' * ' + colors.yellow('PaYoneer') + ' - [https://www.payoneer.com]');	
	console.log(colors.bgYellow('     ') + colors.magenta(' :') + '   Email - [startpascal1@mail.ru]');	
	console.log(colors.bgYellow('     ') + colors.magenta(' :.. ... ... ... ... ... ... ... ... ... ... ... ... ... ...'));
	console.log(colors.bgCyan('     ') + ' ');	
	console.log(colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     '));
	console.log(colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     '));
}

 







function exec_command0() {

	const exec = require("child_process").exec;

    exec('npm outdated -json --long', (error, stdout, stderr) => {
        if (error !== null) {
            console.log(`exec error 1 : ${error}`);
        } else {
            if (stdout != "") {
                var obj = JSON.parse(stdout), keys;
                keys = Object.keys(obj);
                //------------------------------------------------------------------
                for (var i = 0 ; keys.length > i ; i++) {
                	console.log(obj[keys[i]].latest);
                	if(keys[i] == 'compress-image'){
                		if(obj[keys[i]].latest != obj[keys[i]].current){
                			//Обновляем
    						if (obj[keys[i]].type == 'devDependencies') {
							    exec('npm install compress-image@latest --save-dev', (error, stdout, stderr) => {
							        if (error !== null) {
							            console.log(`exec error: ${error}`);
							        }
							    });
    						}else{
							    exec('npm install compress-image@latest --save', (error, stdout, stderr) => {
							        if (error !== null) {
							            console.log(`exec error: ${error}`);
							        }
							    });
    						}                			
                		}
                	}
                }
                //------------------------------------------------------------------
            } else {
                console.log(colors.cyan('Completed!'));
            }
        }
    });
}












};


module.exports = index;