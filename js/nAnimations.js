nTHREE.nAnimations = function() {
	
	
	this.parent = null;
	this._ = {};
	this._indexTime = [];
	this._stop = false;
	this._frame = 0;
	this._frameMax = 59;
	
	this.add = function(name, fct, c, p, t){
		this._[name] = {'fct':fct, 'c': (undefined == c?this.parent:c), 'p': (undefined==p?{}:p), 't': (undefined==t?null:t), 'play': true};
		this.refreshTimeIndex();
		return this;
	};
	
	this.addArr = function(p){
		return this.add(p.name, p.fct, p.c, p.p, p.t);
	};
	
	this.play = function(){
		for( var name in this._){
			if(this._[name].play && this._[name].t == null){
				this._[name].p['_frame'] = this._frame;
				this._[name].fct.call(this._[name].c, this._[name].p);
			}
		}
		return this;
	};
	
	this.playIndexTime = function(time){
		for(var index=0;index<this._indexTime[time].length;index++){
			var name = this._indexTime[time][index];
			if(this._[name].play && this._[name].t == time){
				this._[name].p['_frame'] = this._frame;
				this._[name].fct.call(this._[name].c, this._[name].p);
			}
		}
		return this;
	};
	
	this.framesClock = function(){
		if(this._frame>=this._frameMax){
			this._frame=0;
		} else{
			this._frame++;
		}
		
		if(!this._stop){
			requestAnimationFrame(this.framesClock.bind(this));
		}
	};
	
	this.refreshTimeIndex = function(){
		delete(this._indexTime);
		this._indexTime = [];
		
		for(var name in this._){
			if(undefined == this._indexTime[this._[name].t]){
				this._indexTime[this._[name].t] = [];
			}
			this._indexTime[this._[name].t].push(name);			
		}
		return this;
	};
	
	this.remove = function(name){
		delete this._[name];
		this.refreshTimeIndex();
		return this;
	};
	
	this.removeAll = function(){
		delete(this._);
		delete(this._indexTime);
		this._ = {};
		this._indexTime = [];
		return this;
	};
	
	this.setTime = function(name, time){
		this._[name].t = (undefined==time?null:time);
		this.refreshTimeIndex();
		return this;
	};
	
	this.setPlay = function(name){
		this._[name].play = true;
		return this;
	};
	
	this.setStop = function(name){
		this._[name].play = false;
		return this;
	};
	
	this.setPause = function(name){
		this._[name].play = !this._[name].play;
		return this;
	};
	
	this.start = function(){
		this._stop = false;
		this.framesClock();
		return this;
	};
	
	this.stop = function(){
		this._stop = true;
		return this;
	};
	
	this.playRecursive = function(){
		 var blob = new Blob(["onmessage = function(e) { " +
		                      " postMessage('Anim traitement'); " +
		                      " }"]);
	     var blobURL = window.URL.createObjectURL(blob);
	
	     var worker = new Worker(blobURL);
	     worker.animations = this;
	     worker.onmessage = function(e) {
			this.animations.play();
			this.postMessage('Next anim traitement');
	     };
	     worker.postMessage('Start anim traitement from worker');
	};
	
	this.playRecursiveAnimationFrame = function(){
		if(false == this._stop){
			requestAnimationFrame(this.playRecursiveAnimationFrame.bind(this));
			this.play();
		}
	};
	
	this.playRecursiveTime = function(time){
		if(false == this._stop){
			setTimeout(this.playRecursiveTime.bind(this,time), time);
			this.play();
		}
	};
	
	/**
	 * Start this without parameters
	 */
	this.playRecursiveIndexTime = function(time){
		if(undefined == time){
			for(var timeIndex in this._indexTime){
				setTimeout(this.playRecursiveAnimationTime.bind(this,timeIndex), timeIndex);
			}
		} else if(false == this._stop){
			this.playIndexTime(time);
			setTimeout(this.playRecursiveAnimationTime.bind(this,time), time);
		}
	};
};
