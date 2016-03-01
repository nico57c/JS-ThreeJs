mTHREE.anims.RotateLimitAngle = function(id, mesh, angleMaxRadian, angleMinRadian, angleStartRadian, axis, time1, time2){
	
	mTHREE.anims._abstract.call(this);
	
	this._.meshes[mesh.id] = mesh;
	
	this.id =  id;
    this._.anims[id] = {
    	'name': this.id,
    	'fct': this.animMesh,
        'c': this._.meshes[mesh.id],
    	'p': {
    		'current': null,
    		'total': time1 + time2,
    		'tMax': time1,
    		'tMin': time2 ,
    		'axis': axis, 
    		'angleMax': angleMaxRadian,
    		'angleMin': angleMinRadian,
    		'angleStart': angleStartRadian,
    		'cAngle': 0
    	}
    };
};


mTHREE.anims.RotateLimitAngle.prototype = Object.create(mTHREE.anims._abstract.prototype);

// ANIMCUBE :
mTHREE.anims.RotateLimitAngle.prototype.animMesh = function(p){
	
    // Init :
    if(null === p.current){
        p.current = 0;
        p.ratioRMax = (4*p.angleMax) / p.tMax;
        p.ratioRMin = (4*p.angleMin) / p.tMin;
        this.rotation.y = p.angleStart;
        this.userData['px'] = this.position.x;
        this.userData['py'] = this.position.y;
        this.userData['pz'] = this.position.z;
    }
    
    // Animation :
    if(p.current < p.total){
    	if( p.current < p.tMin ){
    		if(p.current < (p.tMin/4)){
    			this.rotation.y += p.ratioRMin;
    		} else if(p.current < (p.tMin/4)*3){
    			this.rotation.y -= p.ratioRMin;
    		} else {
    			this.rotation.y += p.ratioRMin;
    		}
    	} else {
    		if(p.current < p.tMin+(p.tMax/4)){
    			this.rotation.y += p.ratioRMax;
    		} else if(p.current < p.tMin+(p.tMax/4)*3) {
    			this.rotation.y -= p.ratioRMax;
    		} else {
    			this.rotation.y += p.ratioRMax;
    		}
    	}
    	p.current++;
    } else {
    	this.rotation.y = p.angleStart;
    	p.current = 0;
    }
};
