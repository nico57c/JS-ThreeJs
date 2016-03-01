mTHREE.loadingManager = {
	_abstract: null,
	default0: null
};


mTHREE.loadingManager._abstract = {
	
	_: {
		loadingManager: null,
		stopTimeout: {
			time: false,
			callback: null
		},
		parent: null,
		current: 0
	},
	setOnDefaultLoadingManager: function(){
		this._.loadingManager = new THREE.LoadingManager(null,this.onProgress.bind(this),this.onError.bind(this));
		THREE.DefaultLoadingManager.onProgress = this.onProgress.bind(this);
		THREE.DefaultLoadingManager.onError = this.onError.bind(this);
	},
	onLoadComplete: function(){
		if(false==this._.stopTimeout.time){
			this.stop();
			this._.stopTimeout.callback.call();
		}
	},
	onError: function(){
		;
	},
	onProgress: function(url,current,total){
		this._.current = (current/total)*100;
		if(current == total){
			this.onLoadComplete();
		}
	},
	started: false,
	start:function(){
		;
	},
	stop: function(){
		;
	},
	stopTimeout: function(){
		var fct = function(){
			if(this._.current >= 100){
				this.stop();
				this._.stopTimeout.callback.call();
			} else{
				this._.stopTimeout.time = 500; // increase default time to 500ms (onProgress must be set).
				this.stopTimeout();
			}
		};
		setTimeout(fct.bind(this),this._.stopTimeout.time);
	},
};
