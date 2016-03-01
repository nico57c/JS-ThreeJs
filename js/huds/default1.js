mTHREE.huds.default0 = function(id, idHtmlContainer) {
	
	this.id = id;
	
	this._ = Object.create(mTHREE.huds._abstract._);
	this._.html = '';
	
	document.getElementById(idHtmlContainer).appendChild(this._.html.container);
	
	this._.time.total = 60*10;
	this._.time.current = 0;
	this._['anims'] = {};
};

mTHREE.huds.default0.prototype = Object.create(mTHREE.huds._abstract);

mTHREE.huds.default0.prototype.init = function(){
	
    var geo = nTHREE.nObjs.prototype._createCube('test',100,100,20);
    var texture = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture('/js/huds/default0/health_icon1_1.png') });
    
	this._['icontest'] = nTHREE.nScene.prototype._createMesh('test', geo, texture);
	this._['rotateAnim'] = new mTHREE.anims.RotateLimitAngle('test', mesh, Math.PI/4, Math.PI/16, 0, 1, 100, 70);
	
	this._['rotateAnim'].attachToScene(nThree._.scenes.s._.scene);
	this._['rotateAnim'].attachToAnim(nThree._.scenes.s.animations);
	
	// Start anims
	this.startHudAnims();
	
	return this;
};

mTHREE.huds.default0.prototype.refreshHUD = function(){
	;
};

mTHREE.huds.default0.prototype.startHudAnims = function(){
	
};
