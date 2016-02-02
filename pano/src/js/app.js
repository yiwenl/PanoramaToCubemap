import alfrid from './libs/alfrid.min.js';
import SceneApp from './SceneApp';
import dat from 'dat-gui';

var glslify = require("glslify");

window.alfrid = alfrid;
window.params = {
	size:512
};

let gui;
let scene;
let img = new Image();
img.addEventListener('load', ()=>_onImageLoaded());
img.src = './assets/pano.jpg';
window.image = img;


function _onImageLoaded() {
	console.log('Image Loaded');

	if(document.body) {
		_init();
	} else {
		window.addEventListener('load', ()=>_init());
	}
}


function _init() {
	//	CREATE CANVAS
	let canvas = document.createElement("canvas");
	canvas.className = 'Main-Canvas';
	document.body.appendChild(canvas);

	//	INIT GL TOOL
	alfrid.GL.init(canvas, {preserveDrawingBuffer: true} );

	//	INIT SCENE
	scene = new SceneApp();



	//	CONTROLS
	gui = new dat.GUI();
	gui.add(window, 'load');
	gui.add(window, 'save');
	gui.add(params, 'size', [ 32, 64, 128, 256, 512, 1024, 2048 ] ).onFinishChange(function() {
		scene.updateFboSize();
	});
}


function _loop() {
	GL.clear(0, 0, 0, 0);
	GL.setMatrices(camera);

	time += .02;
	shader.bind();
	shader.uniform('texture', 'uniform1i', 0);
	shader.uniform('time', 'uniform1f', time);
	texture.bind(0);

	batch.draw();
}



window.save = function() {
	scene.saveCubeImage();
}

window.load = function() {
	if(window.Ops) {
		window.Ops.openFile();
	}
}

window.loadNewFile = function(data) {
	let src = data.toString('base64');
	let img = new Image();
	img.src = `data:img/png;base64,${src}`;
	img.onload = function() {
		scene.setNewImage(this);
	}
}