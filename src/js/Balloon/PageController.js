$(function() {

	var SCOPES = Array("battery", "connect", "deviceorientation",
			"fileDescriptor", "file", "mediaPlayer", "mediastreamRecording",
			"notification", "phone", "proximity", "settings", "vibration",
			"light", "remoteController", "driveController", "mhealth",
			"sphero", "dice", "temperature", "camera", "serviceinformation",
			"servicediscovery");
	var IOTFactory = h5connect.model.IOTFactory;

	var LightConnector = h5connect.connector.LightConnector;

	var Utils = h5connect.common.Utils;
	var pageController = {
		__name : 'pump.controller.PageController',
		pumpController : pump.controller.PumpController,
		loading : null,
		_shooSound : null,
		_bangSound : null,
		_count : 0,
		_$counter : null,
		_$descriptionContainer : null,
		_$messageContainer : null,

		/**
		 * @private
		 * @type {h5connect.common.dconnectcontroller}
		 */
		dConnect : h5connect.common.dconnect,
		service : null,

		connector : null,

		lightDevices : null,

		iotFactory : null,

		__postInit : function() {
			this.loading = this.indicator();
			this.connector = LightConnector.create();
			this.iotFactory = IOTFactory.create('IOTObject');
			this.iotFactory.register('light', h5connect.model.LightModel);
			this.lightDevices = [];
		},

		__ready : function() {
			this._shooSound = document.getElementById('shooSound');
			this._bangSound = document.getElementById('bangSound');
			// jQueryオブジェクトをキャッシュする
			this._$descriptionContainer = this.$find('#descriptionContainer');
			this._$messageContainer = this.$find('#messageContainer');
			this._$counter = this.$find('#counter');

			this._count = h5.api.storage.local.getItem('count');
			if (!this._count) {
				this._count = 0;
			}
			this._showCount();

			this.connectDevice();

			// スクロールを無効にする
			$(window).on('touchmove.noScroll', function(e) {
				e.preventDefault();
			});
		},

		connectDevice : function() {
			this.loading.show();

			if (this.dConnect.initialized != INITIALIZED) {
				var param = {};
				param.appName = APP_NAME
				param.scopes = SCOPES;
				this.dConnect.initialize(param);
			}

			var that = this;
			var promise = this.dConnect.startManager();
			promise.done(function(apiVersion) {
				that.requestDevices();
			});
			promise
					.fail(function(error) {
						that.loading.hide();
						if (confirm('Failed to get connect device. Do you try again?')) {
							that.connectDevice();
							return;
						}
					});
		},

		// requestDevices: function(){
		// var that = this;
		//
		// var promise = this.dConnect.searchDeviceFromProfile("light");
		// promise.done(function(json){
		// if(json.result == 0){
		// for(i = 0; i < json.services.length; i++){
		// var service = json.services[i];
		// // get brige info by MAC Adress
		// if(service.name.indexOf('hue') !== -1){ // && service.online
		// that.service = service;
		// that.getServiceInfo(service.id, service.name);
		// return;
		// }
		// }
		// } else {
		// var errorCode = json.errorCode;
		// var errorMsg = json.errorMsg;
		// console.log('Error:' + errorCode + ':' + errorMsg );
		// }
		// that.loading.hide();
		// });
		// promise.fail(function(error){
		// if (error.errorCode == 12 || error.errorCode == 13 || error.errorCode
		// == 15) {
		// // auto authorization
		// var promise = that.dConnect.authorization();
		// promise.done(function() {
		// // request again
		// that.requestDevices();
		// });
		// } else {
		// console.log('Error: code=' + error.errorCode + ', messsage=\"' +
		// error.errorMessage + '\"');
		// }
		// that.loading.hide();
		// });
		// },
		//
		// getServiceInfo: function(servId, servName){
		// var that = this;
		// var promise = this.dConnect.getServiceInfo(servId, servName);
		// promise.done(function(json){
		// if(json.result == 0){
		// for(i = 0; i < json.supports.length; i++){
		// var profile = json.supports[i];
		// // get brige info by MAC Adress
		// if(profile.indexOf('light') !== -1){
		// that.getDeviceInfo(servId, profile);
		// return;
		// }
		// }
		// } else {
		//
		// that.loading.hide();
		// var errorCode = json.errorCode;
		// var errorMsg = json.errorMsg;
		// // alert('Error:' + errorCode + ':' + errorMsg );
		// }
		// });
		// promise.fail(function(error){
		// // alert('Error: Code ' + error.errorCode + ' :' + error.errorMessage
		// );
		// that.loading.hide();
		// });
		// },
		//
		// getDeviceInfo: function(servId, profile){
		// var that = this;
		// var promise = this.connector.requestIOTList(servId,
		// this.dConnect.accessToken);
		// promise.done(function(json){
		// that.createIOTDevices(profile, json);
		// // this.loading.hide();
		// });
		// promise.fail(function(error){
		// that.loading.hide();
		// alert('Error: code=' + error.errorCode + ', messsage=\"' +
		// error.errorMessage + '\"');
		//
		// if(confirm("Do you want retry?")){
		// that.requestDevices();
		// }
		// // alert('Error: Code ' + error.errorCode + ' :' + error.errorMessage
		// );
		// });
		// },

		requestDevices : function() {
			var that = this;
			this.loading.show();
			var promise = this.dConnect.searchDeviceFromProfile("light");
			promise.done(function(json) {
				if (json.result == 0) {
					var i = 0;
					for (i = 0; i < json.services.length; i++) {
						var service = json.services[i];
						// get brige info by MAC Adress
						if (service.name.toLowerCase().indexOf('hue') !== -1) {
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
					alert('Error:' + json.errorCode + ':' + json.errorMsg);
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

					// that.showLights(json);
					that.createIOTDevices("light", json);
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

		createIOTDevices : function(type, devices) {
			if (devices.length == 0) {
				alert("ライトが見つかれません");
				return;
			}
			for (i = 0; i < devices.length; i++) {
				var deviceInfo = devices[i];
				var light = this.iotFactory.createObject("light", deviceInfo);
				this.lightDevices[light.id] = light;

				if (light.isOn) {
					var promise = this.connector.requestLightOff(
							this.service.id, this.dConnect.accessToken, light);
					promise.done(function(json) {
						light.isOn = false;
					});

					promise.fail(function(error) {
						// alert(error);
					});
				}
			}

			this.loading.hide();
		},

		'#startButton click' : function(context, $el) {
			// ユーザインタラクションでloadすれば、どこでも音声を再生できるようになる
			this._shooSound.load();
			this._bangSound.load();
			this.log.debug(this._shooSound);
			// バルーン表示
			this._$descriptionContainer.addClass('hidden');
			this.trigger('showBalloon');

			for ( var lightId in this.lightDevices) {
				var light = this.lightDevices[lightId];
				if (!light.isOn) {
					// Turn on light with lowest brighnest
					light.brightness = 0.01;
					var promise = this.connector.requestLightOn(
							this.service.id, this.dConnect.accessToken, light);
					promise.done(function(json) {
						light.isOn = true;
						console.log(json.result);
					});
					promise.fail(function(error) {
						// alert(error);
					});
				}
			}

		},

		'#restartButton click' : function(context, $el) {
			// バルーン表示
			this._$messageContainer.addClass('hidden');
			this.trigger('showBalloon');

			for ( var lightId in this.lightDevices) {
				var light = this.lightDevices[lightId];
				if (light.isOn) {
					// Turn on light with lowest brighnest
					light.brightness = 0.01;
					var promise = this.connector.requestLightChangeStatus(
							this.service.id, this.dConnect.accessToken, light);
					promise.done(function(json) {
						light.isOn = true;
						console.log(json.result);
					});
					promise.fail(function(error) {
						// alert(error);
					});
				}
			}
		},

		'#counter click' : function() {
			if (confirm('カウンターをリセットしますか？')) {
				h5.api.storage.local.removeItem('count');
				this._count = 0;
				this.log.debug(this._count);
				this._showCount();
				alert('リセットしました');
			}
		},

		'{rootElement} bang' : function() {
			// restartButton表示
			this._$messageContainer.removeClass('hidden');
			this._count++;
			this._showCount();
			h5.api.storage.local.setItem('count', this._count);
			var colors = [];
			colors.push("c9f6ff");
			colors.push("ffa080");
			colors.push("ec3e04");
			colors.push("215d52");
			colors.push("fe7722");
			colors.push("db81b7");
			colors.push("c9f6ff");
			colors.push("ffa080");
			colors.push("ec3e04");
			colors.push("215d52");
			colors.push("fe7722");
			colors.push("db81b7");
			colors.push("ffffff");
			var i, lightId;
			for (i = 0; i < colors.length; i++) {
				for (lightId in this.lightDevices) {
					var light = this.lightDevices[lightId];
					setTimeout(this.changeColor(light, colors[i]), 2000 * i);
				}
			}
		},
		changeColor : function(light, color) {
			console.log(color);
			var promise = this.connector.requestLightChangeStatus(
					this.service.id, this.dConnect.accessToken, light, {
						'color' : color,
						'flashing' : '50,50,50,50,50'
					});
			promise.done(function(json) {
				console.log(json.result);
			});
			promise.fail(function(error) {
				console.log(error);
			});
		},
		'{rootElement} bright' : function(context, $el) {

			var brightness = context.evArg.pumpPercen;
			console.log(brightness);
			for ( var lightId in this.lightDevices) {
				var light = this.lightDevices[lightId];

				var promise = this.connector.requestLightChangeStatus(
						this.service.id, this.dConnect.accessToken, light, {
							'brightness' : brightness
						});
				promise.done(function(json) {
					if (light) {
						light.brightness = brightness;
					}
					console.log(json.result);
				});
				promise.fail(function(error) {
					console.log(error);
				});
			}
			this.log.debug(this._count);
		},
		_showCount : function() {
			this.log.debug(this._count);
			this._$counter.text(this._count);
		},

		'#homeBtn click' : function(context, $element) {
			var ip = Utils.getUrlParam('ip', null);
			var app = context.event.currentTarget.getAttribute("value");
			var uri = "index.html";
			uri += ip ? '?ip=' + ip : '';
			window.location = uri;
		},
	};
	h5.core.controller('body', pageController);
});
