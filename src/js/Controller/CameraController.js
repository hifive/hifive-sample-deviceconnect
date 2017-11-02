$(function() {
	var Utils = h5connect.common.Utils;
	var FileConnector = h5connect.connector.FileConnector;
	var MediaStreamConnector = h5connect.connector.MediaStreamConnector;
	var FileModel = h5connect.model.FileModel;
	var VRController = h5connect.controller.VRController;
	var RemoteController = h5connect.controller.RemoteController;

	var NOT_INITIALIZED = 0;
	var INITIALIZE_CALLED = 1;
	var INITIALIZED = 2;
	var CameraController = {
		__name : "h5connect.controller.CameraController",

		_initialized : null,

		/**
		 * @private
		 * @type {h5connect.common.dconnectcontroller}
		 */
		dConnect : h5connect.common.dconnect,

		loading : null,

		/**
		 * @private
		 * @type
		 */
		vrController : null,

		/**
		 * @private
		 * @type
		 */
		currDevice : null,

		/**
		 * @private
		 * @type
		 */
		service : null,

		/**
		 * @private
		 * @type
		 */
		videoList : null,

		/**
		 * @private
		 * @type
		 */
		imageList : null,

		/**
		 * @private
		 * @type
		 */
		connector : null,

		/**
		 * @private
		 * @type
		 */
		fileConnector : null,

		/**
		 * @private
		 * @type
		 */
		isLoadingVideo : null,

		remoteController : null,

		isRecording : false,

		streamConnector : null,

		__postInit : function(context) {
			$.mobile.changePage('#devices');
		},

		__init : function(context) {
			this.loading = this.indicator();
			this.fileConnector = FileConnector.create();
			this.streamConnector = MediaStreamConnector.create();

			this.isRecording = false;

			if (this.dConnect.initialized != INITIALIZED) {
				var param = {};
				param.appName = APP_NAME
				param.scopes = SCOPES;
				this.dConnect.initialize(param);
			}
		},

		__ready : function(context) {
			this.refreshContent();
			this.imageList = [];
			this.videoList = [];
			this.isLoadingVideo = false;

			this.connectDevice();
			this.vrController = h5.core.controller("#camera_player",
					VRController);
		},

		__dispose : function() {
		},

		connectDevice : function() {
			this.loading.show();

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
						$.mobile.changePage($('#app_control'), {
							transition : "slidefade"
						});
					});
		},
		refreshContent : function() {
			$('#photo_content').empty();
			$('#video_content').empty();
			// $('#setting_content').text("This content isn't available right
			// now");

		},

		requestDevices : function() {
			var that = this;
			this.loading.show();
			var promise = this.dConnect
					.searchDeviceFromProfile("mediaStreamRecording");
			promise.done(function(json) {
				if (json.result == 0) {
					that.showDevices(json.services);
				} else {
					var errorCode = json.errorCode;
					var errorMsg = json.errorMsg;
					console.log('Error:' + errorCode + ':' + errorMsg);
				}
				that.loading.hide();

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
				}
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
				str += '<a href="#" class="camera-item" data-service-id="'
						+ device.id + '" data-service-name="' + device.name
						+ '">';
				str += '<img src="./src/res/camera_device.png"/>';
				str += '<figcaption>';
				str += '<div>' + device.name + '</div>';
				str += '</figcaption>';
				str += '</a>';
			}
			$('#camera_devices').html(str);
		},

		loadCameraFile : function(index) {
			var that = this;
			var promise = this.fileConnector.requestFileList(this.service.id,
					this.dConnect.accessToken);
			promise.done(function(json) {
				var list = json.files;
				var i;
				for (i = 0; i < list.length; i++) {
					var file = FileModel.create(list[i]);
					if (file.mimeType.indexOf('image') !== -1) {
						that.imageList.push(file);
					} else if (file.mimeType.indexOf('video') !== -1) {
						that.videoList.push(file);
					}
				}
				that.loading.hide();
			});
			promise.fail(function(error) {
				that.loading.hide();
				// alert("Load File list is failed (code " + error.errCode + ')
				// : ' + error.errMsg);
			});
		},

		loadImage : function() {
			// サービスが無い場合、キャッシュー画像が表示
			if (this.service == null || this.service.online == false) {
				var img = this.loadCachedImg();
				if (img != null && $('.photo-container').length == 0) {
					var div = document.createElement("div");
					div.setAttribute("class", "photo-container");
					img.setAttribute("class", "thumbnail-img cached-img");
					div.appendChild(img);
					$('#photo_content').append(div);
				}
				return;
			}

			if (this.imageList.length == 0) {
				return;
			}
			var that = this;
			var file = this.imageList.pop();

			var div = document.createElement("div");
			div.setAttribute("class", "photo-container");

			var param = {
				path : file.path,
				fileType : "0" // 0: Thumbnail, 1: Origin
			};
			var promise = this.fileConnector.requestFileFromPath(
					this.service.id, this.dConnect.accessToken, param);
			promise
					.done(function(json) {

						var img = document.createElement("img");
						img.setAttribute("class", "thumbnail-img");
						img.setAttribute("title", file.name);
						img.dataset.path = file.path;

						var url = json.uri.replace("localhost",
								that.dConnect.ip);
						img.src = url;

						// remove loading
						div.appendChild(img);

						// load next image
						var activeTab = $(".ui-btn-active").length > 0 ? $(".ui-btn-active")[0]
								: null;
						if (activeTab
								&& activeTab.dataset.href == "photo_content") {
							that.loadImage();
						}
					});
			promise
					.fail(function(error) {
						alert("Load Image is failed (code " + error.errCode
								+ ') : ' + error.errMsg);
						// load next image
						var activeTab = $(".ui-btn-active").length > 0 ? $(".ui-btn-active")[0]
								: null;
						if (activeTab
								&& activeTab.dataset.href == "photo_content"
								&& this.imageList.length >= 0) {
							that.loadImage();
						}
					});

			$('#photo_content').append(div);
		},

		loadVideo : function() {
			var that = this;
			var file = this.videoList.pop();
			if (file == null) {
				return;
			}
			;

			var param = {
				path : file.path,
				fileType : "0" // 0: Thumbnail, 1: Origin
			};
			this.isLoadingVideo = true;
			var promise = this.fileConnector.requestFileFromPath(
					this.service.id, this.dConnect.accessToken, param);

			var div = document.createElement("div");
			div.setAttribute("class", "video-container");
			$(div).addClass('loader');

			promise
					.done(function(json) {
						var divTitle = document.createElement("div");
						divTitle.setAttribute("class", "video-title");
						divTitle.innerHTML = file.name;

						var video = document.createElement('video');
						video.style.visibility = "none";
						video.loop = true;
						video.muted = true;
						video.setAttribute('webkit-playsinline',
								'webkit-playsinline');
						video.setAttribute('crossorigin', 'anonymous');
						video.load();
						$(video).hide();
						var url = json.uri.replace("localhost",
								that.dConnect.ip)
						video.src = url;

						video
								.addEventListener(
										"loadeddata",
										function() {
											this.removeEventListener(
													"loadeddata",
													arguments.callee);
											var elem = that
													.takeVideoScreenshot(this);
											$(this).parent().append(elem);
											that.isLoadingVideo = false;

											// load next video
											var activeTab = $(".ui-btn-active").length > 0 ? $(".ui-btn-active")[0]
													: null;
											if (activeTab
													&& activeTab.dataset.href == "video_content") {
												that.loadVideo();
											}
										});
						div.append(video);
						div.append(divTitle);
					});
			promise
					.fail(function(error) {
						alert("Load Video is failed (code " + error.errCode
								+ ') : ' + error.errMsg);
						that.isLoadingVideo = false;
						// load next video
						var activeTab = $(".ui-btn-active").length > 0 ? $(".ui-btn-active")[0]
								: null;
						if (activeTab
								&& activeTab.dataset.href == "video_content") {
							that.loadVideo();
						}
					});
			$('#video_content').append(div);
		},

		takeVideoScreenshot : function(video) {
			var canvas = document.createElement("canvas");
			canvas.height = video.videoHeight;
			canvas.width = video.videoWidth;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			canvas.style.width = 'inherit';
			canvas.style.height = 'inherit';
			return canvas;
		},

		loadCachedImg : function(video) {
			var dataImage = localStorage.getItem('imgThetaStore');
			if (dataImage != null) {
				var img = document.createElement("img");
				img.src = "data:image/jpeg;base64," + dataImage;
				return img;
			}
			return null;
		},

		'#refreshBtn click' : function() {
			this.requestDevices();
		},
		/**
		 *
		 *
		 * @ignore
		 * @param {EventContext}
		 *            context
		 */
		'.camera-item click' : function(context) {
			var that = this;
			var servName = context.event.currentTarget.dataset.serviceName;
			var servId = context.event.currentTarget.dataset.serviceId;

			var that = this;
			var promise = this.dConnect.getServiceInfo(servId, servName);
			this.loading.show();
			promise.done(function(json) {
				if (json.result == 0) {
					that.service = that.dConnect.getServiceById(servId);
					that.loadCameraFile();
					that.refreshContent();

					$.mobile.changePage($('#app_control'), {
						transition : "slidefade"
					});
				} else {
					that.loading.hide();
					var errorCode = json.errorCode;
					var errorMsg = json.errorMsg;
					console.log('Error:' + errorCode + ':' + errorMsg);
				}

			});
			promise.fail(function(error) {
				alert('Error: Code ' + error.errorCode + ' :'
						+ error.errorMessage);
				$.mobile.changePage($('#app_control'), {
					transition : "slidefade"
				});
				that.loading.hide();
			});

		},

		'.ui-navbar .ui-link click' : function(context, $element) {
			var that = this;
			context.event.preventDefault()
			// Comment out for R-DAY
			var type = $element.attr('data-href');
			// search the navbar to deactivate the active button
			$element.closest('.ui-navbar').find('a').removeClass(
					'ui-btn-active');

			// change the active tab
			$element.addClass('ui-btn-active');

			// hide the siblings
			$('#' + type).show().siblings('.tab-content').hide();

			if (type === "live_content") {
				this.liveCamera();
			} else if (type === "photo_content") {
				this.loadImage();

			} else if (type === "video_content") {
				this.loading.hide();
				this.loadVideo();
			}
		},

		'.thumbnail-img click' : function(context, $element) {
			// サービスが無い場合、キャッシュ画像を表示
			if (this.service == null || this.service.online == false) {
				var img = this.loadCachedImg();
				if (img != null) {
					this.vrController.loadImage(img);
					$.mobile.changePage($('#player'), {
						transition : "slidefade"
					});
				}
				return;
			}
			var path = $element.data('path');
			$.mobile.changePage($('#player'), {
				transition : "slidefade"
			});

			var that = this;
			var param = {
				path : path,
				fileType : "1" // 0: Thumbnail, 1: Origin
			};
			this.loading.show();
			var servId = this.service.id;
			var promise = this.fileConnector.requestFileFromPath(
					this.service.id, this.dConnect.accessToken, param);
			promise.done(function(json) {
				var imgUrl = json.uri.replace("localhost", that.dConnect.ip);
				var loader = new THREE.ImageLoader();
				loader.load(imgUrl, function(img) {
					that.loading.hide();
					that.vrController.loadImage(img);
				}, null, function(error) {
					that.loading.hide();
					alert("Error: " + error + "\nCannot load image:" + imgUrl);
				});

				$.mobile.changePage($('#player'), {
					transition : "slidefade"
				});
			});
			promise.fail(function(error) {
				that.loading.hide();
				alert("Load Image is failed (code " + error.errCode + ') : '
						+ error.errMsg);
			});

		},

		'.thumbnail-video click' : function(context, $element) {
			context.event.preventDefault()
			var video = $element.find('video')[0];
			video.play();
			this.vrController.changeVideoTexture(video);
			$.mobile.changePage($('#player'), {
				transition : "slidefade"
			});
		},

		'#homeBtn click' : function(context, $element) {
			var ip = Utils.getUrlParam('ip', null);
			var app = context.event.currentTarget.getAttribute("value");
			var uri = "index.html";
			uri += ip ? '?ip=' + ip : '';
			window.location = uri;
		},

		'#shutterBtn click' : function(context, $element) {
			if (this.service == null || this.service.online == false) {
				var img = this.loadCachedImg();
				if (img != null) {
					this.vrController.loadImage(img);
					$.mobile.changePage($('#player'), {
						transition : "slidefade"
					});
				}
				return;
			}
			var servId = this.service.id;
			var that = this;
			if ($("#shutter-mode-camera").prop("checked")) {
				this.loading.show();
				var promise = this.streamConnector.requestTakePhoto(servId,
						this.dConnect.accessToken, null);
				promise.done(function(json) {
					var url = json.uri.replace("localhost", that.dConnect.ip);
					var loader = new THREE.ImageLoader();
					loader.load(url, function(img) {

						var imgData = Utils.getBase64Image(img);
						localStorage.setItem("imgThetaStore", imgData);

						that.loading.hide();
						that.vrController.loadImage(img);
					}, null, function(error) {
						that.loading.hide();
						alert("Error: " + error + "\nCannot load image:"
								+ imgUrl);
					});

					$.mobile.changePage($('#player'), {
						transition : "slidefade"
					});
				});
				promise.fail(function(error) {
					that.loading.hide();
					var img = this.loadCachedImg();
					if (img != null) {
						that.vrController.loadImage(img);
						$.mobile.changePage($('#player'), {
							transition : "slidefade"
						});
					}
				});
			} else if ($("#shutter-mode-video").prop("checked")) {
				if (this.isRecording) {
					var promise = this.streamConnector.requestStop(
							this.service.id, this.dConnect.accessToken, null);
					promise.done(function(json) {
						$element.css("background-image",
								'url("src/res/video_btn.png")');
						that.isRecording = false;
					});
					promise.fail(function(error) {
						alert("Record is failed to stop (code " + error.errCode
								+ ') : ' + error.errMsg);
					});
				} else {
					var promise = this.streamConnector.requestRecord(
							this.service.id, this.dConnect.accessToken, null);
					promise.done(function(json) {
						$element.css("background-image",
								'url("src/res/video_btn_stop.png")');
						that.isRecording = true;
					});
					promise.fail(function(error) {
						alert("Record is failed to start (code "
								+ error.errCode + ') : ' + error.errMsg);
					});
				}
			}
		},

		'input[type=radio][name=shutter-mode] change' : function(context,
				$element) {
			var val = $element.val();
			if (val == "camera") {
				$("#shutterBtn").css("background-image",
						'url("src/res/camera_btn.png")');
			} else if (val == "video") {
				$("#shutterBtn").css("background-image",
						'url("src/res/video_btn.png")');
			}
		},

	};

	h5.core.controller("body", CameraController);
});