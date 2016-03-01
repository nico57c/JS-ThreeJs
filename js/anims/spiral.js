mTHREE.anims.Spiral = function(id, spiralsP, cubesP, parentOnOff, pathOnOff, pathC){
	
	mTHREE.anims._abstract.call(this);
	
	this.id = id;
	this._.anims = {};
	this._.meshes = {};
	this._.objs.geo = {};
	this._.objs.spiral = {};
	
	this._.objs.mat = {
		default0: nTHREE.nObjs.prototype._dMat.default0  // can be customized
	};
	
	this.spiralsP = spiralsP;
	this.cubesP = cubesP;
	this.parentOnOff = parentOnOff;
	this.pathOnOff = pathOnOff;
	
	if(undefined==pathC || null==pathC){
		pathC = {
			s: 200,
			r: 1,
			rs: 1
		};
	}
	
	this.pathC = pathC;
};

mTHREE.anims.Spiral.prototype = Object.create(mTHREE.anims._abstract.prototype);


// INIT :
mTHREE.anims.Spiral.prototype.init = function(){
	
	var defaultCenter = new THREE.Vector3(0, 0, 0);
	this._['parameters'] = {};
	
	// Parametres :
	for(var index in this.spiralsP){
		this._.parameters[index] = mTHREE.curves.Spiral.prototype.createParameters(
				(undefined==this.spiralsP[index].center?defaultCenter:this.spiralsP[index].center),
				this.spiralsP[index].size,
				this.spiralsP[index].dir,
				this.spiralsP[index].angle,
				this.spiralsP[index].loopsW,
				this.spiralsP[index].loopsL);
	}
	
	// Objets :
	var parentCube = nTHREE.nScene.prototype._createMesh(this.id + '_parentCube', 
			nTHREE.nObjs.prototype._createCube('parentCube',10,10,10)
		);
	parentCube.visible = (undefined==this.parentOnOff?false:(this.parentOnOff?true:false));
	this._.meshes['parentCube'] = parentCube;
	
    for(var indexSpiral in this._.parameters) {
        
        // SPIRAL :
    	var idSpiral = 'spiral_' + indexSpiral;
        this._.objs.spiral[idSpiral] = new mTHREE.curves.Spiral(this._.parameters[indexSpiral]);
        this._.objs.spiral[idSpiral].id = this.id + '_' + idSpiral;
        nTHREE.nScene.prototype._linkMeshes(parentCube,[this._.objs.spiral[idSpiral]]);
        
    	// CUBES :
        for(var indexCube in this.cubesP[indexSpiral]){
        	
        	var idCube = 'cube_' + indexSpiral + '-' + indexCube;
        	
            var cube = nTHREE.nObjs.prototype._createCube(this.id + '_' + idCube,
					  		this.cubesP[indexSpiral][indexCube].size[0],
					  		this.cubesP[indexSpiral][indexCube].size[1],
					  		this.cubesP[indexSpiral][indexCube].size[2]
            			);

            var cubeM = nTHREE.nScene.prototype._createMesh(this.id + '_' + idCube, cube, 
            				(undefined==this.cubesP[indexSpiral][indexCube].mat?this._.objs.mat.default0:this.cubesP[indexSpiral][indexCube].mat)
        				);
            
            this._.objs.geo[idCube] = cube;
            this._.meshes[idCube] = cubeM;
            
            nTHREE.nScene.prototype._linkMeshes(parentCube,[cubeM]);
            
            // Animation foreach cube :
            this._.anims[idCube] = {
            	name: this.id + idCube,
            	fct: this.animCube,
                c: this._.meshes[idCube],
            	p: {
            		total: this.cubesP[indexSpiral][indexCube].time, 
            		spiral: this._.objs.spiral[idSpiral],
            		current: null, // init loop 
            		_r: this.cubesP[indexSpiral][indexCube]._r,
            	}
            };
        }
        
        // PATH :
        if(true === this.pathOnOff){
        	var tube = new THREE.TubeGeometry(this._.objs.spiral[idSpiral], this.pathC.s, this.pathC.r, this.pathC.rs, false, false);
        	tube = nTHREE.nScene.prototype._createMesh(this.id + '_tube_' + idSpiral, tube);
        	
        	this._.meshes['tube_' + idSpiral] = tube;
        	nTHREE.nScene.prototype._linkMeshes(parentCube,[tube]);
        }
    }
    
    return this;
};

// MAKE DEFAULT :
mTHREE.anims.Spiral.prototype.makeDefault = function(id, parentOnOff, pathOnOff) {
	
	id = (undefined==id||null==id?'mTHREE.anims.Spiral':id);
	pathOnOff = (undefined==pathOnOff?false:pathOnOff);
	
	var spiralsP = {
		s1:{
			dir: 1,
			size: new THREE.Vector3(200,1000,200),
			loopsW: 10,
			loopsL: 10,
			angle: 0
		},
		s2:{
			dir: 1,
			size: new THREE.Vector3(100,1000,100),
			loopsW: 5,
			loopsL: 5,
			angle: Math.PI
		},
		s3:{
			dir: 1,
			size: new THREE.Vector3(50,1000,50),
			loopsW: 5,
			loopsL: 5,
			angle: Math.PI/2
		},
		s4:{
			dir: 1,
			size: new THREE.Vector3(50,1000,50),
			loopsW: 5,
			loopsL: 5,
			angle: (3/2)*Math.PI
		}
	};

	var cubesP = {
		s1:[	
			{ size: [100,100,100],
			  time: 30*9,
			  _r: {tX:1, tY:1, tZ:0},
			},
			{ size: [50,50,50],
			  time: 30*10,
			  _r: {tX:1, tY:1, tZ:0},
			}
		],
		s2:[	
			{ size: [50,50,50],
			  time: 30*5,
			  _r: {tX:1, tY:0, tZ:1},
			  spiral: 0
			},
			{ size: [20,20,20],
			  time: 30*7,
			  _r: {tX:1, tY:1, tZ:0},
			}
		],
		s3:[	
			{ size: [10,10,10],
			  time: 30*3,
			  _r: {tX:1, tY:0, tZ:1},
			  spiral: 0
			},
			{ size: [50,50,50],
			  time: 30*10,
			  _r: {tX:1, tY:1, tZ:0},
			}
		],
		s4:[	
			{ size: [10,10,10],
			  time: 30*3,
			  _r: {tX:1, tY:0, tZ:2},
			  spiral: 0
			},
			{ size: [50,50,50],
			  time: 30*10,
			  _r: {tX:1, tY:1, tZ:0},
			}
		],
	};
	
	return new mTHREE.anims.Spiral(id, spiralsP, cubesP, parentOnOff, pathOnOff);
};

// ANIMCUBE :
mTHREE.anims.Spiral.prototype.animCube = function(p){
	
    // Init :
    if(null === p.current){
        p.current = 0;
        p.ratioS = 1/p.total;
        p.ratioRX = (p._r.tX? ( ( p._r.tX * 2 * Math.PI ) / p.total) :false);
        p.ratioRY = (p._r.tY? ( ( p._r.tY * 2 * Math.PI ) / p.total) :false);
        p.ratioRZ = (p._r.tZ? ( ( p._r.tZ * 2 * Math.PI ) / p.total) :false);
        this.userData['px'] = this.position.x;
        this.userData['py'] = this.position.y;
        this.userData['pz'] = this.position.z;
    }
    
    // Animation :
    if(p.current < p.total){
        this.scale.x -= p.ratioS;
        this.scale.y -= p.ratioS;
        this.scale.z -= p.ratioS;
        
        if(p.ratioRX)
          this.rotateOnAxis( new THREE.Vector3( 1, 0, 0 ), p.ratioRX );
        if(p.ratioRY)
          this.rotateOnAxis( new THREE.Vector3( 0, 1, 0 ), p.ratioRY );
        if(p.ratioRZ)
          this.rotateOnAxis( new THREE.Vector3( 0, 0, 1 ), p.ratioRZ );
        
        //this.position = p.spiral.getPoint((p.total-p.current)/p.total);
        this.position = this.userData.parent.localToWorld(p.spiral.getPoint((p.total-p.current)/p.total));
        this.updateMatrixWorld();
        p.current++;
    } else {
        // End of animation :
        this.scale.x += 1;
        this.scale.y += 1;
        this.scale.z += 1;
        this.position = p.spiral.getPoint(1);
        this.updateMatrixWorld();
        p.current = 0;
    }
};

// SET POSITION
mTHREE.anims.Spiral.prototype.setPosition = function(x,y,z){
	var new_pos = new THREE.Vector3();
	new_pos.x = x;
	new_pos.y = y;
	new_pos.z = z;
	
	this._.meshes['parentCube'].position = new_pos;
	for(var index in this._.meshes){
		this._.meshes[index].position = this._.meshes['parentCube'].position;
	}
};

// SET DEFAULT MAT :
mTHREE.anims.Spiral.prototype.setDefaultMat = function(mat){
	this._.objs.mat.default0 = mat;
	return this;
};
