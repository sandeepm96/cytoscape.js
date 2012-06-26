;(function($, $$){
	
	$$.fn.core({
		
		panningEnabled: function( bool ){
			if( bool !== undefined ){
				this._private.panEnabled = bool ? true : false;
			} else {
				return this._private.panEnabled;
			}
			
			return this; // chaining
		},
		
		zoomingEnabled: function( bool ){
			if( bool !== undefined ){
				this._private.zoomEnabled = bool ? true : false;
			} else {
				return this._private.zoomEnabled;
			}
			
			return this; // chaining
		},
		
		pan: function(){
			var args = arguments;
			var pan = this._private.pan;
			var dim, val, dims, x, y;

			switch( args.length ){
			case 0: // .pan()
				return pan;

			case 1: 

				if( $$.is.string( args[0] ) ){ // .pan("x")
					dim = args[0];
					return pan[ dim ];

				} else if( $$.is.plainObject( args[0] ) ) { // .pan({ x: 0, y: 100 })
					dims = args[0];
					x = dims.x;
					y = dims.y;

					if( $$.is.number(x) ){
						pan.x = x;
					}

					if( $$.is.number(y) ){
						pan.y = y;
					}

					this.trigger("pan");
				}
				break;

			case 2: // .pan("x", 100)
				dim = args[0];
				val = args[1];

				if( (dim === "x" || dim === "y") && $$.is.number(val) ){
					pan[dim] = val;
				}

				this.trigger("pan");
				break;

			default:
				break; // invalid
			}

			return this; // chaining
		},
		
		panBy: function(params){
			var arg = arguments;
			var pan = this._private.pan;
			var dim, val, dims, x, y;

			switch( args.length ){
			case 1: 

				if( $$.is.plainObject( args[0] ) ) { // .panBy({ x: 0, y: 100 })
					dims = args[0];
					x = dims.x;
					y = dims.y;

					if( $$.is.number(x) ){
						pan.x += x;
					}

					if( $$.is.number(y) ){
						pan.y += y;
					}

					this.trigger("pan");
				}
				break;

			case 2: // .panBy("x", 100)
				dim = args[0];
				val = args[1];

				if( (dim === "x" || dim === "y") && $$.is.number(val) ){
					pan[dim] += val;
				}

				this.trigger("pan");
				break;

			default:
				break; // invalid
			}

			return this; // chaining
		},
		
		fit: function( elements ){
			var bb = this.boundingBox( elements );
			var style = this.style();

			var w = parseFloat( style.containerCss("width") );
			var h = parseFloat( style.containerCss("height") );
			var sw, sh; // scaled w & h

			if( !isNaN(w) && !isNaN(h) ){
				var ratio = w/h;
				var bbRatio = bb.w/bb.h;

				if( bbRatio < ratio ){ // then scale to width
					sw = w;
					sh = sw/bbRatio;
				} else { // then scale to height
					sh = h;
					sw = sh * bbRatio;
				}

				this._private.zoom = sh / h;
				this._private.pan = {
					x: (w - sw) / 2,
					y: (h - sh) / 2
				};
			}

			this.trigger("pan zoom");
			return this; // chaining
		},
		
		zoom: function(params){
			var ret = this.renderer().zoom(params);
			
			if( ret != null ){
				return ret;
			} else {
				this.trigger("zoom");
				return this;
			}
		},
		
		// get the bounding box of the elements (in raw model position)
		boundingBox: function( selector ){
			var eles;

			if( !eles ){
				eles = this.$();
			} else if( $$.is.string(selector) ){
				eles = this.$( selector );
			} else if( $$.is.elementOrCollection(selector) ){
				eles = selector;
			}

			var x1 = Infinity;
			var x2 = -Infinity;
			var y1 = Infinity;
			var y2 = -Infinity;

			// find bounds of elements
			for( var i = 0; i < eles.length; i++ ){
				var ele = eles[i];

				if( ele.isNode() ){
					var pos = ele._private.position;
					var x = pos.x;
					var y = pos.y;
					var w = ele.outerWidth();
					var halfW = w/2;
					var h = ele.outerHeight();
					var halfH = h/2;

					var ex1 = x - halfW;
					var ex2 = x + halfW;
					var ey1 = y - halfH;
					var ey2 = y + halfH;

					x1 = ex1 < x1 ? ex1 : x1;
					x2 = ex2 > x2 ? ex2 : x2;
					y1 = ey1 < y1 ? ey1 : y1;
					y2 = ey2 > y2 ? ey2 : y2;
				}
			}

			return {
				x1: x1,
				x2: x2,
				y1: y1,
				y2: y2,
				w: x2 - x1,
				h: y2 - y1
			};
		},

		center: function(elements){
			var bb = this.boundingBox( elements );

			this.pan({ // now pan to middle
				x: (bb.x1 + bb.x2)/2,
				y: (bb.y1 + bb.y2)/2
			});
			
			this.trigger("pan");
			return this; // chaining
		},
		
		reset: function(){
			this.pan({ x: 0, y: 0 });
			this.zoom(1);
			
			this.trigger("zoom");
			this.trigger("pan");
			
			return this; // chaining
		}
	});	
	
})(jQuery, jQuery.cytoscape);
