$(function() {
	  var RootClass = h5.cls.RootClass;

	  /**
		 * 
		 * 
		 * @class h5connect.connector.FileConnector
		 */
	  var FileConnector = RootClass.extend(function(super_) {
	    return {
	      name: 'h5connect.connector.FileConnector',
	      /**
			 * @lends h5connect.connector.FileConnector#
			 */
	      field: {
	      },
	      /**
			 * @lends h5connect.connector.FileConnector#
			 */
	      accessor: {

	      },
	      /**
			 * @lends h5connect.connector.FileConnector#
			 */
	      method: {
	        /**
			 * ファクトリのインスタンスを生成する。
			 * 
			 * @memberOf h5connect.connector.FileConnector
			 * @method
			 * @name create
			 * @param
			 * @returns {h5connect.connector.FileConnector} 生成されたインスタンス。
			 */
	        constructor: function FileConnector() {
	        	super_.constructor.call(this);
	        },

	        /**
			 * URIからファイルを移動。
			 * 
			 * @param {String}
			 *            serviceId サービスID
			 * @param {String}
			 *            accessToken アクセストークン
			 * @param {String}
			 *            param URIのパラメータ
			 */
	        requestFileMove : function(serviceId, accessToken, param) {
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('file');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	builder.addParameter('oldPath', param.oldPath || '');
	        	builder.addParameter('newPath', param.newPath || '');
	        	builder.addParameter('forceOverwrite', param.forceOverwrite || '');
	        	var uri = builder.build();
	        	dConnect.put(uri, null, null, function(json) {
					deffered.resolve(json);
	        	}, function(errorCode, errorMessage) {
	        		var error = {
		        			errCode : errorCode,
		        			errMsg : errorMessage,
		        		}
					deffered.reject(error);
	        	});
	        	return deffered;
	        },

	        /**
			 * URIからディレクトリを移動。
			 * 
			 * @param {String}
			 *            serviceId サービスID
			 * @param {String}
			 *            accessToken アクセストークン
			 * @param {String}
			 *            param URIのパラメータ
			 */
	        requestDirectoryMove : function(serviceId, accessToken, param) {
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('file');
	        	builder.setAttribute('directory');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	builder.addParameter('oldPath', param.oldPath || '');
	        	builder.addParameter('newPath', param.newPath || '');
	        	var uri = builder.build();

	        	dConnect.put(uri, null, null, function(json) {
					deffered.resolve(json);
	        	}, function(errorCode, errorMessage) {
	        		var error = {
		        			errCode : errorCode,
		        			errMsg : errorMessage,
		        		}
					deffered.reject(error);
	        	});
	        	return deffered;
	        },

	        /**
			 * PathからURIを取得
			 * 
			 * @param {String}
			 *            serviceId サービスID
			 * @param {String}
			 *            accessToken アクセストークン
			 * @param {String}
			 *            param URIのパラメータ
			 */
	        requestFileFromPath : function(serviceId, accessToken, param) {
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('file');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	if(param && param.path){
		        	builder.addParameter('path', param.path);
	        	}
	        	if(param && param.fileType){
	        		builder.addParameter('fileType', param.fileType);
	        	}
	        	var uri = builder.build();
	        	dConnect.get(uri, null, function(json) {
					deffered.resolve(json);
	        	}, function(errorCode, errorMessage) {
	        		var error = {
		        			errCode : errorCode,
		        			errMsg : errorMessage,
		        		}
					deffered.reject(error);
	        	});
	        	return deffered;
	        },

	        /**
			 * ファイル一覧の表示<br>
			 * uri:/file/list
			 * 
			 * @param {String}
			 *            serviceId サービスID
			 * @param {String}
			 *            accessToken アクセストークン
			 * @param {String}
			 *            param URIのパラメータ
			 */
	        requestFileList : function(serviceId, accessToken, param) {
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('file');
	        	builder.setAttribute('list');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	if(param && param.path){
		        	builder.addParameter('path', param.path);
	        	}
	        	var uri = builder.build();
	        	dConnect.get(uri, null, function(json) {
					deffered.resolve(json);
	        	}, function(errorCode, errorMessage) {
	        		var error = {
		        			errCode : errorCode,
		        			errMsg : errorMessage,
		        		}
					deffered.reject(error);
	        	});
	        	return deffered;
	        },

	        /**
			 * ファイル削除要求を送信する.
			 * 
			 * @param {String}
			 *            serviceId サービスID
			 * @param {String}
			 *            accessToken アクセストークン
			 * @param {String}
			 *            param パラメータ
			 */
	        requestDeleteFile : function(serviceId, accessToken, param) {
				var deffered = h5.async.deferred();
				var builder = new dConnect.URIBuilder();
				builder.setProfile('file');
				builder.setServiceId(serviceId);
				builder.setAccessToken(accessToken);
	        	if(param && param.path){
		        	builder.addParameter('path', param.path);
	        	}
				var uri = builder.build();
				dConnect.delete(uri, null, function(json) {
					deffered.resolve(json);
				}, function(errorCode, errorMessage) {
	        		var error = {
		        			errCode : errorCode,
		        			errMsg : errorMessage,
		        		}
					deffered.reject(error);
				});
	        },

	        /**
			 * ディレクトリ作成要求を送信する.
			 * 
			 * @param {String}
			 *            serviceId サービスID
			 * @param {String}
			 *            accessToken アクセストークン
			 * @param {String}
			 *            param パラメータ
			 */
	        requestMKDir : function(serviceId, accessToken, param) {
	        	if (!param || param.path == null) {
		            return;
		        }
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('file');
	        	builder.setAttribute('directory');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	builder.addParameter('path', param.path || '');
	        	var uri = builder.build();

	        	dConnect.post(uri, null, null, function(json) {
					deffered.resolve(json);
	        	}, function(errorCode, errorMessage) {
	        		var error = {
		        			errCode : errorCode,
		        			errMsg : errorMessage,
		        		}
					deffered.reject(error);
	        	});
	        },

	        /**
			 * ディレクトリ削除要求を送信する.
			 * 
			 * 
			 * @param {String}
			 *            serviceId サービスID
			 * @param {String}
			 *            accessToken アクセストークン
			 * @param {String}
			 *            param パラメータ
			 */
	        requestRMDir : function(serviceId, accessToken, param) {
	        	if (!param || param.path == null) {
		            return;
		        }
				var deffered = h5.async.deferred();
				var builder = new dConnect.URIBuilder();
				builder.setProfile('file');
				builder.setAttribute('directory');
				builder.setServiceId(serviceId);
				builder.setAccessToken(accessToken);
				builder.addParameter('path', param.dir || '');
				builder.addParameter('forceRemove', param.forceRemove || false);
				var uri = builder.build();

				dConnect.delete(uri, null, function(json) {
					deffered.resolve(json);
				}, function(errorCode, errorMessage) {
	        		var error = {
		        			errCode : errorCode,
		        			errMsg : errorMessage,
		        		}
					deffered.reject(error);
				});
	        },

	        /**
			 * 画像の表示
			 * 
			 * @param {String}
			 *            serviceId サービスID
			 * @path {String} path パス名
			 */
	        requestImageShow : function(serviceId, accessToken, param) {
				var deffered = h5.async.deferred();

				var builder = new dConnect.URIBuilder();
				builder.setProfile('file');
				builder.setServiceId(serviceId);
				builder.setAccessToken(accessToken);
				builder.addParameter('path', path);
				var uri = builder.build();
				dConnect.get(uri, null, function(json) {
					deffered.resolve(json);
				}, function(errorCode, errorMessage) {
	        		var error = {
		        			errCode : errorCode,
		        			errMsg : errorMessage,
		        		}
	        		deffered.reject(error);
				});
	        },

	      }
	    }
	  });

	  h5.u.obj.expose("h5connect.connector", {
		  FileConnector: FileConnector,
	  });
});