var NOT_INITIALIZED = 0;
var INITIALIZE_CALLED = 1;
var INITIALIZED = 2;
var SCOPES = Array("battery", "mediastreamRecording", "light", "battery",
		"fileDescriptor", "file", "settings", "serviceinformation",
		"servicediscovery");
var APP_NAME = "HIFIVE DCONNECT"
$(function() {
	var RootClass = h5.cls.RootClass;
	var Utils = h5connect.common.Utils;

	/**
	 * 
	 * 
	 * @class h5connect.common.DConnect
	 */
	var DConnect = RootClass
			.extend(function(super_) {
				return {
					name : "h5connect.common.dconnect",
					/**
					 * @lends h5connect.common.DConnect#
					 */
					field : {
						/**
						 * 初期化済みフラグ。
						 * 
						 * @private
						 * @type {Number}
						 */
						_initialized : 0,

						/**
						 * @private
						 * @type {String}
						 */
						_ip : null,

						/**
						 * @private
						 * @type {String}
						 */
						_appName : null,

						/**
						 * @private
						 * @type {String}
						 */
						_apiVersion : null,

						/**
						 * @private
						 * @type {String}
						 */
						_scopes : null,

						/**
						 * @private
						 * @type {String}
						 */
						_currentClientId : null,

						/**
						 * @private
						 * @type {String}
						 */
						_accessToken : null,

						/**
						 * ServicesChangeEventの登録状態
						 * 
						 * @private
						 * @type {Boolean}
						 */
						_isServChangeEvtRegistered : false,

						_cachedServices : null,

					},
					/**
					 * @lends h5connect.common.DConnect#
					 */
					accessor : {
						/**
						 * @override
						 */
						ip : {
							get : function() {
								return this._ip;
							},
							set : function(value) {
								this._ip = value;
							}
						},

						/**
						 * @override
						 */
						appName : {
							get : function() {
								return this._appName;
							},
							set : function(value) {
								this._appName = value;
							}
						},
						/**
						 * @override
						 */
						apiVersion : {
							get : function() {
								return this._apiVersion;
							},
							set : function(value) {
								this._apiVersion = value;
							}
						},

						/**
						 * @override
						 */
						scopes : {
							get : function() {
								return this._scopes;
							},
							set : function(_value) {
								this._scopes = value;
							}
						},

						/**
						 * @override
						 */
						accessToken : {
							get : function() {
								return this._accessToken;
							},
							set : function(value) {
								this._accessToken = value;
							}
						},

						/**
						 * @override
						 */
						currentClientId : {
							get : function() {
								return this._currentClientId;
							},
							set : function(value) {
								this._currentClientId = value;
							}
						},

						/**
						 * @override
						 */
						initialized : {
							get : function() {
								return this._initialized;
							},
							set : function(value) {
								this._initialized = value;
							}
						},

						/**
						 * @override
						 */
						services : {
							get : function() {
								return this._cachedServices;
							},
							set : function(value) {
								this._cachedServices = value;
							}
						},
					},
					/**
					 * @lends h5connect.common.DConnect#
					 */
					method : {
						/**
						 * ファクトリのインスタンスを生成する。
						 * 
						 * @memberOf h5connect.common.DConnect
						 * @method
						 * @name create
						 * @param
						 * @returns {h5connect.common.DConnect} 生成されたインスタンス。
						 */
						constructor : function DConnect(params) {
							super_.constructor.call(this);

							this._initialized = NOT_INITIALIZED;
							this._cachedServices = [];
						},

						initialize : function(params) {

							if (this._initialized !== NOT_INITIALIZED) {
								throw new Error('既に初期化されています。');
							}
							this._initialized = INITIALIZE_CALLED;
							this._scopes = params.scopes;
							this._appName = params.appName;

							// 接続先ipアドレスを取得(指定がない場合は、localhost)
							this._ip = Utils.getUrlParam('ip', 'localhost')

							// accessTokenをcookieから取得
							this._accessToken = this._loadAccessToken();

							if (this._isAndroid()
									&& location.href.indexOf('file:///') == -1) {
								dConnect.setAntiSpoofing(true);
							}
							// ファイルから直接開かれた場合には、originを格納
							if (location.origin == 'file://') {
								dConnect.setExtendedOrigin('file://');
							}
							dConnect.setHost(this._ip);
							dConnect.setPort(8888);
							dConnect
									.setSSLEnabled(location.protocol === 'https:');
							// this._openWebsocketIfNeeded(this._accessToken);

						},

						/**
						 * Device Connect Managerを停止後、トップ画面に戻る.
						 */
						startManager : function() {
							return this.checkDeviceConnect();
						},

						/**
						 * Device Connect Managerを停止後、トップ画面に戻る.
						 */
						stopManager : function() {
							dConnect.stopManager('activity');
						},

						/**
						 * Device Connect Managerが起動していることを確認する.
						 * 
						 * @param {function}
						 *            callback すでに起動していた場合、または起動された場合に呼ばれる関数
						 */
						checkDeviceConnect : function() {
							var deffered = h5.async.deferred();
							var appId = '994422987';
							var requested = false;
							var that = this;
							var callback = function(apiVersion) {
								that.apiVersion = apiVersion;
								deffered.resolve(apiVersion);
							}
							var errorCallback = function(errorCode,
									errorMessage) {
								switch (errorCode) {
								case dConnect.constants.ErrorCode.ACCESS_FAILED:
									if (!requested) {
										requested = true;
										dConnect.startManager('activity');

										var userAgent = navigator.userAgent
												.toLowerCase();
										if (userAgent
												.search(/iphone|ipad|ipod/) > -1) {
											setTimeout(
													function() {
														location.href = 'itmss://itunes.apple.com/us/app/devicewebapibrowser/id'
																+ appId
																+ '?mt=8&ign-mpt=uo%3D4';
													}, 250);
										}
									}
									// setTimeout(function() {
									// dConnect.checkDeviceConnect(callback,
									// errorCallback);
									// }, 500);
									break;
								case dConnect.constants.ErrorCode.INVALID_SERVER:
									console
											.log('WARNING: Device Connect Manager may be spoofed.');
									break;
								case dConnect.constants.ErrorCode.INVALID_ORIGIN:
									console
											.log('WARNING: Origin of this app is invalid. Maybe the origin is not registered in whitelist.');
									break;
								default:
									console.log(errorMessage);
									break;
								}
								var error = {
									errorCode : errorCode,
									errorMessage : errorMessage
								}
								deffered.reject(error);
							};

							dConnect
									.checkDeviceConnect(callback, errorCallback);
							return deffered;
						},

						/**
						 * Local OAuthのアクセストークンを取得する.
						 */
						authorization : function() {
							var deffered = h5.async.deferred();
							var that = this;
							dConnect.authorization(this._scopes, this._appName,
									function(clientId, newAccessToken) {
										// Client ID
										currentClientId = clientId;

										// accessToken
										that._accessToken = newAccessToken;

										// debug log
										console.log('accessToken: '
												+ newAccessToken);

										// add cookie
										that._storeAccessToken(newAccessToken);

										// that._reopenWebSocket(newAccessToken);

										deffered.resolve(newAccessToken);

										this.initialized = INITIALIZED;
									}, function(errorCode, errorMessage) {
										var error = {
											errorCode : errorCode,
											errorMessage : errorMessage
										}
										deffered.reject(error);
										console.log('Error: code=' + errorCode
												+ ', messsage=\"'
												+ errorMessage + '\"');
									});
							return deffered;
						},

						searchDeviceFromProfile : function(profileName) {
							var deffered = h5.async.deferred();
							var that = this;
							dConnect.setHost(this._ip);
							dConnect.discoverDevicesFromProfile(profileName,
									this.accessToken, function(json) {
										that._cachedServices = json.services;
										that.registerStatusChangeEvent();
										deffered.resolve(json);
									}, function(errorCode, errorMessage) {
										var error = {
											errorCode : errorCode,
											errorMessage : errorMessage
										}
										deffered.reject(error);
									});
							return deffered;
						},

						/**
						 * デバイスの検索
						 */
						searchDevice : function() {

							var deffered = h5.async.deferred();
							var that = this;
							dConnect.setHost(this._ip);
							dConnect.discoverDevices(this.accessToken,
									function(json) {
										that._cachedServices = json.services;
										that.registerStatusChangeEvent();
										deffered.resolve(json);
									}, function(errorCode, errorMessage) {
										// 再検索
										if (errorCode == 12 || errorCode == 13
												|| errorCode == 15) {
											var promise = that.authorization();
											promise.done(function() {
												that.searchDevice();
											});
										} else {
											var error = {
												errorCode : errorCode,
												errorMessage : errorMessage
											}
											deffered.reject(error);
											console.log('Error: code='
													+ errorCode
													+ ', messsage=\"'
													+ errorMessage + '\"');
										}
									});
							return deffered;
						},

						registerStatusChangeEvent : function() {
							if (this._isServChangeEvtRegistered === true) {
								return;
							}
							var that = this;
							var uri = new dConnect.URIBuilder();
							uri.setProfile('servicediscovery');
							uri.setAttribute('onservicechange');
							uri.setAccessToken(this.accessToken);
							dConnect
									.addEventListener(
											uri.build(),
											function(message) {
												message = JSON.parse(message);
												console
														.log(
																'Updated service list: ',
																message);
												that
														.updateService(message.networkService);
											},
											function() {
												that._isServChangeEvtRegistered = true;
												console
														.info('Registered Service Change Event.');
											},
											function(errorConde, errorMessage) {
												console
														.error('Failed to register Service Change Event: '
																+ errorMessage);
											});
						},

						updateService : function(service) {
							var i, idx = -1;
							for (i = 0; i < this._cachedServices.length; i++) {
								if (this._cachedServices[i].id === service.id) {
									idx = i;
									break;
								}
							}
							if (service.state === true) {
								if (idx !== -1) {
									this._cachedServices[idx] = service;
								} else {
									this._cachedServices.push(service);
								}
							} else {
								if (idx !== -1) {
									this._cachedServices.splice(idx, 1);
								}
							}

							var event = this.trigger('serviceChanged',
									this._cachedServices);
						},

						// /**
						// * デバイスの検索
						// */
						// searchIOTDevices : function(serviceId, profile,
						// attributes) {
						// var deffered = h5.async.deferred();
						// var uri = new dConnect.URIBuilder();
						// uri.setProfile(profile);
						// if(attributes){
						// uri.setAttribute(attributes);
						// }
						// uri.setServiceId(serviceId);
						// uri.setAccessToken(this.accessToken);
						// dConnect.get(uri.build(), null, function(json) {
						// deffered.resolve(json);
						// }, function(errorCode, errorMessage) {
						//
						// var error = {
						// errorCode : errorCode,
						// errorMessage : errorMessage
						// }
						// deffered.reject(error);
						// });
						// return deffered;
						// },

						/**
						 * サービスを検索
						 */
						getServiceInfo : function(serviceId, deviceName) {
							var deffered = h5.async.deferred();
							var builder = new dConnect.URIBuilder();
							builder.setProfile('serviceinformation');
							builder.setServiceId(serviceId);
							builder.setAccessToken(this.accessToken);
							var uri = builder.build();

							dConnect.get(uri, null, function(json) {
								deffered.resolve(json);
							}, function(errorCode, errorMessage) {

								var error = {
									errorCode : errorCode,
									errorMessage : errorMessage
								}
								deffered.reject(error);
							});
							return deffered.promise();
						},

						getServiceById : function(id) {
							var i;
							for (i = 0; i < this._cachedServices.length; i++) {
								if (this._cachedServices[i].id === id) {
									return this._cachedServices[i];
									break;
								}
							}
						},
						/**
						 * ユーザエージェントがAndroidであることを確認する.
						 */
						_isAndroid : function() {
							var userAgent = window.navigator.userAgent
									.toLowerCase();
							return (userAgent.indexOf('android') != -1);
						},

						_loadAccessToken : function() {
							return this._getCookie(this._accessTokenKey());
						},

						_accessTokenKey : function() {
							return 'accessToken' + this._ip
									+ decodeURIComponent(location.origin);
						},
						/**
						 * Cookieにアクセストークンを取得する.
						 * <p>
						 * 注: アクセストークンは本アプリのホスティングされるオリジンごとに作成、保存される.
						 * </p>
						 * 
						 * @param accessToken
						 *            アクセストークン
						 */
						_storeAccessToken : function(accessToken) {
							document.cookie = this._accessTokenKey() + '='
									+ accessToken;
						},
						/**
						 * Cookieに保存していた値を取得する.
						 * 
						 * @param {String}
						 *            name Cookie名
						 */
						_getCookie : function(name) {
							var result = null;
							var cookieName = name + '=';
							var allcookies = document.cookie;
							var position = allcookies.indexOf(cookieName);
							if (position != -1) {
								var startIndex = position + cookieName.length;
								var endIndex = allcookies.indexOf(';',
										startIndex);
								if (endIndex == -1) {
									endIndex = allcookies.length;
								}
								result = decodeURIComponent(allcookies
										.substring(startIndex, endIndex));
							}
							return result;
						},

					// _openWebsocketIfNeeded: function(key) {
					// if (!dConnect.isWebSocketReady()) {
					// if (dConnect.isConnectedWebSocket()) {
					// dConnect.disconnectWebSocket();
					// }
					// if (location.origin == 'file://') {
					// dConnect.setExtendedOrigin("file://");
					// }
					// dConnect.connectWebSocket(key, this._onWebSocketMessage);
					// console.log('WebSocket opened.');
					// } else {
					// console.log('WebSocket is ready.');
					// }
					// },
					//
					// _reopenWebSocket: function(key) {
					// if (dConnect.isConnectedWebSocket()) {
					// dConnect.disconnectWebSocket();
					// }
					// dConnect.connectWebSocket(key, this._onWebSocketMessage);
					// },

					}
				}
			});
	var DConnectInstanced = DConnect.create();
	h5.u.obj.expose("h5connect.common", {
		dconnect : DConnectInstanced,
	});
});