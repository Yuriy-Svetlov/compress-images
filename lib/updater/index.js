'use strict';

var index = function (fs, colors, autoupdate) {



var dir_base = __dirname, file_path;

file_path = dir_base+'/cache.json';





fs.readFile(file_path, 'utf8', (err, data) => {
	if (err){ 
		  	throw err;
	}


	if(!isEmptyObject(data)){
		let datajson = JSON.parse(data), microtime = Date.now(), update, notify, alert, lock = false;
		
		//Update
		if(datajson.update < microtime && datajson.update !== false){
			//Обновляем модуль
			if(true == autoupdate){
				lock = true;
				update = microtime + 259200000; //259200000 - one time in three days
				try {
				  	exec_command0();
				} catch (err) {
					console.error(err);
				}
			}else{
				update = datajson.update;
			}
		}else if(datajson.update >= microtime && datajson.update !== false){
			update = datajson.update;
		}else if(datajson.update === false){
			if(true == autoupdate){
				update = false;
				AlertUpdate();
			}	
		}

		//Notify
		if(datajson.notify < microtime){
			notify = microtime + 604800000; //259200000 - one time in three days
			lock = true;
			if(true == autoupdate){
				//thanks();
			}
		}else{
			notify = datajson.notify;
		}


		//Alert
		if(datajson.alert === false){
			alert = microtime + 604800000; 
			datajson.alert = alert;
		}

		if(datajson.alert < microtime){
			alert = microtime + 604800000; 
			lock = true;
			//Отправляем уведомление
			//alertM();
		}else{
			alert = datajson.alert;
		}





		if(lock){
			var obj = {
				"update": update,
				"notify": notify,
				"alert": alert
			};
			var json = JSON.stringify(obj);
			fs.writeFile(file_path, json, 'utf8', function(){
				
			}); 			
		}
	}else{
		//Write to file
		var obj = {
			"update": Date.now() + 604800000,
			"notify": Date.now() + 604800000,
			"alert": false
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
    console.log(colors.bgYellow('     ') + colors.magenta(' :') + ' Thank you so much for that you use this module npm «compress-images». '+colors.red('♥'));
    console.log(colors.bgYellow('     ') + colors.magenta(' :') + ' Help me please and support the project:');
    console.log(colors.bgCyan('     ') + colors.magenta(' :') + ' * ' + colors.cyan('PayPal') + ' - [https://www.paypal.com/myaccount/transfer/send]'); 
    console.log(colors.bgCyan('     ') + colors.magenta(' :') + '   Email - [startpascal1@mail.ru]');   
    console.log(colors.bgYellow('     ') + colors.magenta(' :') + ' * ' + colors.yellow('Visa Card') + ' - [4731 1856 1426 6432]'); 
    console.log(colors.bgYellow('     ') + colors.magenta(' :') + '   First name and Last name: [SEMINA TAMARA] or [SEMINA TAMARA PETROVNA]');  
    console.log(colors.bgCyan('     ') + colors.magenta(' :') + ' * ' + colors.yellow('Payeer') + ' - [payeer.com]  No.[P77135727]'); 
    console.log(colors.bgCyan('     ') + colors.magenta(' :') + ' * ' + colors.yellow('PaYoneer') + ' - [https://www.payoneer.com]'); 
    console.log(colors.bgYellow('     ') + colors.magenta(' :') + '   Email - [startpascal1@mail.ru]'); 
    console.log(colors.bgYellow('     ') + colors.magenta(' :.. ... ... ... ... ... ... ... ... ... ... ... ... ... ...'));
    console.log(colors.bgCyan('     ') + colors.magenta(' : .. ... ... ... ... ... ... ... ... ... ... ... ... ... ...'));
    console.log(colors.bgCyan('     ') + colors.magenta(' :') + ' If the module was you useful, put a star on ['+ colors.yellow('GitHub') + ']:');  
    console.log(colors.bgYellow('     ') + colors.magenta(' :') + ' [https://github.com/semiromid/compress-images]');  
    console.log(colors.bgYellow('     ') + colors.magenta(' :.. ... ... ... ... ... ... ... ... ... ... ... ... ... ...'));
    console.log(colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     '));
    console.log(colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     ') + colors.bgYellow('     ') + colors.bgCyan('     '));
  }

 


  function AlertUpdate(){
		console.log(colors.yellow(' ============================================'));
		console.log(colors.yellow(' ============================================'));
		console.log(colors.yellow(' ============================================'));								
		console.log(' Have to update module [compress-images]!');
		console.log(' Use: [npm install compress-images@latest --save-dev]');
		console.log(colors.yellow(' ============================================'));
		console.log(colors.yellow(' ============================================'));
		console.log(colors.yellow(' ============================================'));  	
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
                	if(keys[i] == 'compress-images'){
                		
                		if(obj[keys[i]].latest != obj[keys[i]].current){
							//---------------------------------------------------
							var obj = {
								    "update": false,
									"notify": Date.now() + 86400000
							};
							var json = JSON.stringify(obj);
							fs.writeFile(file_path, json, 'utf8', function(){
								AlertUpdate();
							});
							//---------------------------------------------------
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






	function alertM(){

		var platform = process.platform;
		var exec = require('child_process').exec;

		if(platform == 'win32'){

	    	exec('start cmd.exe /K node alert.js', {cwd: dir_base}, (error, stdout, stderr) => {

	    	});	
		}else if(platform == 'linux'){

	    	exec("gnome-terminal . -x sh -c 'node alert.js; exec bash'", {cwd: dir_base}, (error, stdout, stderr) => {

	    	});	
		}else if(platform == 'darwin'){ //Mac OS X


		}

	}





};


module.exports = index;