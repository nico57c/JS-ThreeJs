
nTHREE.nRender = function(){
	
	this.parent = null;
	
	// Objects rendering.
	this._ = {};
	
	this._stop = [];
	this._loadingManager = false;
	
	this.setToRender = function(name, scene, camera){
		this._[name] = {s: scene, c:camera};
		return this;
	};
	
	this.setToRenderRefs = function(name, rScene, rCamera){
		this._[name] = {s: this.parent.getScene(rScene), c: this.parent.getNScene(rScene).getCamera(rCamera) };
		console.log('Set render of ' + name + '::Camera(' + rCamera + ') in Scene(' + rScene + ')');
		return this;
	};
	
	this.deleteRender = function(name){
		delete(this._[name]);
		return this;
	};
	
	this.render = function(){
		for(var index in this._){
			this.parent._.renderer.render(this._[index].s, this._[index].c);
		}
		return this;
	};
	
	this.renderRecursiveTime = function(index,time){
		if(undefined == index){
			index = this._stop.length-1;
		}
		if(this._stop[index]) return;
		this.render();
	    setTimeout(this.renderRecursiveTime.bind(this,index,time),time);
	    return index;
	};
	
	this.renderRecursive = function(index){
 		if(undefined == index){
			index = this._stop.length-1;
		}
 		
		var blob = new Blob(["onmessage = function(e) { " +
		                     " postMessage('Frame1'); " +
		                     " }"]);

         // Obtain a blob URL reference to our worker 'file'.
         var blobURL = window.URL.createObjectURL(blob);

         var worker = new Worker(blobURL);
         worker.index = index;
         worker.render = this;
         worker.onmessage = function(e) {
    		if(this.render._stop[this.index]) return;
			this.render.render();
			this.postMessage('Next frame');
         };
         worker.postMessage('Start Render from worker');
         return index;
	};
	
	this.renderRecursiveAnimationFrame = function(index){
		if(undefined == index){
			index = this._stop.length-1;
		}
		if(this._stop[index]) return;
		this.render();
		requestAnimationFrame(this.renderRecursiveAnimationFrame.bind(this,index));
		return index;
	};
	
	this.startLoadingManager = function(loadingManager){
		this._loadingManager = loadingManager;
		this._loadingManager.start();
		return this;
	};
	
	this.stopLoadingManager = function(minTime,callback){
		if(false !== minTime){
			this._loadingManager._.stopTimeout.callback = callback;
			this._loadingManager._.stopTimeout.time = minTime;
			this._loadingManager.stopTimeout();
		} else {
			this._loadingManager._.stopTimeout.callback = callback;
			this._loadingManager._.stopTimeout.time = minTime;
		}
		return this;
	};
	
	this.stop = function(index){
		if(undefined == index){
			this._stop[this._stop.length-1] = true;
		} else{
			this._stop[index] = true;
		}
		return this;
	};
	
	this.start = function(index){
		if(undefined == index){
			this._stop.push(false);
		} else{
			this._stop[index] = false;
		}
		return this;		
	};
	
	this.reset = function(){
		this.stop();
		this._ = {};
		return this;
	};
};

