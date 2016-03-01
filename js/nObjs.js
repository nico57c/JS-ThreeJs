	
nTHREE.nObjs = function(nThree, name){
	
	this.name = name;
	this.nThree = nThree;
	this._ = {
		mat:{},
		geo:{}
	};
};

nTHREE.nObjs.prototype = {

	init: function(){
		console.log('Initialize scene without dev metarials (by default).');
		this.animations.parent = this; // must be set;
		this._.mat = this._dMat;
		return this;
	},
	
	_createCube: function(name,x,y,z){
		var result = new THREE.BoxGeometry(x, y, z);
		result.name = name;
		result.id = name;
		console.log('createCube: ' + name + '(' + x + ', ' + y + ', ' + z + ')');
		return result;
	},
	
	createCube: function(name, x, y, z){
		this._.geo[name] = this._createCube(name, x, y, z);
		return this;
	},

	createSphere: function(name, radius, wS, hS){
		this._.geo[name] = new THREE.SphereGeometry(radius, wS, hS);
		console.log('createSphere: ' + name + '(' + radius + ', ' + wS + ', ' + hS + ')');
		return this;
	},
	
	/*
	this.createGeoBasedOnVerticesAndFaces: function(name, v0, v1 ,v2, v3){
		
		this._.geo[name] = new THREE.Geometry(); 
		
		this._.geo[name].vertices.push(v0);
		this._.geo[name].vertices.push(v1);
		this._.geo[name].vertices.push(v2);
		this._.geo[name].vertices.push(v3);
		
		this._.geo[name].faces.push(new THREE.Face3(0, 1, 3));
		this._.geo[name].faces.push(new THREE.Face3(0, 2, 1));
		this._.geo[name].faces.push(new THREE.Face3(0, 3, 2));

		nThreeGlobals['defaultThree'].nThreeObjs['defaultObjs1']._.geo['testVertices'].faces.push(new THREE.Face3(1, 2, 7));
		nThreeGlobals['defaultThree'].nThreeObjs['defaultObjs1']._.geo['testVertices'].faces.push(new THREE.Face3(1, 5, 3));
		nThreeGlobals['defaultThree'].nThreeObjs['defaultObjs1']._.geo['testVertices'].faces.push(new THREE.Face3(1, 7, 5));

		nThreeGlobals['defaultThree'].nThreeObjs['defaultObjs1']._.geo['testVertices'].faces.push(new THREE.Face3(6, 2, 3));
		nThreeGlobals['defaultThree'].nThreeObjs['defaultObjs1']._.geo['testVertices'].faces.push(new THREE.Face3(6, 3, 5));
		nThreeGlobals['defaultThree'].nThreeObjs['defaultObjs1']._.geo['testVertices'].faces.push(new THREE.Face3(6, 7, 2));
		
		nThreeGlobals['defaultThree'].nThreeObjs['defaultObjs1']._.geo['testVertices'].faces.push(new THREE.Face3(4, 5, 7));
		nThreeGlobals['defaultThree'].nThreeObjs['defaultObjs1']._.geo['testVertices'].faces.push(new THREE.Face3(4, 6, 5));
		nThreeGlobals['defaultThree'].nThreeObjs['defaultObjs1']._.geo['testVertices'].faces.push(new THREE.Face3(4, 7, 6));
		
	},*/
	
	cloneFirstVerticesToMorphTargets: function(geoName,morphName){
		for ( var v = 0; v < this._.geo[geoName].vertices.length; v ++ ) {
			vertices.push( this._.geo[geoName].vertices[ v ].clone() );
		}
		this._.geo[geoName].morphTargets.push( { name: morphName, vertices: vertices } );
		return this;
	},
	
	cloneAllVerticesToMorphTargets: function(geoName, morphPosOp, fctPosOp) {
		
		if(undefined != morphPosOp && morphPosOp.op == 'sphere-scale'){
			this.cloneFirstVerticesToMorphTargets(geoName, 'target_0');
			return this;
		}
		
		for ( var i = 0; i < this._.geo[geoName].vertices.length; i ++ ) {
			var vertices = [];
			for ( var v = 0; v < this._.geo[geoName].vertices.length; v ++ ) {
				vertices.push( this._.geo[geoName].vertices[ v ].clone() );
				
				if ( v === i ) {
					
					if(undefined != fctPosOp){
						var result = fctPosOp.call(this,vertices[ vertices.length - 1 ].x,
						                                vertices[ vertices.length - 1 ].y,
						                                vertices[ vertices.length - 1 ].z,
						                                vertices[ vertices.length - 1 ],
						                                this._.geo[geoName]
												  );
						if(false !== result){
							vertices[ vertices.length - 1 ].x = result[0];
                            vertices[ vertices.length - 1 ].y = result[1];
                            vertices[ vertices.length - 1 ].z = result[2];
						}
					} else {
						switch(morphPosOp.op){
							default:
							case '*':
								if(false !== morphPosOp.x){ vertices[ vertices.length - 1 ].x *= morphPosOp.x; }
								if(false !== morphPosOp.y){ vertices[ vertices.length - 1 ].y *= morphPosOp.y; }
								if(false !== morphPosOp.z){ vertices[ vertices.length - 1 ].z *= morphPosOp.z; }
							break;
							case '-':
								if(false !== morphPosOp.x){ vertices[ vertices.length - 1 ].x -= morphPosOp.x; }
								if(false !== morphPosOp.y){ vertices[ vertices.length - 1 ].y -= morphPosOp.y; }
								if(false !== morphPosOp.z){ vertices[ vertices.length - 1 ].z -= morphPosOp.z; }
							break;
							case '+':
								if(false !== morphPosOp.x){ vertices[ vertices.length - 1 ].x -= morphPosOp.x; }
								if(false !== morphPosOp.y){ vertices[ vertices.length - 1 ].y -= morphPosOp.y; }
								if(false !== morphPosOp.z){ vertices[ vertices.length - 1 ].z -= morphPosOp.z; }
							break;
							case '/':
								if(false !== morphPosOp.x){ vertices[ vertices.length - 1 ].x /= morphPosOp.x; }
								if(false !== morphPosOp.y){ vertices[ vertices.length - 1 ].y /= morphPosOp.y; }
								if(false !== morphPosOp.z){ vertices[ vertices.length - 1 ].z /= morphPosOp.z; }
							break;
						}
					}
				}
			}
			this._.geo[geoName].morphTargets.push( { name: "target_" + i, vertices: vertices } );
		}
		return this;
	},
	
	
	resetGeo: function(){
		for(var index in this._.geo){
			this._.geo[index].dispose();
			delete(this._.geo[index]);
		}
		return this;
	},
	
	resetMat: function(){
		for(var index in this._.mat){
			this._.mat[index].dispose();
			delete(this._.mat[index]);
		}
		return this;
	},

	animations: new nTHREE.nAnimations(),
	_dMat: {
		default0: new THREE.MeshBasicMaterial({ color : 0xff0000, wireframe : true }),
		default1: new THREE.MeshBasicMaterial({ color : 0x00ff00, wireframe : true }),
		default2: new THREE.MeshBasicMaterial({ color : 0x0000ff, wireframe : true }),
		default3: new THREE.MeshBasicMaterial({ color : 0xffffff, wireframe : true }),
		defaultLambert0: new THREE.MeshLambertMaterial({ color: 0xff0000 }),
		defaultLambert1: new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
		defaultLambert2: new THREE.MeshLambertMaterial({ color: 0x0000ff }),
		defaultLambert3: new THREE.MeshLambertMaterial({ color: 0xffffff }),
		default0_morph: new THREE.MeshBasicMaterial({ color : 0xff0000, wireframe : true, morphTargets: true }),
		default1_morph: new THREE.MeshBasicMaterial({ color : 0x00ff00, wireframe : true, morphTargets: true }),
		default2_morph: new THREE.MeshBasicMaterial({ color : 0x0000ff, wireframe : true, morphTargets: true }),
		default3_morph: new THREE.MeshBasicMaterial({ color : 0xffffff, wireframe : true, morphTargets: true }),
		defaultLambert0_morph: new THREE.MeshLambertMaterial({ color: 0xff0000, morphTargets: true }),
		defaultLambert1_morph: new THREE.MeshLambertMaterial({ color: 0x00ff00, morphTargets: true }),
		defaultLambert2_morph: new THREE.MeshLambertMaterial({ color: 0x0000ff, morphTargets: true }),
		defaultLambert3_morph: new THREE.MeshLambertMaterial({ color: 0xffffff, morphTargets: true })
	}
};

