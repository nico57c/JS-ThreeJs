// Use THREE objects (like managers) :
nTHREE = {
	nThree: null,
	nObjs: null,
	nScene: null,
	nAnimations: null,
	nRender: null,
	nObserver: null,
};

// Functionnalities :
mTHREE = {
	keyMoveManager: null,
	loadingManager: null,
	curves: null,
	anims: null,
	huds: null
};

// Objects instances :
function nInit(name){
	name = (undefined==name?'_':name);
	nData = {};
	nData[name] = {
		nThree: null,
		nObserver: null
	};
	
	new nTHREE.nThree().init(name);
	new nTHREE.nObserver().init(name);
};
