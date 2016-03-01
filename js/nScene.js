nTHREE.nScene = function(nThree, name){
	this.name = name;
	this.nThree = nThree;
	
	this._ = {
		anims: {},
		meshes: {},
		lights: {},
		cameras: {},
		controls: {},
		scene: null
	};
	
	// All of your custom data
	this.data = {};
};

nTHREE.nScene.prototype = {
	
	init: function(){
		this._.scene = new THREE.Scene(this.name);
		this._.scene.id = this.name;
		this._.scene.name = this.name;
		this.animations.parent = this; // must be set.
		console.log('Create scene(' + this.name + ')');
		return this;
	},
	
	_attachMeshes: function(scene, meshes){
		for(var index in meshes){
			scene.add( meshes[index] );
			console.log('Attach meshes to ::scene/' + scene.name + ', ::meshes/' + index + '.');
		}
		return scene;
	},
	
	attachMeshes: function(){
		this._attachMeshes(this._.scene, this._.meshes);
		return this;
	},
	
	attachLights: function(){
		for(var index in this._.lights){
			this._.scene.add( this._.lights[index] );
			console.log('Attach lights to ::scene/' + this.name + ', ::light/' + index + '.');
		}
		return this;
	},
	
	attachAnims: function() {
		for(var index in this._.anims){
			this._.anims[index].attachMeshes(this._.scene);
		}
		return this;
	},
	
	setAnim: function(animObj){
		this._.anims[animObj.id] = animObj;
	},
	
	setAnims: function(rObjs, ids){
		if(undefined == ids){
			for(var index in this.nThree._.objs[rObjs]._.anims){
				this._.anmis[index] = this.nThree._.objs[rObjs]._.anims[index];
			}
		} else {
			for(var id in ids){
				this._.anmis[id] = this.nThree._.objs[rObjs]._.anims[id];
			}
		}
		return this;
	},
	
	reset: function(){
		while(this._.scene.children.length>0){
			this._.scene.remove( this._.scene.children[0] );
		}
		return this;
	},
	
	resetMeshes: function(){
		for(var index in this._.meshes){
			this._.scene.remove( this._.meshes[index] );
		}
		return this;
	},
	
	resetLights: function(){
		for(var index in this._.lights){
			this._.scene.remove( this._.lights[index] );
		}
		return this;
	},
	
	detachMeshRef: function(rMesh){
		THREE.SceneUtils.detach(this._.meshes[rMesh], this._.meshes[rMesh].parent, this._.scene);
		return this;
	},
	
	detachMeshes: function(threeObjsName){
		for(var rMesh in this._.meshes){
			for(var indexC in this._.meshes[rMesh].children){
				THREE.SceneUtils.detach(this._.meshes[rMesh].children[indexC], this._.meshes[rMesh], this._.scene);
			}
			THREE.SceneUtils.detach(this._.meshes[rMesh], this._.meshes[rMesh].parent, this._.scene);
		}
		return this;		
	},
	
	createCamera: function(name, type, lookAt){
		lookAt = (undefined==lookAt?{x:0,y:0,z:0}:lookAt);
		switch(type){
			default:
			case 'default':
				this._.cameras[name] = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
				this._.cameras[name].position.set(0, 0, 1000);
				this._.cameras[name].lookAt(new THREE.Vector3( lookAt.x, lookAt.y, lookAt.z ));
				console.log('set-PerspectiveCamera ::camera/' + name);
			break;
			case 'ortho':
				this._.cameras[name] = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
				console.log('set-OrthographicCamera ::camera/' + name);
			break;
		}
		return this;
	},
	
	_linkMeshes: function(parentMesh, childrenMesh){
		for(var index in childrenMesh){
			
			if(undefined == childrenMesh[index].userData){
				childrenMesh[index].userData = {};
			}
			childrenMesh[index].userData['parent'] = parentMesh;
			
			if(childrenMesh[index] instanceof THREE.Object3D){
				parentMesh.add(childrenMesh[index]);
				
				console.log('Link Mesh(' + parentMesh.id + ') to ' + childrenMesh[index].id);
			} else {
				if(undefined == parentMesh.userData['children']){
					parentMesh.userData['children'] = [];
				}
				parentMesh.userData['children'].push(childrenMesh[index]);
				console.log('Link Mesh(' + parentMesh.id + ') to ' + childrenMesh[index].id);
			}
		}
		
		return parentMesh;
	},
	
	linkMeshes: function(parentMesh, childrenMesh){
		this._linkMeshes(parentMesh, childrenMesh);
		return this;
	},
	
	linkMeshesRefs: function(rParentMesh, rChildrenMesh){
		for(var index in rChildrenMesh){
			this._.meshes[rParentMesh].add(this._.meshes[rChildrenMesh[index]]);
		}
		return this;
	},
	
	_createMesh: function(name,geo,mat){
		if(undefined == mat){
			mat = nTHREE.nObjs.prototype._dMat.default3;
		}
		var result = new THREE.Mesh(geo, mat);
		result.id = name;
		result.name = name;
		console.log('createMesh: ' + name + '.');
		return result;
	},
	
	createMesh: function(name, geo, mat){
		this._.meshes[name] = this._createMesh(name, geo, mat); 
		return this;
	},
	
	createMeshRefs: function(name, rObjs, rGeo, rMat){
		rGeo = (undefined==rGeo?name:rGeo);
		rMat = (undefined==rMat?'default0':rMat);
		
		this._.meshes[name] = new THREE.Mesh(this.nThree._.objs[rObjs]._.geo[rGeo], this.nThree._.objs[rObjs]._.mat[rMat]);
		this._.meshes[name].id = name;
		
		console.log('CreateMesh: ' + name + ', ' + rObjs + '(' + rGeo + ',' + rMat + ')');
		return this;
	},
	
	createLightD: function(name, x, y, z, color, power, target) {
		this._.lights[name] = new THREE.DirectionalLight( color, power );
		this._.lights[name].position.set( x, y, z );
		if(undefined != target){
			this._.lights[name].target = target;
		}
		console.log('createLightD: ' + name + '(' + x + ', ' + y + ', ' + z + ')');
		return this;
	},
	
	createLightA: function(name, x, y, z, color) {
		this._.lights[name] = new THREE.AmbientLight(color);
		this._.lights[name].position.set( x, y, z );
		console.log('createLightA: ' + name + '(' + x + ', ' + y + ', ' + z + ')');
		return this;
	},
	
	createLightP: function(name, x, y, z, color) {
		this._.lights[name] = new THREE.PointLight(color);
		this._.lights[name].position.set( x, y, z );
		console.log('createLightP: ' + name + '(' + x + ', ' + y + ', ' + z + ')');
		return this;
	},
	
	getCamera: function(name){
		return this._.cameras[name];
	},
	
	setMeshesPos: function(positions){
		for(var name in this._.meshes){
			if(undefined != positions[name]){
				this._.meshes[name].position = new THREE.Vector3(positions[name].x, positions[name].y, positions[name].z);
			}
		}
		return this;
	},
	
	setControls: function(name, rCamera, domElement){
		switch(name){
			default:
			case 'orbit':
				this._.controls[name] = new THREE.OrbitControls(this._.cameras[rCamera], 
																(undefined==domElement?this.nThree._.renderer.domElement:domElement) );
			break;
		}
		return this;
	},
	
	animations: new nTHREE.nAnimations()
};

