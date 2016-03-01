mTHREE.huds.default0 = function(id, idHtmlContainer) {
	
	this.id = id;
	
	this._ = Object.create(mTHREE.huds._abstract._);
	this._.html = {
		container: document.createElement('div'),
		hud: document.createElement('div'),
		health: {
			p: document.createElement('div'),
			icon: document.createElement('div'),
			value: document.createElement('div')
		},
		score: {
			p: document.createElement('div'),
			icon: document.createElement('div'),
			value: document.createElement('div')
		},
		time: {
			p: document.createElement('div'),
			min: document.createElement('div'),
			sec: document.createElement('div'),
			separator: document.createElement('div'),
		}
	};
	
	document.getElementById(idHtmlContainer).appendChild(this._.html.container);
	
	this._.time.total = 60*10;
	this._.time.current = 0;
	this._['anims'] = {
		score_icon: {
			anim: ['2','2_1','2_2','2_3','2_2','2_1'],
			index: 0
		},
		health_icon: {
			anim: ['2','2_1','2_1','2_2','2_2','2_3','2_3','2_4','2_4','2_3','2_2','2_1','2','2','2'],
			index: 0
		},
		time: {
			anim: ['2','2_1','2_2','2_3','2_4','2_5','2_6','2_7','2','2_1','2_2','2_3','2_4','2','2','2_1','2_2','2_3','2_4','2'],
			index: 0,
			index0: 0,
		}
	};
};

mTHREE.huds.default0.prototype = Object.create(mTHREE.huds._abstract);

mTHREE.huds.default0.prototype.init = function(){
	
	// Timer init :
	this._.html.time.min.setAttribute('id',this.id + '_timeMin');
	this._.html.time.min.innerHTML = '00';
	
	this._.html.time.sec.setAttribute('id',this.id + '_timeSec');
	this._.html.time.sec.innerHTML = '00';

	this._.html.time.separator.setAttribute('id',this.id + '_timeSeparator');
	this._.html.time.separator.innerHTML = ':';
	
	this._.html.time.p.setAttribute('id',this.id + '_time');
	this._.html.time.p.appendChild(this._.html.time.min);
	this._.html.time.p.appendChild(this._.html.time.separator);
	this._.html.time.p.appendChild(this._.html.time.sec);
	
	
	// Health init :
	this._.html.health.icon.setAttribute('id',this.id + '_healthIcon');
	this._.html.health.icon.innerHTML = '';
	
	this._.html.health.value.setAttribute('id',this.id + '_healthValue');
	this._.html.health.value.innerHTML = this.numToString(3,this._.health.current);
	
	this._.html.health.p.setAttribute('id',this.id + '_health');
	this._.html.health.p.appendChild(this._.html.health.icon);
	this._.html.health.p.appendChild(this._.html.health.value);
	
	// Score init :
	this._.html.score.icon.setAttribute('id',this.id + '_scoreIcon');
	this._.html.score.icon.innerHTML = '';
	
	this._.html.score.value.setAttribute('id',this.id + '_scoreValue');
	this._.html.score.value.innerHTML = this.numToString(7,this._.score.current);
	
	this._.html.score.p.setAttribute('id',this.id + '_score');
	this._.html.score.p.appendChild(this._.html.score.icon);
	this._.html.score.p.appendChild(this._.html.score.value);
	
	
	// Hud init :
	this._.html.hud.setAttribute('id',this.id + '_hud');
	this._.html.hud.appendChild(this._.html.score.p);
	this._.html.hud.appendChild(this._.html.time.p);
	this._.html.hud.appendChild(this._.html.health.p);
	
	
	// Container init :
	this._.html.container.setAttribute('id',this.id);
	this._.html.container.appendChild(this._.html.hud);
	this._.html.container.appendChild(this.createStyles());
	
	// Start anims
	this.startHudAnims();
	
	return this;
};

mTHREE.huds.default0.prototype.createStyles = function(){
	var result = document.createElement('style');
	    result.type = 'text/css';
	var css = {};
		css['id-' + this.id + '_hud'] = this.styles.hud;
		css['id-' + this.id + '_time'] = this.styles.time;
		css['id-' + this.id + '_timeMin'] = this.styles.time_min;
		css['id-' + this.id + '_timeSec'] = this.styles.time_sec;
		css['id-' + this.id + '_timeSeparator'] = this.styles.time_separator;
		css['id-' + this.id + '_score'] = this.styles.score;
		css['id-' + this.id + '_scoreValue'] = this.styles.score_value;
		css['id-' + this.id + '_scoreIcon'] = this.styles.score_icon;
		css['id-' + this.id + '_health'] = this.styles.health;
		css['id-' + this.id + '_healthValue'] = this.styles.health_value;
		css['id-' + this.id + '_healthIcon'] = this.styles.health_icon;
	
	result.innerHTML = this.convertArrayToCss(css);
	return result;
};

mTHREE.huds.default0.prototype.refreshHUD = function(){
	;
};

mTHREE.huds.default0.prototype.startHudAnims = function(){
	// Score anim :
	this._.html.score.icon.innerHTML = '  <img style="height:20px;width:15px;" src="/js/huds/default0/score_icon' + 
										this._.anims.score_icon.anim[this._.anims.score_icon.index] + '.png"/>';
	this._.anims.score_icon.index = this._.anims.score_icon.index>=(this._.anims.score_icon.anim.length-1)?0:this._.anims.score_icon.index+1;
	
	// Health anim :
	this._.html.health.icon.innerHTML = '  <img style="height:20px;width:20px;" src="/js/huds/default0/health_icon' + 
	this._.anims.health_icon.anim[this._.anims.health_icon.index] + '.png"/>';
	this._.anims.health_icon.index = this._.anims.health_icon.index>=(this._.anims.health_icon.anim.length-1)?0:this._.anims.health_icon.index+1;
	
	// Time anim :
	if(!this._.anims.time.index0){
		this._.html.time.separator.innerHTML = '  <img style="height:20px;width:20px;" src="/js/huds/default0/time_icon' + 
		this._.anims.time.anim[this._.anims.time.index] + '.png"/>';
		this._.anims.time.index = this._.anims.time.index>=(this._.anims.time.anim.length-1)?0:this._.anims.time.index+1;
		this._.anims.time.index0 = 1;
	} else {
		this._.anims.time.index0 = 0;
	}
	setTimeout(mTHREE.huds.default0.prototype.startHudAnims.bind(this),250);
};

mTHREE.huds.default0.prototype.eventsListeners.time.inc = function(){
	console.log('test');
	if(this._.html.time.separator.innerHTML == ''){
		this._.html.time.separator.innerHTML = ':';
	} else {
		this._.html.time.separator.innerHTML = '';
	}
	
	this._.html.time.min.innerHTML = this.numToString(2,Math.floor(this._.time.current/60));
	this._.html.time.sec.innerHTML = this.numToString(2,this._.time.current%60);
};

mTHREE.huds.default0.prototype.eventsListeners.time.inc = function(){
	this._.html.time.min.innerHTML = this.numToString(2,Math.floor(this._.time.current/60));
	this._.html.time.sec.innerHTML = this.numToString(2,this._.time.current%60);
};

mTHREE.huds.default0.prototype.eventsListeners.health.inc = function(){
	this._.html.health.value.innerHTML = this._.health.current;
};

mTHREE.huds.default0.prototype.eventsListeners.health.dec = function(){
	this._.html.health.value.innerHTML = this._.health.current;
};

mTHREE.huds.default0.prototype.eventsListeners.score.inc = function(){
	this._.html.score.value.innerHTML = this.numToString(7,this._.score.current);
};

mTHREE.huds.default0.prototype.eventsListeners.score.dec = function(){
	this._.html.score.value.innerHTML = this.numToString(7,this._.score.current);
};

mTHREE.huds.default0.prototype.styles = {
	hud:{
		'background-color':'transparent',
		'position':'absolute',
		'top':'0px',
		'left':'0px',
		'height':'4em',
		'width':'100%',
		'font-family': 'monospace',
	},
	time:{
		'background-color':'transparent',
		'position':'absolute',
		'left': '50%',
		'color':'#FFF',
		'height':'4em',
		'margin-left': '-100px',
		'width':'200px',
		'padding-left': '10px',
		'padding-right': '10px',
		'border-left': '1px solid #0F0',
		'border-right': '1px solid #0F0',
	    'border-bottom': '1px solid #0F0',
	},
	time_min:{
		'background-color':'transparent',
		'color':'#000',
		'height':'100%',
		'line-height':'100%',
		'width':'40%',
		'text-align':'center',
		'vertical-align':'middle',
		'font-size':'4em',
		'float':'left',
		'color': '#FFF'
	},
	time_sec:{
		'background-color':'transparent',
		'color':'#000',
		'height':'100%',
		'line-height':'100%',
		'margin-left':'60%',
		'width':'40%',
		'text-align':'center',
		'vertical-align':'middle',
		'font-size':'4em',
		'color': '#FFF'
	},
	time_separator:{
		'float':'left',
		'height':'100%',
		'line-height':'100%',
		'width':'20%',
		'text-align':'center',
		'vertical-align':'middle',
		'font-size':'3em'
	},
	health:{
		'background-color':'transparent',
		'width':'20%',
		'height':'100%',
		'line-height': '100%',
		'float': 'left',
		'text-align':'center'
	},
	health_value:{
		'background-color':'transparent',
		'font-size':'2.5em',
		'display': 'inline',
		'color': '#FFF',
		'height': '100%',
		'line-height': '-moz-block-height'
	},
	health_icon:{
		'background-color':'transparent',
		'display': 'inline',
		'color': '#FFF',
		'height': '100%',
		'margin-right': '50px',
	},
	score:{
		'background-color':'transparent',
		'width':'20%',
		'height':'100%',
		'line-height': '100%',
		'float': 'left',
		'text-align':'center'
	},
	score_value:{
		'background-color':'transparent',
		'font-size':'2.5em',
		'display': 'inline',
		'color': '#FFF',
		'height': '100%',
		'line-height': '-moz-block-height'
	},
	score_icon:{
		'background-color':'transparent',
		'display': 'inline',
		'color': '#FFF',
		'height': '100%',
		'margin-right': '50px',
	}
};
