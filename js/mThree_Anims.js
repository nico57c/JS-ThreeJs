mTHREE.anims = {
    _abstract: null,
	Spiral: null
};


mTHREE.anims._abstract = function(){
	
	this.id= null,
	this._ = {
		objs: {
			geo: {},
			mat: {}
		},
		meshes: {},
		anims: {
			/*
			 * values of anims :
			 * id/name/index can be order of execution:
			 * { name: id/name (not index)
			 *   fct: function() {...}
			 *   c: context
			 *   p: parameters
			 *   t: time
			 * }
			 */
		}
	};

};

mTHREE.anims._abstract.prototype  = {
		
	constructor: mTHREE.anims._abstract,

	/**
	 * @param animObj nTHREE.nAnimations
	 */
	attachToAnim: function(nTHREE_nAnimations){
		for(var index in this._.anims){
			nTHREE_nAnimations.addArr(this._.anims[index]);
		}
		return this;
	},
	/**
	 * @param threeSceneObj : THREE.Scene
	 */
	attachToScene: function(sceneObj){
		nTHREE.nScene.prototype._attachMeshes(sceneObj, this._.meshes);
		return this;
	},
	
	makeDefault: null
};
