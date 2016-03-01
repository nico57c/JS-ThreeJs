mTHREE.huds = {
	_abstract: null,
	default0: null
};

mTHREE.huds._abstract = {
	
	styles:{},
	_: {
		health: {
			current: 100,
			extra: 0,	// increment if current == total.
			total: 100,
			inc: 10,
			dec: 10,
		},
		score: {
			current: 0,
			extra: 0,	// increment if current == total.
			total: 9999999,  // score max ...
			inc: 10,
			dec: 5,
		},
		bonus: {},
		time: {
			current: 0,
			total: 60,
			inc: 1,
			timeout: 999,
		},
	},
	events: {
		clock:{
			inc: 'clock.inc',
			end: 'clock.end',
			start: 'clock.start',
		},
		health:{
			dec: 'health.dec',
			inc: 'health.inc',
			empty: 'health.empty',
			full: 'health.full',
			extra: 'health.extra',
		},
		score:{
			dec: 'score.dec',
			inc: 'score.inc',
			zero: 'score.zero',
			full: 'score.full',
			extra: 'score.extra',
		},
		bonus:{
			add: 'bonus.add',
			remove: 'bonus.remove',
			removeAll: 'bonus.removeAll',
			select: 'bonus.select',
		},
	},
	clock: function(){
		var fct = function(){
			this._clock(this._.time.inc);
			this.clock();
		};
		setTimeout(fct.bind(this),this._.time.timeout);
	},
	_clock: function(inc){
		if(null !== this.nObserver){
			if(this._.time.current >= (this._.time.total-1)){
				this.nObserver.sendEvent(this.events.clock.end,this);
			} else if(this._.time.current == 0){
				this.nObserver.sendEvent(this.events.clock.start,this);
			}
			this.nObserver.sendEvent(this.events.clock.inc,this);
		}
		this._.time.current += inc;
	},
	health: {
		decrease:function(dec){
			this._.health.current -= (undefined==dec?this._.health.dec:dec);
			if(null !== this.nObserver){
				if(this._.health.current == 0){
					this.nObserver.sendEvent(this.events.health.empty,this);
				}
				this.nObserver.sendEvent(this.events.health.dec,this);
			}
		},
		increase: function(inc){
			if(this._.health.current >= this._.health.total){
				this._.health.extra += (undefined==inc?this._.health.inc:inc);
			} else {
				this._.health.current += (undefined==inc?this._.health.inc:inc);
			}
			
			if(null !== this.nObserver){
				if(this._.health.current >= this._.health.total){
					this.nObserver.sendEvent(this.events.health.full,this);
				}
				if(this._.health.current > this._.health.total){
					this.nObserver.sendEvent(this.events.health.extra,this);
				}
				this.nObserver.sendEvent(this.events.health.inc,this);
			}
		},
	},
	score: {
		decrease:function(dec){
			this._.score.current -= (undefined==dec?this._.score.dec:dec);
			if(null !== this.nObserver){
				if(this._.score.current >= this._.score.total){
					this.nObserver.sendEvent(this.events.score.full,this);
				}
				if(this._.score.current > this._.score.total){
					this.nObserver.sendEvent(this.events.score.extra,this);
				}
				this.nObserver.sendEvent(this.events.score.inc,this);
			}
		},
		increase: function(inc){
			this._.score.current += (undefined==inc?this._.score.inc:inc);
			if(null !== this.nObserver){
				if(this._.score.current == 0){
					this.nObserver.sendEvent(this.events.score.zero,this);
				}
				this.nObserver.sendEvent(this.events.score.dec,this);
			}
		},
	},
	bonus: {
		add: function(index,bonus){
			this._.bonus[index] = bonus;
			if(null !== this.nObserver){
				this.nObserver.sendEvent(this.events.bonus.add,this);
			}
		},
		removeAll: function(index){
			this._.bonus = {};
			if(null !== this.nObserver){
				this.nObserver.sendEvent(this.events.bonus.removeAll,this);
				this.nObserver.sendEvent(this.events.bonus.remove,this);
			}
		},
		select: function(index){
			return this._.bonus[index];
			if(null !== this.nObserver){
				this.nObserver.sendEvent(this.events.health.select,this);
			}
		},
		remove: function(index){
			delete(this._.bonus[index]);
			if(null !== this.nObserver){
				this.nObserver.sendEvent(this.events.health.remove,this);
			}
		}
	},
	nObserver: null,
	eventsListeners: {
		time:{ inc:null, dec:null, end:null, start:null },
		health:{ inc:null, dec:null, empty:null, full:null, extra:null },
		score:{ inc:null, dec:null, empty:null, full:null, extra:null }
	},
	initDefaultEventsListener: function(){
		if(undefined == this.nObserver){
			this.nObserver = new nTHREE.nObserver();
		}
		
		if(this.eventsListeners.time.inc != undefined){
			this.nObserver.addListener(this.events.clock.inc,this.eventsListeners.time.inc, this);
		}
		if(this.eventsListeners.time.dec != undefined){
			this.nObserver.addListener(this.events.clock.dec,this.eventsListeners.time.dec, this);
		}
		if(this.eventsListeners.time.end != undefined){
			this.nObserver.addListener(this.events.clock.end,this.eventsListeners.time.end, this);
		}
		if(this.eventsListeners.time.start != undefined){
			this.nObserver.addListener(this.events.clock.start,this.eventsListeners.time.start, this);
		}
		
		if(this.eventsListeners.health.inc != undefined){
			this.nObserver.addListener(this.events.health.inc,this.eventsListeners.health.inc, this);
		}
		if(this.eventsListeners.health.dec != undefined){
			this.nObserver.addListener(this.events.health.dec,this.eventsListeners.health.dec, this);
		}
		
		if(this.eventsListeners.score.inc != undefined){
			this.nObserver.addListener(this.events.score.inc,this.eventsListeners.score.inc, this);
		}
		if(this.eventsListeners.score.dec != undefined){
			this.nObserver.addListener(this.events.score.dec,this.eventsListeners.score.dec, this);
		}
		
		return this;
	},
	convertArrayToCss: function(cssArray){
		return JSON.stringify(cssArray).replace(/,/g,';').replace(/"/g,'')
									   .replace(/id-/g,"}\n#")
									   .replace(/:{/g,'---').replace(/{/g,'').replace(/---/g,"{\n")
									   .replace(/}/,'').replace(/}$/,'').replace(/;}/g,'').replace(/}/g,"}\n");
	},
	numToString: function(digits,num){
		numStr = '' + num;
		digits -= numStr.length;
		for(var i=digits;i>0;i--){
			numStr = '0' + numStr;
		}
		return numStr;
	}
};

