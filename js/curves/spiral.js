/*
 * SPIRAL :
 */
mTHREE.curves.Spiral = THREE.Curve.create(
	function ( points ) {
		
		// point[0] == start ( x, y, z ) (start of spiral)
		// Radian from start on axis rotation
		// point[2] == direction ( x(0,1), y(0,1), z(0,1) ) select axis 
		// point[3] == size ( width ; length ; height ) height is placed on selected axis from direction
		// point[4] == rotations ( x, y, z ) rotations placed on width,length axis 
		this.points = (points == undefined) ? [
           new THREE.Vector3(1,100,1),
           0,   	  // Radian from start on rotation axis
           new THREE.Vector3(0,1,0),
           new THREE.Vector3(50,100,50),  // width, height, length
           new THREE.Vector3(4,0,4)
		] : points;
           
        this.rEnd = this.points[1];
		this.axis = this.points[2];
		
		// Start point :
		this.vStart_W = (!this.axis.x?this.points[0].x:(!this.axis.y?this.points[0].y:(!this.axis.z?this.points[0].z:vRes.x)));
		this.vStart_L = (!this.axis.z?this.points[0].z:(!this.axis.y?this.points[0].y:(!this.axis.x?this.points[0].x:vRes.z)));
		this.vStart_H = (this.axis.x?this.points[0].x:(this.axis.y?this.points[0].y:(this.axis.z?this.points[0].z:vRes.y)));
		
		// Axis :
		this.vRes_W = (!this.axis.x?0:(!this.axis.y?1:(!this.axis.z?2:0)));
		this.vRes_L = (!this.axis.z?2:(!this.axis.y?1:(!this.axis.x?0:2)));
		this.vRes_H = (this.axis.x?0:(this.axis.y?1:(this.axis.z?2:1)));
		
		// Rotations :
		this.r_W = (!this.axis.x?this.points[4].x:(!this.axis.y?this.points[4].y:(!this.axis.z?this.points[4].z:this.points[4].x)));
		this.r_L = (!this.axis.z?this.points[4].z:(!this.axis.y?this.points[4].y:(!this.axis.x?this.points[4].x:this.points[4].z)));
		
		// Width / Length / Height :
		this.size_W = (!this.axis.x?this.points[3].x:(!this.axis.y?this.points[3].y:(!this.axis.z?this.points[3].z:this.points[3].x)));
		this.size_L = (!this.axis.z?this.points[3].z:(!this.axis.y?this.points[3].y:(!this.axis.x?this.points[3].x:this.points[3].z)));
		this.size_H = (this.axis.x?this.points[3].x:(this.axis.y?this.points[3].y:(this.axis.z?this.points[3].z:this.points[3].y)));
		
	},
	function ( t ) {
		var vRes = new THREE.Vector3();
		vRes.setComponent(this.vRes_W, (Math.cos(Math.PI*2*this.r_W*t)*t*this.size_W) + this.vStart_W );
		vRes.setComponent(this.vRes_L, (Math.sin(Math.PI*2*this.r_L*t)*t*this.size_L) + this.vStart_L );
		vRes.setComponent(this.vRes_H, this.vStart_H-(t*this.size_H) );
		
		if(0!=this.rEnd){
			var matrix = new THREE.Matrix4().makeRotationAxis(this.axis, this.rEnd);
			vRes.applyMatrix4( matrix );
		}
		return vRes;
	}
);

/**
 * 
 * @param THREE.Vector3 vCenter
 * @param THREE.Vector3 vSize (Width,Height,Length) (cf: mTHREE.curves.Spiral and default value points[3])
 * @param int dir  (0,1,2) (default is 0=x, 1=y, 2=z, default is y)
 * @param height
 * @param width
 * @param length
 * @param loopW
 * @param loopL
 */
mTHREE.curves.Spiral.prototype.createParameters = function(vCenter,vSize,dir,rEnd,loopW,loopL){
	
	var end = (undefined==rEnd?0:rEnd);
	var direction = new THREE.Vector3(0,0,0);
	var size = new THREE.Vector3(0,0,0);
	var rotations = new THREE.Vector3(0,0,0);
	
	// default order W,H,L
	/*
		dir == 0
		W	0 == 2
		H	1 == 0
		L	2 == 1
		
		dir == 1
		W	0 == 0
		H	1 == 1
		L	2 == 2

		dir == 2
		W	0 == 1
		H	1 == 2
		L	2 == 0
	*/		
	dirArray = [2,0,1,0,1,2,1,2,0];
	dirArray = dirArray.slice(3*dir,3*dir+3);
	
	// custom order :
	size.setComponent(dirArray[0],vSize.getComponent(0));
	size.setComponent(dirArray[1],vSize.getComponent(1));
	size.setComponent(dirArray[2],vSize.getComponent(2));
	
	rotations.setComponent(dirArray[0],loopW);
	rotations.setComponent(dirArray[2],loopL);
	
	direction.setComponent(dir,1);
	
	return [ vCenter, end, direction, size, rotations ];
};

