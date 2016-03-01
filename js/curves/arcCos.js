/*
 * ArcCos :
 */
mTHREE.curves.ArcCos = THREE.Curve.create(
	function ( points ) {
		
		this.vCenter = points[0];
		this.vAxis = points[1];
		this.vAngles = points[2];  // Limited on selected axis.
		
	},
	function ( t ) {
		var vRes = new THREE.Vector3();
		vRes.setComponent(0, t*100);
		vRes.setComponent(1, t*100);
		vRes.setComponent(2, t*100);
		//console.log(Math.cos(t*2*Math.PI)*(t-0.5));
		vRes.rotation.y = Math.pi*Math.cos(t*2*Math.PI)*(t-0.5);
		return vRes;
	}
);


mTHREE.curves.ArcCos.prototype._utils = Object.create(mTHREE.curves._utils.prototype);

/**
 * @param vCenter
 * @param axis int (0,1,2)
 * @param limitedAngle float radian
 * @returns {Array}
 */
mTHREE.curves.ArcCos.prototype.createParameters = function(vCenter, axis, limitedAngle){
	
	var vAxis = new THREE.Vector3(0, 0, 0);
	vAxis.setComponent(axis, 1);
	
	var vAngles = new THREE.Vector3(((3/2) * Math.PI), ((3/2) * Math.PI), ((3/2) * Math.PI));
	vAngles.setComponent(axis, limitedAngle);
	
	return [vCenter, vAxis, vAngles];
};

