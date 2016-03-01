mTHREE.loadingManager.default0 = function(id, parent){
	this.id = (undefined==id?'loadingManager_default0':id);
	this._ = Object.create(mTHREE.loadingManager.default0.prototype._);
	this._.parent = parent;
};


mTHREE.loadingManager.default0.prototype = Object.create(mTHREE.loadingManager._abstract);

mTHREE.loadingManager.default0.prototype.start = function(){
	console.log('Start loadingManager.');
	
	var nThree = this._.parent;
	nThree.createThreeScene('loadingManager').init();
	nThree._.scenes.loadingManager.createCamera('c', 'default');
	
	var spiralsP = {
			s1:{
				dir: 2,
				size: new THREE.Vector3(900,900,900),
				loopsW: 1,
				loopsL: 1,
				angle: 0
			},
			s2:{
				dir: 2,
				size: new THREE.Vector3(900,900,900),
				loopsW: 1,
				loopsL: 1,
				angle: Math.PI
			}
		};

	var cubesP = {
		s1:[	
			{ size: [100,100,100],
			  time: 60*5,
			  _r: {tX:0, tY:5, tZ:0},
			  mat: nTHREE.nObjs.prototype._dMat.default0
			},
			{ size: [50,50,50],
			  time: 60*5,
			  _r: {tX:5, tY:5, tZ:0},
			  mat: nTHREE.nObjs.prototype._dMat.default1 
			}
		],
		s2:[	
			{ size: [50,50,50],
			  time: 60*5,
			  _r: {tX:5, tY:5, tZ:0},
			  mat: nTHREE.nObjs.prototype._dMat.default1
			},
			{ size: [100,100,100],
			  time: 60*5,
			  _r: {tX:0, tY:10, tZ:0},
			  mat: nTHREE.nObjs.prototype._dMat.default0
			}
		],
	};
	
    // Set spiral animation :
	var spiralAnim = new mTHREE.anims.Spiral('loadingManager_anim', spiralsP, cubesP, false, false).init();
	spiralAnim.attachToScene(nThree._.scenes.loadingManager._.scene);
	spiralAnim.attachToAnim(nThree._.scenes.loadingManager.animations);
	 
	// Set loadingManager render :
	nThree.render.setToRenderRefs('loadingManager', 'loadingManager','c');
	nThree._.scenes.loadingManager.animations.start().playRecursiveAnimationFrame();
	this.renderIndex = nThree.render.start().renderRecursiveAnimationFrame();
	
	// Set LoadingManager HTML :
	var div = document.createElement('div');
	div.setAttribute('style','color:white;font-size:1.6rem;font-family:monospace;position:absolute;top:50%;left:50%;margin-top:-0.5rem;margin-left:-0.5rem');
	div.id = 'loadingManagerContent';
	div.innerHTML = '0%';
	document.getElementById('container').appendChild(div);
	
	// For stop function :
	this.parent = nThree;
	
	// Set onProgress function to defaultLoadingManager :
	this.setOnDefaultLoadingManager();
	return this;
};

mTHREE.loadingManager.default0.prototype.stop = function(){
	console.log('Stop loadingManager.');
	var elem = document.getElementById('loadingManagerContent');
	elem.parentNode.removeChild(elem);
	
	this.parent.render.stop(this.renderIndex).deleteRender('loadingManager');
	this.parent._.scenes.loadingManager.animations.stop();
	this.parent._.scenes.loadingManager.resetMeshes().resetLights().reset();
	delete(this.parent._.scenes.loadingManager);
	return this;
};

mTHREE.loadingManager.default0.prototype.onProgress = function(url,current,total){
	
	var loadingManagerElement = document.getElementById('loadingManagerContent');
	loadingManagerElement.innerHTML = Math.round((current/total)*100) + '%';
	
	mTHREE.loadingManager._abstract.onProgress.call(this,url,current,total);
};

