mTHREE.keyMoveManager = function() {
	
	this.name = 'world';
	this.objTarget = null;
	this.scene = null;  // for ref.
	this.keyCode = {
		'left': 37,
		'right': 39,
		'down':	40,
		'up': 38
	};
	
	this.deltaUpDown = 100;
	this.deltaLeftRight = 100;
	
	this.keyLeftRightPos = 'x';
	this.keyUpDownPos = 'y';
	
	this.init = function(){
		if(undefined == name){
			name = 'world';
		}
		this.registerDefaultEvents(name).registerDispatcher();
		this.name = name;
		
		return this;
	};
	
	this.registerDefaultEvents = function(fctEventLeft, fctEventRight, fctEventUp, fctEventDown){

		if(undefined != fctEventLeft){
			this.addListener('keyLeft-'+name, fctEventLeft, this, 999);
		} else if(false !== fctEventLeft) {
			this.addListener('keyLeft-'+name, this.keyLeft, this, 999);
		}
		
		if(undefined != fctEventRight){
			this.addListener('keyRight-'+name, fctEventRight, this, 999);
		} else if(false !== fctEventRight) {
			this.addListener('keyRight-'+name, this.keyRight, this, 999);
		}
		
		if(undefined != fctEventUp){
			this.addListener('keyRight-'+name, fctEventUp, this, 999);
		} else if(false !== fctEventUp) {
			this.addListener('keyUp-'+name, this.keyUp, this, 999);
		}
		
		if(undefined != fctEventDown){
			this.addListener('keyRight-'+name, fctEventDown, this, 999);
		} else if(false !== fctEventDown) {
			this.addListener('keyDown-'+name, this.keyDown, this, 999);
		}
		
		return this;
	};
	
	this.registerDispatcher = function(){
		this.addListener('container.eventKeyDown', this.dispatchKeys, this, 1000);
	};
	
	this.setEventsOnElement = function(id){
		var el = ( undefined == id ? document.body : document.getElementById(id) ); 
		el.addEventListener( 'onkeydown', function(e){ this.sendEvent('container.eventKeyDown', e); }, false );
		return this;
	};
	
	this.attachObject = function(target){
		this.objTarget = target;
		return this;
	};
	
	this.keyLeft = function(){
		this.objTarget.position[this.keyLeftRightPos] = this.objTarget.position[this.keyLeftRightPos] - this.deltaLeftRight;
		this.objTarget.updateMatrix();
		return this;
	};
	
	this.keyRight = function(){
		this.objTarget.position[this.keyLeftRightPos] = this.objTarget.position[this.keyLeftRightPos] + this.deltaLeftRight;
		this.objTarget.updateMatrix();
		return this;
	};
	
	this.keyUp = function(){
		this.objTarget.position[this.keyUpDownPos] = this.objTarget.position[this.keyUpDownPos] + this.deltaUpDown;
		this.objTarget.updateMatrix();
		return this;
	};
	
	this.keyDown = function(){
		this.objTarget.position[this.keyUpDownPos] = this.objTarget.position[this.keyUpDownPos] - this.deltaUpDown;
		this.objTarget.updateMatrix();
		return this;
	};
	
	this.dispatchKeys = function(e){
		switch(e.keyCode){
			case this.keyCode.up:
				this.sendEvent('keyUp-'+this.name);
				return true;
				break;
			case this.keyCode.down:
				this.sendEvent('keyDown-'+this.name);
				return true;
				break;
			case this.keyCode.left:
				this.sendEvent('keyLeft-'+this.name);
				return true;
				break;
			case this.keyCode.right:
				this.sendEvent('keyRight-'+this.name);
				return true;
				break;
		}
		return false;
	};

};
