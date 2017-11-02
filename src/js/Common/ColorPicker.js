$(function() {
	var RootClass = h5.cls.RootClass;

	  /**
		 * 
		 * 
		 * @class h5connect.common.ColorPicker
		 */
	  var ColorPicker = RootClass.extend(function(super_) {
	    return {
	      name: 'h5connect.common.ColorPicker',
	      /**
			 * @lends h5connect.common.ColorPicker#
			 */
	      field: {
	    	  _mainElement: null,
	    	  _ctx: null,
	    	  _canvas: null,
	    	  _imageData: null,
	    	  _centerX: null,
	    	  _centerY: null,
	    	  _radius : null,
	    	  _ring: null,
	    	  _ringX : null,
	    	  _ringY : null,
	    	  _ringWidth : null,
	    	  _bgcolor: null,
	    	  _isSelected: null,
	      },
	      /**
			 * @lends h5connect.common.ColorPicker#
			 */
	      accessor: {

	          /**
				 * @override
				 */
	    	  mainElement: {
	            get: function() {
	              return this._mainElement;
	            },
	            set: function(value) {
	            	this._mainElement = value;
	            }
	          },

	          /**
				 * @override
				 */
	    	  ctx: {
	            get: function() {
	              return this._ctx;
	            },
	            set: function(value) {
	            	this._ctx = value;
	            }
	          },

	          /**
				 * @override
				 */
	    	  canvas: {
	            get: function() {
	              return this._canvas;
	            },
	            set: function(value) {
	            	this._canvas = value;
	            }
	          },

	          /**
				 * @override
				 */
	          radius: {
	            get: function() {
	              return this._radius;
	            },
	            set: function(value) {
	            	this._radius = value;
	            }
	          },

	          /**
				 * @override
				 */
	          centerX: {
	            get: function() {
	              return this._centerX;
	            },
	            set: function(value) {
	            	this._centerX = value;
	            }
	          },

	          /**
				 * @override
				 */
	          centerY: {
	            get: function() {
	              return this._centerY;
	            },
	            set: function(value) {
	            	this._centerY = value;
	            }
	          },

	          /**
				 * @override
				 */
	          bgcolor: {
	            get: function() {
	              return this._bgcolor;
	            },
	            set: function(value) {
	            	this._bgcolor = value;
	            }
	          },

	          /**
				 * @override
				 */
	          isSelected: {
	            get: function() {
	              return this._isSelected;
	            },
	            set: function(value) {
	            	this._isSelected = value;
	            }
	          },

	          /**
				 * @override
				 */
	          ringWidth: {
	            get: function() {
	              return this._ringWidth;
	            },
	            set: function(value) {
	            	this._ringWidth = value;
	            }
	          },

	          /**
				 * @override
				 */
	          ringX: {
	            get: function() {
	              return this._ringX;
	            },
	            set: function(value) {
	            	this._ringX = value;
	            }
	          },

	          /**
				 * @override
				 */
	          ringY: {
	            get: function() {
	              return this._ringY;
	            },
	            set: function(value) {
	            	this._ringY = value;
	            }
	          },

	          /**
				 * @override
				 */
	          imageData: {
	            get: function() {
	              return this._imageData;
	            },
	            set: function(value) {
	            	this._imageData = value;
	            }
	          },

	      },
	      /**
			 * @lends h5connect.common.ColorPicker#
			 */
	      method: {
	        /**
			 * ファクトリのインスタンスを生成する。
			 * 
			 * @memberOf h5connect.common.ColorPicker
			 * @method
			 * @name create
			 * @param
			 * @returns {h5connect.common.ColorPicker} 生成されたインスタンス。
			 */
	        constructor: function ColorPicker(options) {
	        	super_.constructor.call(this);
				this.mainElement = document.createElement("span");
				this.mainElement.className = "main-wheel";

	        	this.isSelected = false;

				// create wheel color
	        	this.canvas = document.createElement("canvas");
	        	this.ctx = this.canvas.getContext('2d');
	        	this.setOptions(options);
	        	this.mainElement.appendChild(this.canvas);

	        	// create wheel data
	        	this.imageData = this.createImageData();

	        	// create ring picker
// this.ring = document.createElement("span");
// this.setRingWheel(options);
// this.mainElement.appendChild(this.ring)
    			this.render();
	        },

		    dispose: function() {
		    	this.mainElement.parentNode.removeChild(this.mainElement);
		    	this.mainElement = null;
		    },

	        setOptions: function(options){
	        	this.bgcolor = options.bgcolor || '';
	        	this.canvas.width = options.width;
	        	this.canvas.height = options.height;
	        	this.ctx.canvas.width = options.width;
	        	this.ctx.canvas.height = options.height;
	        	this.centerX = options.centerX || options.width / 2;
	        	this.centerY = options.centerY ||  options.height / 2;
	        	this.radius = options.radius ||  Math.min(options.width, options.height) / 2;
				this.ringWidth = options.ringWidth || Math.min(options.width, options.height) / 20;
	        	this.ringX = options.ringX || options.width / 2;
	        	this.ringY = options.ringY || options.height / 2;

	        },

		    render: function(){
		    	// draw color wheel
		    	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		        this.ctx.putImageData(this.imageData, (this.canvas.width / 2) - this.radius, (this.canvas.height / 2) - this.radius);

		        // draw border
		        this.ctx.shadowColor = 'white';
		        this.ctx.shadowOffsetX = 0;
		        this.ctx.shadowOffsetY = 0;
		        this.ctx.shadowBlur = 5;
		        this.ctx.lineWidth = 2;
		        this.ctx.beginPath();
		        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI, false);
		    	this.ctx.closePath();
		        this.ctx.stroke();
		        this.ctx.save();

		        // draw picker
		    	var lw = Math.round(this.ringWidth / 6.6667, 0);
		    	this.ctx.restore();
		    	this.ctx.lineWidth = lw;
		    	this.ctx.beginPath();
		    	this.ctx.arc(this.ringX, this.ringY, this.ringWidth, 0, 2 * Math.PI, false);
		    	this.ctx.closePath();
		    	this.ctx.fillStyle = 'rgba(0, 0, 0, 0)';
		    	this.ctx.fill();
		    	this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.7)';
		    	this.ctx.stroke();
	        },

		    createImageData: function() {
		        var radius = this.radius;
		        let image = this.ctx.createImageData(radius * 2, radius * 2);
		        let data = image.data;
		        let x, v;
		        for (x = -radius; x < radius; x++) {
				  for (y = -radius; y < radius; y++) {

					  let polar = this._xy2polar(x, y);
					  let r = polar[0];
					  let phi = polar[1];
					  if (r > radius) {
					      // skip all (x,y) coordinates that are outside of
							// the circle
						  continue;
					  }

					  let deg = this._rad2deg(phi);

					  let hue = deg;
					  let saturation = r / radius;
					  let value = 1.0;

					  let color = this._hsv2rgb(hue, saturation, value);
					  let alpha = 255;

					  // Figure out the starting index of this pixel in the
						// image data array.
					  let rowLength = 2*radius;
					  let adjustedX = x + radius; // convert x from [-50, 50]
													// to [0, 100] (the
													// coordinates of the image
													// data array)
					  let adjustedY = y + radius; // convert y from [-50, 50]
													// to [0, 100] (the
													// coordinates of the image
													// data array)
					  let pixelWidth = 4; // each pixel requires 4 slots in
											// the data array
					  let index = (adjustedX + (adjustedY * rowLength)) * pixelWidth;

					  data[index] = color[0];
					  data[index+1] = color[1];
					  data[index+2] = color[2];
					  data[index+3] = alpha;
				  }
		        }
		        return image;
		    },

		    getMousePos: function(event){
		    	var rect = this.canvas.getBoundingClientRect();
		    	return {
		    		x: event.clientX - rect.left,
	    			y: event.clientY - rect.top
		    	}
	        },

		    getTouchPos: function(touch){
		    	var rect = this.canvas.getBoundingClientRect();
		    	return {
		    		x: touch.pageX - rect.left,
	    			y: touch.pageY - rect.top
		    	}
	        },

	        getPickedColor: function(){
		    	if(!this.ctx){
		    		return null;
		    	}
	        	var imageData = this._ctx.getImageData(this.ctx.ringX, this.ctx.ringY, 1, 1);
	        	var color = {};
	        	color.r = imageData.data[0];
	        	color.g = imageData.data[1];
	        	color.b = imageData.data[2];
	        	return color;
	        },

	        getPickedColorHex: function(){
		    	if(!this.ctx){
		    		return null;
		    	}
	        	var imageData = this._ctx.getImageData(this.ringX, this.ringY, 1, 1);
	        	var color = {};
	        	color.r = imageData.data[0];
	        	color.g = imageData.data[1];
	        	color.b = imageData.data[2];

	        	return this._convertColorToHex(color);
	        },

	        checkIsSelected: function(xMouse, yMouse){
	        	if(Math.pow(this.ringX - xMouse, 2) + Math.pow(this.ringY - yMouse, 2) <= Math.pow(this.ringWidth, 2)){
	        		this.isSelected = true
	        	} else {
	        		this.isSelected = false;
	        	}

	        },

			// rad in [-π, π] range
			// return degree in [0, 360] range
			_rad2deg : function(rad) {
			    return ((rad + Math.PI) / (2 * Math.PI)) * 360;
			},

			_xy2polar : function(x, y) {
			    let r = Math.sqrt(x*x + y*y);
			    let phi = Math.atan2(y, x);
			    return [r, phi];
			},

			// hue in range [0, 360]
			// saturation, value in range [0,1]
			// return [r,g,b] each in range [0,255]
			// See: https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV
			_hsv2rgb : function(hue, saturation, value) {
			    let chroma = value * saturation;
			    let hue1 = hue / 60;
			    let x = chroma * (1- Math.abs((hue1 % 2) - 1));
			    let r1, g1, b1;
			    if (hue1 >= 0 && hue1 <= 1) {
			    	r1 = chroma;
			    	g1 = x;
			    	b1 = 0;
			    } else if (hue1 >= 1 && hue1 <= 2) {
			    	r1 = x;
			    	g1 = chroma;
			    	b1 = 0;
			    } else if (hue1 >= 2 && hue1 <= 3) {
			    	r1 = 0;
			    	g1 = chroma;
			    	b1 = x;
			    } else if (hue1 >= 3 && hue1 <= 4) {
			    	r1 = 0;
			    	g1 = x;
			    	b1 = chroma;
			    } else if (hue1 >= 4 && hue1 <= 5) {
			    	r1 = x;
			    	g1 = 0;
			    	b1 = chroma;
			    } else if (hue1 >= 5 && hue1 <= 6) {
			    	r1 = chroma;
			    	g1 = 0;
			    	b1 = x;
			    }

			    let m = value - chroma;
			    let color = [r1+m, g1+m, b1+m];
			    return [255 * color[0], 255 * color[1], 255 * color[2]];
			},
			_zeroPadding: function(value){
	    		if(value.length === 1){
	    			return '0' + value;
	    		} else {
	    			return value;
	    		}

			},
			_convertColorToHex: function(color){
	    		var hexColor = '';
	    		hexColor += this._zeroPadding(color.r.toString(16));
	    		hexColor += this._zeroPadding(color.g.toString(16));
	    		hexColor += this._zeroPadding(color.b.toString(16));
	    		return hexColor;

			},
	      }
	    }
	  });

	  h5.u.obj.expose("h5connect.common", {
		  ColorPicker: ColorPicker,
	  });
});