// SceneApp.js
import alfrid from './libs/alfrid.min.js';
import ViewSkybox from './ViewSkybox';
import ViewSphere from './ViewSphere';

var glslify = require("glslify");

let GL = alfrid.GL;

class SceneApp extends alfrid.Scene {
	constructor() {
		super();
		this.time = 0;
	}


	_initTextures() {
		this._texture = new alfrid.GLTexture(image);

		this.camera.setPerspective(90 * Math.PI/180, GL.aspectRatio, 0.1, 1000);
		this.orbitalControl.radius.value = 2.;

		this.cameraCube = new alfrid.CameraCube();
		this.orbitalControl.lockZoom(true);
		this.orbitalControl.inverseControl();
		
		this.fboSize = params.size;
		this._fbo = new alfrid.FrameBuffer(this.fboSize, this.fboSize);
	}


	setNewImage(data) {
		this._texture = new alfrid.GLTexture(data);
	}

	updateFboSize() {
		this.fboSize = params.size;
		console.debug('Update fbo size :', this.fboSize);
		this._fbo = new alfrid.FrameBuffer(this.fboSize, this.fboSize);
	}


	_saveImage(faceName) {
		let gl = GL.gl;
		var pixels = new Float32Array(4 * this.fboSize * this.fboSize);
		this._fbo.bind();
		GL.gl.readPixels(0, 0, this.fboSize, this.fboSize, gl.RGBA, gl.FLOAT, pixels);
		this._fbo.unbind();


		var canvas = document.createElement("canvas");
		canvas.width = this.fboSize;
		canvas.height = this.fboSize;
		var ctx = canvas.getContext('2d');
		var imgData = ctx.getImageData(0, 0, this.fboSize, this.fboSize);

		for(var i=0; i<imgData.data.length; i++) {
			imgData.data[i] = Math.floor(pixels[i] * 255);
		}

		ctx.putImageData(imgData, 0, 0);

		if(window.Ops) {
			window.Ops.saveCubeface(canvas, faceName);
		}
	}


	saveCubeImage() {
		const imgNames = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
		for(let i=0; i<6; i++) {
			this._fbo.bind();
			GL.clear();
			this.cameraCube.face(i);
			GL.setMatrices(this.cameraCube);
			this._vSphere.render(this._texture);
			this._fbo.unbind();

			this._saveImage(imgNames[i]);
		}
	}

	_initViews() {
		this._bCopy        = new alfrid.BatchCopy();
		this._vSkyBox      = new ViewSkybox();
		this._vSphere      = new ViewSphere();
	}


	render() {
		GL.clear(0, 0, 0, 0);
		this._vSphere.render(this._texture);
	}
}


export default SceneApp;