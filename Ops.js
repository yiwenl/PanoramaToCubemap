// Ops.js
var fs           = require('fs');
var path         = require('path');
var remote       = require('remote'); 
var dialog       = remote.require('dialog'); 

var ipcRenderer  = require('electron').ipcRenderer;
var downloadPath = ipcRenderer.sendSync('synchronous-message', 'ping'); 

ipcRenderer.on('loadFile', function(event, arg) {
  	console.log('To load file : ', arg); // prints "pong"

  	fs.readFile(arg, function(err, data) {
  		window.loadNewFile(data);
  	});

});

var Ops = (function() {
	function saveCubeface(canvas, fileName) {
		console.debug('Saving cube face:', fileName, canvas);
		var data   = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, "");
		var buf    = new Buffer(data, 'base64');
		var name   = fileName + '.png';
		var output = path.join(downloadPath, name);
		// var output = path.join(process.cwd(), name);
		fs.access(output, fs.F_OK, function(err) {
			if (err) {
				fs.writeFile(output, buf, function(err) {
				    if (err) {
						return console.log(err);
				    }
				    console.log('Downloaded to : ', output);
			  	});
			} else {
			  console.log('Exists');
			  
			}
		});
	}


	function openFile() {
		console.log('Open File');
		ipcRenderer.send('openFile');


	}

	return {
		saveCubeface:saveCubeface,
		openFile:openFile
	}
})();



window.Ops = Ops;