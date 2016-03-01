// Need nThreeInit.js > nThreeAbstract_*.js
nTHREE.nThree = function() {
	this.name = '_';
	this._ = {
		scenes: {},
		objs: {},
		renderer: null,
		rendererNodeId: null
	};
	
	// All of your custom data
	this.data = {
	};
};

nTHREE.nThree.prototype = {
	animations: new nTHREE.nAnimations(),
	render: new nTHREE.nRender()
};

nTHREE.nThree.prototype.init = function(name){
	this.render.parent = this;  // must be set.
	this.animations.parent = this; // must be set.
	this.name = (undefined==name?'_':name);
	nData[this.name].nThree = this;
	return this;
};

nTHREE.nThree.prototype.initRenderer = function(){
	this._.renderer = new THREE.WebGLRenderer();
	this._.renderer.setSize( window.innerWidth, window.innerHeight );
	return this;
};

nTHREE.nThree.prototype.appendRendererToNode = function(nodeId){
	this._.rendererNodeId = nodeId;
	document.getElementById(nodeId).appendChild(this._.renderer.domElement);
	return this;
};

nTHREE.nThree.prototype.createThreeObjs = function(name){
	this._.objs[name] = new nTHREE.nObjs(this, name);
	return this._.objs[name]; 
};

nTHREE.nThree.prototype.createThreeScene = function(name){
	this._.scenes[name] = new nTHREE.nScene(this, name);
	return this._.scenes[name]; 
};

nTHREE.nThree.prototype.getNObjs = function(name){
	return this._.objs[name];
};

nTHREE.nThree.prototype.getNScene = function(name){
	return this._.scenes[name];
};

nTHREE.nThree.prototype.getScene = function(name){
	return this._.scenes[name]._.scene;
};