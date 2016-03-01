mTHREE.curves = {
    _utils: null,
	Spiral:null,
	ArcCos: null
};


mTHREE.curves._utils = function() {
};
  
mTHREE.curves._utils.prototype = {
		
	createMesh: function(id, curve, s, r, rs){
		
		s = (undefined==s?200:s); r = (undefined==r?1:r); rs= (undefined==rs?1:rs);
		var tube = new THREE.TubeGeometry(curve, s, r, rs, false, false);
		tube = nTHREE.nScene.prototype._createMesh(id + '_tube', tube);
		return tube;
	}
};

