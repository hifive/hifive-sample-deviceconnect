$(function() {
	var Utils = h5connect.common.Utils;
	var ColorPicker = h5connect.common.ColorPicker;
	var LightConnector = h5connect.connector.LightConnector;
	var LightModel = h5connect.model.LightModel;

	var CONST_CIRCLE_RADIUS = 140;
	var HueController = {
		__name : "h5connect.controller.HueController",

		connector : null,

		/**
		 * @private
		 * @type {h5connect.common.dconnectcontroller}
		 */
		dConnect : h5connect.common.dconnect,

		loading : null,

		/**
		 * @private
		 * @type {Service}
		 */
		service : null,

		listLight : null,

		currCtrLight : null,

		changeRequestInterval : null,

		isSmooth : null,
		/**
		 * @private
		 * @type {h5connect.common.ColorPicker}
		 */
		colorPicker : null,

		__init : function() {
			// init Dconnect
			if (this.dConnect.initialized != INITIALIZED) {
				var param = {};
				param.appName = APP_NAME
				param.scopes = SCOPES;
				this.dConnect.initialize(param);
			}

			this.connector = LightConnector.create();
			this.listLight = [];
			if (!this.colorPicker
					|| !$('#manual_content').has(this.colorPicker.mainElement)) {
				this.colorPicker = ColorPicker.create({
					width : 300,
					height : 300,
					radius : CONST_CIRCLE_RADIUS
				});
			}
		},

		__ready : function() {
			$('#hue_content').append(this.colorPicker.mainElement);
			this.loading = this.indicator();
			this.requestDevices();
			$(this.rootElement).show();
		},

		requestDevices : function() {
			var that = this;
			this.loading.show();
			var promise = this.dConnect.searchDeviceFromProfile("light");
			promise.done(function(json) {
				if (json.result == 0) {
					// that.showDevices(json.services);
					var i = 0;
					for (i = 0; i < json.services.length; i++) {
						var service = json.services[i];
						if (service.name.toLowerCase().indexOf('hue') !== -1) { // &&
																				// service.online
							that.service = service;
							that.requestLights();
							return;
						}
					}

					// if cannot get any devices then throw error
					that.loading.hide();
					alert("母艦がみつかれません");
				} else {
					that.loading.hide();
					var errorCode = json.errorCode;
					var errorMsg = json.errorMsg;
					alert('Error:' + errorCode + ':' + errorMsg);
					var confirm = confirm("Do you want retry?");

					if (confirm("Do you want retry?")) {
						that.requestDevices();
					}
				}

			});
			promise.fail(function(error) {
				if (error.errorCode == 12 || error.errorCode == 13
						|| error.errorCode == 15) {
					var promise = that.dConnect.authorization();
					promise.done(function() {
						// request again
						that.requestDevices();
					});
				} else {
					that.loading.hide();
					alert('Error: code=' + error.errorCode + ', messsage=\"'
							+ error.errorMessage + '\"');

					if (confirm("Do you want retry?")) {
						that.requestDevices();
					}
				}
			});
		},

		/**
		 * 
		 * 
		 * @ignore
		 * @param {EventContext}
		 *            context
		 */
		requestLights : function() {
			var that = this;

			var promise = this.connector.requestIOTList(this.service.id,
					this.dConnect.accessToken);
			promise.done(function(json) {
				if (json.length > 0) {

					that.showLights(json);
					$.mobile.changePage($('#hue_light'), {
						transition : "slidefade"
					});
				} else {
					alert("ライトが見つかれません");
				}
				that.loading.hide();

			});
			promise.fail(function(error) {
				that.loading.hide();
				alert('Error: Code ' + error.errorCode + ' :'
						+ error.errorMessage);
			});

		},

		showDevices : function(devices) {
			if (devices.length == 0) {
				return;
			}
			var str = '';
			var i;
			for (i = 0; i < devices.length; i++) {
				var device = devices[i];
				str += '<a href="#" class="hue-item" data-service-id="'
						+ device.id + '" data-service-name="' + device.name
						+ '">';
				str += '<img src="./src/res/hue_bridge.png"/>';
				str += '<figcaption>';
				str += '<div>' + device.name + '</div>';
				str += '</figcaption>';
				str += '</a>';
			}
			$('#hue_devices').html(str);
		},

		showLights : function(lights) {
			if (lights.length == 0) {
				return;
			}
			var str = '';
			var i;
			for (i = 0; i < lights.length; i++) {
				var light = LightModel.create(lights[i]);
				this.listLight[light.id] = light;
				str += '<a href="#" class="light-item" data-light-id="'
						+ light.id + '">';
				str += '<img src="./src/res/hue_light.png"/>';
				str += '<figcaption>';
				str += '<div>' + light.name + '</div>';
				str += '</figcaption>';
				str += '</a>';
			}
			$('#light_list').html(str);
		},

		loadLight : function() {
			if (this.currCtrLight.isOn) {
				$('.flipswitch').prop("checked", true).flipswitch('refresh');
			} else {
				$('.flipswitch').prop("checked", false).flipswitch('refresh');
			}
			if (this.currCtrLight.brightness
					&& isNaN(this.currCtrLight.brightness)) {
				$('.slider_alpha').val(this.currCtrLight.brightness * 100)
			}

		},

		/**
		 * 
		 * 
		 * @ignore
		 * @param {EventContext}
		 *            context
		 */
		// '.hue-item click': function(context) {
		loadHueBrige : function(servId, servName) {
			var that = this;

			var promise = this.dConnect.getServiceInfo(servId, servName);
			this.loading.show();
			promise.done(function(json) {
				if (json.result == 0) {
					var service = that.dConnect.getServiceById(servId);
					that.service = service
					that.requestLights();

					$.mobile.changePage($('#hue_light'), {
						transition : "slide"
					});
				} else {
					var errorCode = json.errorCode;
					var errorMsg = json.errorMsg;
					console.log('Error:' + errorCode + ':' + errorMsg);
				}
				that.loading.hide();

			});
			promise.fail(function(error) {
				console.log('Error: Code ' + error.errorCode + ' :'
						+ error.errorMessage);
				that.loading.hide();
			});

		},

		'#refreshBtn click' : function() {
			this.loading.show();
			this.requestDevices();
		},

		/**
		 * 
		 * 
		 * @ignore
		 * @param {EventContext}
		 *            context
		 */
		'.light-item click' : function(context) {
			var that = this;
			var lightId = context.event.currentTarget.dataset.lightId;
			this.currCtrLight = this.listLight[lightId];
			if (this.currCtrLight != null) {
				$.mobile.changePage($('#hue_control'), {
					transition : "slide"
				});
				this.loadLight()
			}
		},

		'.flipswitch change' : function(e) {
			var that = this;
			if (this.connector != null && this.currCtrLight != null) {
				var $flipswitch = $(e.event.target);
				var state = $flipswitch.prop('checked') ? 'on' : 'off';
				if (state === 'on') {
					var promise = this.connector.requestLightOn(
							this.service.id, this.dConnect.accessToken,
							this.currCtrLight);
					promise.done(function(json) {
						that.currCtrLight.isOn = true;
						console.log(json.result);
					});
					promise.fail(function(error) {
						console.log(error);
						$('.flipswitch').val("off").flipswitch('refresh');
					});
				} else if (state == 'off') {
					var promise = this.connector.requestLightOff(
							this.service.id, this.dConnect.accessToken,
							this.currCtrLight);
					promise.done(function(json) {
						that.currCtrLight.isOn = false;
						console.log(json.result);
					});
					promise.fail(function(error) {
						console.log(error);
						$('.flipswitch').val("on").flipswitch('refresh');
					});
				}

			}

		},

		'.slider_alpha change' : function(e) {
			if (this.connector != null && this.currCtrLight != null
					&& this.currCtrLight.isOn) {
				var that = this;
				var $slider = $(e.event.target);
				var brigthness = $slider.val() / 100;

				var promise = this.connector.requestLightChangeStatus(
						this.service.id, this.dConnect.accessToken,
						this.currCtrLight, {
							'brightness' : brigthness
						});
				promise.done(function(json) {
					if (that.device) {
						that.device.brightness = brightness;
					}
					console.log(json.result);
				});
				promise.fail(function(error) {
					console.log(error);
				});
			}

		},

		moveRing : function(posX, posY) {
			var mx = posX - this.colorPicker.centerX;
			var my = posY - this.colorPicker.centerY;
			var len = Math.pow(mx, 2) + Math.pow(my, 2);
			var radius = Math.pow(this.colorPicker.radius, 2);
			var angle = Math.atan2(mx, my);
			if (len <= radius) {
				this.colorPicker.ringX = posX;
				this.colorPicker.ringY = posY;
				this.colorPicker.isSelected = true;
			} else if (this.colorPicker.isSelected) {
				this.colorPicker.ringX = this.colorPicker.centerX
						+ this.colorPicker.radius * Math.sin(angle);
				this.colorPicker.ringY = this.colorPicker.centerY
						+ this.colorPicker.radius * Math.cos(angle);

			}
			this.colorPicker.render();
		},

		'#hue_content mousedown' : function(e) {
			if ($('#manual_content').has(this.colorPicker.mainElement)) {
				var mouse = this.colorPicker.getMousePos(e.event);
				this.colorPicker.checkIsSelected(mouse.x, mouse.y);
				if (!this.colorPicker.isSelected) {
					this.moveRing(mouse.x, mouse.y);
				}
			}
		},

		'#hue_content touchstart' : function(e) {
			if ($('#manual_content').has(this.colorPicker.mainElement)) {
				var touch = this.colorPicker
						.getTouchPos(e.event.originalEvent.touches[0]);
				this.colorPicker.checkIsSelected(touch.x, touch.y);
				if (!this.colorPicker.isSelected) {
					this.moveRing(touch.x, touch.y);
				}
			}
		},

		'#hue_content mousemove' : function(e) {
			if (this.colorPicker.isSelected
					&& $('#manual_content').has(this.colorPicker.mainElement)) {
				var mouse = this.colorPicker.getMousePos(e.event);

				if (this.colorPicker.isSelected) {
					this.moveRing(mouse.x, mouse.y);

					var color = this.colorPicker.getPickedColorHex();
					this.changeStatus(color);
				}
			}
		},

		'#hue_content touchmove' : function(e) {
			if (this.colorPicker.isSelected
					&& $('#manual_content').has(this.colorPicker.mainElement)) {
				var touch = this.colorPicker
						.getTouchPos(e.event.originalEvent.touches[0]);

				if (this.colorPicker.isSelected) {
					this.moveRing(touch.x, touch.y);
					var color = this.colorPicker.getPickedColorHex();
					console.log(color);
					this.changeStatus(color);
				}
			}
		},
		changeStatus : function(color) {
			var that = this;
			if (this.connector != null && this.currCtrLight != null) {
				var promise = this.connector.requestLightChangeStatus(
						this.service.id, this.dConnect.accessToken,
						this.currCtrLight, {
							'color' : color
						});
				promise.done(function(json) {
					if (that.device) {
						that.device.color = color;
					}
					console.log(json.result);
				});
				promise.fail(function(error) {
					console.log(error);
				});
			}
		},

		'#hue_content mouseup' : function() {
			var that = this;
			if (this.colorPicker.isSelected
					&& $('#manual_content').has(this.colorPicker.mainElement)) {

				this.colorPicker.isSelected = false;

				var color = this.colorPicker.getPickedColorHex();
				this.changeStatus(color);
			}

		},

		'#hue_content touchend' : function() {
			var that = this;
			if (this.colorPicker.isSelected
					&& $('#manual_content').has(this.colorPicker.mainElement)) {

				this.colorPicker.isSelected = false;

				var color = this.colorPicker.getPickedColorHex();
				this.changeStatus(color);
			}

		},

		'#homeBtn click' : function(context, $element) {
			var ip = Utils.getUrlParam('ip', null);
			var app = context.event.currentTarget.getAttribute("value");
			var uri = "index.html";
			uri += ip ? '?ip=' + ip : '';
			window.location = uri;
		},
	};

	h5.core.controller('body', HueController);
});
