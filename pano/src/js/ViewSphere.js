// ViewSphere.js

import alfrid from './libs/alfrid.min.js';
var glslify = require("glslify");

let GL = alfrid.GL;

class ViewSphere extends alfrid.View {
	constructor() {
		super(glslify('../shaders/basic.vert'), glslify('../shaders/basic.frag'));
	}


	_init() {
		this.mesh = alfrid.Geom.sphere(5, 24, false, true);
	}


	render(texture) {
		this.shader.bind();
		this.shader.uniform("texture", "uniform1i", 0);
		texture.bind(0);
		GL.draw(this.mesh);
	}
}

export default ViewSphere;