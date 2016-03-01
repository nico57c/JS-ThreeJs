// Separate observer :
nTHREE.nObserver = function() {
	
	this.name = '_';
	this.listeners = {};
	
	this.init = function(name){
		this.name = (undefined==name?'_':name);
		nData[this.name].nObserver = this;
		return this;
	};
	
	// With weight value
	this.addListener = function(eventName, fct, context, weight){
		if(!this.listeners.hasOwnProperty(eventName)){
			this.listeners[eventName] = new Array();
		}
		
		this.listeners[eventName].push({'fct':fct, 'w': (undefined==weight?1:weight), 'c':(undefined==context?this:context)});
		return this;
	};
	
	// With weight value
	this.sendEvent = function(eventName, e){
		var weight = indexesL = [];
		for(var index in this.listeners[eventName]){
			indexesL[index] = true;
			weight[index] = this.listeners[eventName][index].w;
		}
		weight = weight.sort(function(a,b) { return a - b; });
		
		for(var indexW in weight){
			for(var indexL in this.listeners[eventName]){
				if(indexesL[indexL] && this.listeners[eventName][indexL].w == weight[indexW]){
					indexesL[indexL] = false;
					if(undefined != e){
						this.listeners[eventName][indexL].fct.call(this.listeners[eventName][indexL].c, [e]);
					} else {
						this.listeners[eventName][indexL].fct.call(this.listeners[eventName][indexL].c);
					}
					break;
				}
			}
		}
		
		delete weight, indexesL;
		return this;
	};
};
