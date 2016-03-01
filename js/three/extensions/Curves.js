THREE.Curves = {};

THREE.Curves.ArcCurve = function ( aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise ) {
	THREE.Curves.EllipseCurve.call( this, aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise );
};

THREE.Curves.ArcCurve.prototype = Object.create( THREE.Curves.EllipseCurve.prototype );

THREE.Curves.ClosedSplineCurve3 = THREE.Curve.create(

	function ( points /* array of Vector3 */) {
		this.points = (points == undefined) ? [] : points;
	},

	function ( t ) {
	    var v = new THREE.Vector3();
	    var c = [];
	    var points = this.points, point, intPoint, weight;
	    point = ( points.length - 0 ) * t;
	        // This needs to be from 0-length +1
	
	    intPoint = Math.floor( point );
	    weight = point - intPoint;
	
	    intPoint += intPoint > 0 ? 0 : ( Math.floor( Math.abs( intPoint ) / points.length ) + 1 ) * points.length;
	    c[ 0 ] = ( intPoint - 1 ) % points.length;
	    c[ 1 ] = ( intPoint ) % points.length;
	    c[ 2 ] = ( intPoint + 1 ) % points.length;
	    c[ 3 ] = ( intPoint + 2 ) % points.length;
	
	    v.x = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].x, points[ c[ 1 ] ].x, points[ c[ 2 ] ].x, points[ c[ 3 ] ].x, weight );
	    v.y = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].y, points[ c[ 1 ] ].y, points[ c[ 2 ] ].y, points[ c[ 3 ] ].y, weight );
	    v.z = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].z, points[ c[ 1 ] ].z, points[ c[ 2 ] ].z, points[ c[ 3 ] ].z, weight );
	
	    return v;
	}
);

THREE.Curves.ClosedSplineCurve3.prototype = Object.create( THREE.Curve.prototype );

THREE.Curves.CubicBezierCurve = function ( v0, v1, v2, v3 ) {
	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;
	this.v3 = v3;
};

THREE.Curves.CubicBezierCurve.prototype = Object.create( THREE.Curve.prototype );

THREE.Curves.CubicBezierCurve.prototype.getPoint = function ( t ) {
	var tx, ty;
	tx = THREE.Shape.Utils.b3( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x );
	ty = THREE.Shape.Utils.b3( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y );
	
	return new THREE.Vector2( tx, ty );
};
	
THREE.Curves.CubicBezierCurve.prototype.getTangent = function( t ) {
	var tx, ty;
	tx = THREE.Curve.Utils.tangentCubicBezier( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x );
	ty = THREE.Curve.Utils.tangentCubicBezier( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y );
	
	var tangent = new THREE.Vector2( tx, ty );
	tangent.normalize();
	
	return tangent;
};

THREE.Curves.CubicBezierCurve3 = THREE.Curve.create(

	function ( v0, v1, v2, v3 ) {
		this.v0 = v0;
		this.v1 = v1;
		this.v2 = v2;
		this.v3 = v3;
	},
	
	function ( t ) {
		var tx, ty, tz;
		tx = THREE.Shape.Utils.b3( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x );
		ty = THREE.Shape.Utils.b3( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y );
		tz = THREE.Shape.Utils.b3( t, this.v0.z, this.v1.z, this.v2.z, this.v3.z );
		return new THREE.Vector3( tx, ty, tz );
	}
);

THREE.Curves.EllipseCurve = function ( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise ) {

	this.aX = aX;
	this.aY = aY;

	this.xRadius = xRadius;
	this.yRadius = yRadius;

	this.aStartAngle = aStartAngle;
	this.aEndAngle = aEndAngle;

	this.aClockwise = aClockwise;

};

THREE.Curves.EllipseCurve.prototype = Object.create( THREE.Curve.prototype );
THREE.Curves.EllipseCurve.prototype.getPoint = function ( t ) {
	var angle;
	var deltaAngle = this.aEndAngle - this.aStartAngle;

	if ( deltaAngle < 0 ) deltaAngle += Math.PI * 2;
	if ( deltaAngle > Math.PI * 2 ) deltaAngle -= Math.PI * 2;

	if ( this.aClockwise === true ) {
		angle = this.aEndAngle + ( 1 - t ) * ( Math.PI * 2 - deltaAngle );
	} else {
		angle = this.aStartAngle + t * deltaAngle;
	}

	var tx = this.aX + this.xRadius * Math.cos( angle );
	var ty = this.aY + this.yRadius * Math.sin( angle );

	return new THREE.Vector2( tx, ty );
};

THREE.Curves.LineCurve = function ( v1, v2 ) {
	this.v1 = v1;
	this.v2 = v2;
};

THREE.Curves.LineCurve.prototype = Object.create( THREE.Curve.prototype );

THREE.Curves.LineCurve.prototype.getPoint = function ( t ) {
	var point = this.v2.clone().sub(this.v1);
	point.multiplyScalar( t ).add( this.v1 );
	return point;
};

// Line curve is linear, so we can overwrite default getPointAt
THREE.Curves.LineCurve.prototype.getPointAt = function ( u ) {
	return this.getPoint( u );
};

THREE.Curves.LineCurve.prototype.getTangent = function( t ) {
	var tangent = this.v2.clone().sub(this.v1);
	return tangent.normalize();
};

THREE.Curves.LineCurve3 = THREE.Curve.create(

	function ( v1, v2 ) {
		this.v1 = v1;
		this.v2 = v2;
	},

	function ( t ) {
		var r = new THREE.Vector3();
		r.subVectors( this.v2, this.v1 ); // diff
		r.multiplyScalar( t );
		r.add( this.v1 );
		return r;
	}
);


THREE.Curves.QuadraticBezierCurve = function ( v0, v1, v2 ) {
	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;
};

THREE.Curves.QuadraticBezierCurve.prototype = Object.create( THREE.Curve.prototype );


THREE.Curves.QuadraticBezierCurve.prototype.getPoint = function ( t ) {
	var tx, ty;
	tx = THREE.Shape.Utils.b2( t, this.v0.x, this.v1.x, this.v2.x );
	ty = THREE.Shape.Utils.b2( t, this.v0.y, this.v1.y, this.v2.y );
	return new THREE.Vector2( tx, ty );
};

THREE.Curves.QuadraticBezierCurve.prototype.getTangent = function( t ) {
	var tx, ty;
	tx = THREE.Curve.Utils.tangentQuadraticBezier( t, this.v0.x, this.v1.x, this.v2.x );
	ty = THREE.Curve.Utils.tangentQuadraticBezier( t, this.v0.y, this.v1.y, this.v2.y );

	// returns unit vector
	var tangent = new THREE.Vector2( tx, ty );
	tangent.normalize();
	return tangent;
};

THREE.Curves.QuadraticBezierCurve3 = THREE.Curve.create(
	function ( v0, v1, v2 ) {
		this.v0 = v0;
		this.v1 = v1;
		this.v2 = v2;
	},
	function ( t ) {
		var tx, ty, tz;
		tx = THREE.Shape.Utils.b2( t, this.v0.x, this.v1.x, this.v2.x );
		ty = THREE.Shape.Utils.b2( t, this.v0.y, this.v1.y, this.v2.y );
		tz = THREE.Shape.Utils.b2( t, this.v0.z, this.v1.z, this.v2.z );
		return new THREE.Vector3( tx, ty, tz );
	}
);


THREE.Curves.SplineCurve = function ( points /* array of Vector2 */ ) {

this.points = (points == undefined) ? [] : points;

};

THREE.Curves.SplineCurve.prototype = Object.create( THREE.Curve.prototype );

THREE.Curves.SplineCurve.prototype.getPoint = function ( t ) {
	var v = new THREE.Vector2();
	var c = [];
	var points = this.points, point, intPoint, weight;
	point = ( points.length - 1 ) * t;
	
	intPoint = Math.floor( point );
	weight = point - intPoint;
	
	c[ 0 ] = intPoint == 0 ? intPoint : intPoint - 1;
	c[ 1 ] = intPoint;
	c[ 2 ] = intPoint > points.length - 2 ? points.length -1 : intPoint + 1;
	c[ 3 ] = intPoint > points.length - 3 ? points.length -1 : intPoint + 2;
	
	v.x = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].x, points[ c[ 1 ] ].x, points[ c[ 2 ] ].x, points[ c[ 3 ] ].x, weight );
	v.y = THREE.Curve.Utils.interpolate( points[ c[ 0 ] ].y, points[ c[ 1 ] ].y, points[ c[ 2 ] ].y, points[ c[ 3 ] ].y, weight );
	
	return v;
};

THREE.Curves.SplineCurve3 = THREE.Curve.create(
	function ( points /* array of Vector3 */) {
		this.points = (points == undefined) ? [] : points;
	},
	function ( t ) {
		var v = new THREE.Vector3();
		var c = [];
		var points = this.points, point, intPoint, weight;
		point = ( points.length - 1 ) * t;

		intPoint = Math.floor( point );
		weight = point - intPoint;

		c[ 0 ] = intPoint == 0 ? intPoint : intPoint - 1;
		c[ 1 ] = intPoint;
		c[ 2 ] = intPoint > points.length - 2 ? points.length - 1 : intPoint + 1;
		c[ 3 ] = intPoint > points.length - 3 ? points.length - 1 : intPoint + 2;

		var pt0 = points[ c[0] ],
		pt1 = points[ c[1] ],
		pt2 = points[ c[2] ],
		pt3 = points[ c[3] ];

		v.x = THREE.Curve.Utils.interpolate(pt0.x, pt1.x, pt2.x, pt3.x, weight);
		v.y = THREE.Curve.Utils.interpolate(pt0.y, pt1.y, pt2.y, pt3.y, weight);
		v.z = THREE.Curve.Utils.interpolate(pt0.z, pt1.z, pt2.z, pt3.z, weight);

		return v;
	}
);


