$(function() {

	var RootClass = h5.cls.RootClass;
	/**
	 * 
	 * 
	 * @class h5connect.common.Utils
	 */
	var Utils = RootClass.extend(function(super_) {
		return {
			name : 'h5connect.common.Utils',
			/**
			 * @lends h5connect.common.Utils#
			 */
			field : {},
			/**
			 * @lends h5connect.common.Utils#
			 */
			accessor : {

			},
			/**
			 * @lends h5connect.common.Utils#
			 */
			method : {
				/**
				 * ファクトリのインスタンスを生成する。
				 * 
				 * @memberOf h5connect.common.Utils
				 * @method
				 * @name create
				 * @param
				 * @returns {h5connect.common.Utils} 生成されたインスタンス。
				 */
				constructor : function Utils() {
					super_.constructor.call(this);
				},

				isEqualToStringIgnoreCases : function(str, cmpStr) {
					return str.toLowerCase() == cmpStr.toLowerCase();
				},

				/**
				 * 本アプリからリモートアクセスする端末のIPアドレス指定を取得する.
				 */
				getUrlParam : function(param, defaultVal) {
					if (1 < document.location.search.length) {
						var query = document.location.search.substring(1);
						var parameters = query.split('&');
						var i;
						for (i = 0; i < parameters.length; i++) {
							var element = parameters[i].split('=');
							var paramName = decodeURIComponent(element[0]);
							var paramValue = decodeURIComponent(element[1]);
							if (paramName == param) {
								return paramValue;
							}
						}
					}
					return defaultVal;
				},

				useMJPEG : function() {
					var v = this.getWebkitMajorVersion();
					if (v === null) {
						return true;
					}
					return v > 534;
				},

				getWebkitMajorVersion : function() {
					var ua = window.navigator.userAgent;
					var group = ua.match(/^.* applewebkit\/(\d+)\..*$/i);
					if (group === null) {
						return null;
					}
					if (group.length > 1) {
						return Number(group[1]);
					}
					return null;
				},

				getBase64Image : function(img) {
					var canvas = document.createElement("canvas");
					canvas.width = img.width;
					canvas.height = img.height;

					var ctx = canvas.getContext("2d");
					ctx.drawImage(img, 0, 0);

					var dataURL = canvas.toDataURL("image/jpeg");

					return dataURL.replace(/^data:image\/jpeg;base64,/, "");
				}
			}
		}
	});
	var UtilsObject = Utils.create();
	h5.u.obj.expose("h5connect.common", {
		Utils : UtilsObject,
	});
});