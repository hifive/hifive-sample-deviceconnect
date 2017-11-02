$(function() {
	  var RootClass = h5.cls.RootClass;
	  /**
		 * 
		 * 
		 * @class h5connect.object.MediaStreamConnector
		 */
	  var MediaStreamConnector = RootClass.extend(function(super_) {
	    return {
	      name: 'h5connect.connector.MediaStreamConnector',
	      /**
			 * @lends h5connect.object.MediaStreamConnector#
			 */
	      field: {
	      },
	      /**
			 * @lends h5connect.object.MediaStreamConnector#
			 */
	      accessor: {


	      },
	      /**
			 * @lends h5connect.object.MediaStreamConnector#
			 */
	      method: {
	        /**
			 * ファクトリのインスタンスを生成する。
			 * 
			 * @memberOf h5connect.object.MediaStreamConnector
			 * @method
			 * @name create
			 * @param
			 * @returns {h5connect.object.MediaStreamConnector} 生成されたインスタンス。
			 */
	        constructor: function MediaStreamConnector() {
	        	super_.constructor.call(this);
	        },

	        requestIOTList: function(serviceId, accessToken){
				var deffered = h5.async.deferred();
				var builder = new dConnect.URIBuilder();
	        	builder.setProfile('mediastreamrecording');
	        	builder.setAttribute('mediarecorder');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
				dConnect.get(builder.build(), null, function(json) {
		    		if(json.result == 0){
						deffered.resolve(json.recorders);
		    		} else {
				  		var error = {
				  			errorCode : json.errorCode,
				  			errorMessage : json.errorMsg
				  		}
						deffered.reject(error);
		    		}
				}, function(errorCode, errorMessage) {

			  		var error = {
			  			errorCode : errorCode,
			  			errorMessage : errorMessage
			  		}
					deffered.reject(error);
				});
				return deffered;
	        },

	        requestGetRecorderOption: function(serviceId, accessToken, param){
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('mediastreamrecording');
	        	builder.setAttribute('options');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	if (param.id !== null && param.id !== undefined) {
	        		builder.addParameter('target', param.id);
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

	        requestChangeRecorderOption: function(serviceId, accessToken, param, opts){
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('mediastreamrecording');
	        	builder.setAttribute('options');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	if (op.target !== undefined) {
	        		builder.addParameter('target', op.target);
	        	}
	        	if (opts.imageWidth !== undefined) {
	        		builder.addParameter('imageWidth', opts.imageWidth);
	        	}
	        	if (opts.imageHeight !== undefined) {
	        		builder.addParameter('imageHeight', opts.imageHeight);
	        	}
	        	if (opts.previewWidth !== undefined) {
	        		builder.addParameter('previewWidth', opts.previewWidth);
	        	}
	        	if (opts.previewHeight !== undefined) {
	        		builder.addParameter('previewHeight', opts.previewHeight);
	        	}
	        	if (opts.previewMaxFrameRate !== undefined) {
	        		builder.addParameter('previewMaxFrameRate', opts.previewMaxFrameRate);
	        	}
	        	if (opts.mimeType !== undefined) {
	        		builder.addParameter('mimeType', opts.mimeType);
	        	}
	        	if (param.id !== null && param.id !== undefined) {
	        		builder.addParameter('target', param.id);
	        	}
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

	        requestPreview: function(serviceId, accessToken, device){
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('mediastreamrecording');
	        	builder.setAttribute('preview');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	if (device.id !== null && device.id !== undefined) {
	        		builder.addParameter('target', device.id);
	        	}
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

	        requestUnregisterPreview: function(serviceId, accessToken, device){
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('mediastreamrecording');
	        	builder.setAttribute('preview');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	if (device.id !== null && device.id !== undefined) {
	        		builder.addParameter('target', device.id);
	        	}
	        	var uri = builder.build();

	        	dConnect.delete(uri, null, null, function(json) {
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

	        requestTakePhoto: function(serviceId, accessToken, device){
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('mediastreamrecording');
	        	builder.setAttribute('takephoto');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	if (device && device.id !== null && device.id !== undefined) {
	        		builder.addParameter('target', device.id);
	        	}
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

	        	return deffered;
	        },

	        requestRecord: function(serviceId, accessToken, device){
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('mediastreamrecording');
	        	builder.setAttribute('record');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	if (device && device.id !== null && device.id !== undefined) {
	        		builder.addParameter('target', device.id);
	        	}
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

	        	return deffered;
	        },

	        requestPause: function(serviceId, accessToken, device){
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('mediastreamrecording');
	        	builder.setAttribute('pause');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
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

	        requestStop: function(serviceId, accessToken, device){
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('mediastreamrecording');
	        	builder.setAttribute('stop');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
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

	      }
	    }
	  });

	  h5.u.obj.expose("h5connect.connector", {
		  MediaStreamConnector: MediaStreamConnector,
	  });
});