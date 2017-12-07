$(function() {
	  var RootClass = h5.cls.RootClass;

	  /**
		 * 
		 * 
		 * @class h5connect.connector.LightConnector
		 */
	  var LightConnector = RootClass.extend(function(super_) {
	    return {
	      name: 'h5connect.connector.LightConnector',
	      /**
			 * @lends h5connect.connector.LightConnector#
			 */
	      field: {
	      },
	      /**
			 * @lends h5connect.connector.LightConnector#
			 */
	      accessor: {

	      },
	      /**
			 * @lends h5connect.connector.LightConnector#
			 */
	      method: {
	        /**
			 * ファクトリのインスタンスを生成する。
			 * 
			 * @memberOf h5connect.connector.LightConnector
			 * @method
			 * @name create
			 * @param
			 * @returns {h5connect.connector.LightConnector} 生成されたインスタンス。
			 */
	        constructor: function LightConnector() {
	        	super_.constructor.call(this);
	        },

	        requestIOTList: function(serviceId, accessToken){
				var deffered = h5.async.deferred();
				var builder = new dConnect.URIBuilder();
	        	builder.setProfile('light');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
				dConnect.get(builder.build(), null, function(json) {
		    		if(json.result == 0){
						deffered.resolve(json.lights);
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

	        requestLightOn: function(serviceId, accessToken, device){
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('light');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	builder.addParameter('lightId', device.id);
	        	device.isOn = true;
	        	if(device.color != null && typeof device.color !== 'undefined'){
	        		builder.addParameter('color', device.color);
	        	}
	        	if(device.brightness != null && typeof device.brightness !== 'undefined'){
	        		builder.addParameter('brightness', device.brightness);
	        	}
	        	if(device.flashing != null && typeof device.flashing !== 'undefined'){
	        		builder.addParameter('flashing', device.flashing);
	        	}
	        	dConnect.post(builder.build(), null, null, function(json){
					deffered.resolve(json);
	        	},function(errCode, errMsg){
	        		var error = {
	        			errCode : errCode,
	        			errMsg : errMsg,
	        		}
					deffered.reject(error);
	        	});
	        	return deffered;
	        },

	        requestLightOff: function(serviceId, accessToken, device){
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('light');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	builder.addParameter('lightId', device.id);
	        	device.isOn = false;
	        	dConnect.delete(builder.build(), null, null, function(json){
					deffered.resolve(json);
	        	},function(errCode, errMsg){
	        		var error = {
	        			errCode : errCode,
	        			errMsg : errMsg,
	        		}
					deffered.reject(error);
	        	});
	        	return deffered;
	        },
	        requestLightChangeStatus: function(serviceId, accessToken, device, param){
				var deffered = h5.async.deferred();
	        	var builder = new dConnect.URIBuilder();
	        	builder.setProfile('light');
	        	builder.setServiceId(serviceId);
	        	builder.setAccessToken(accessToken);
	        	builder.addParameter('lightId', device.id);
	        	builder.addParameter('name', device.name);
        		if((param && param.color) || device.color){
            		builder.addParameter('color', (param && param.color) || device.color);
        		}
        		if((param && param.brightness) || device.brightness){
            		builder.addParameter('brightness', (param && param.brightness) || device.brightness);
        		}
        		if((param && param.flashing) || device.flashing){
            		builder.addParameter('flashing', (param && param.flashing) || device.flashing);
        		}
        		var that = this;
	        	dConnect.put(builder.build(), null, null, function(json){
					deffered.resolve(json);
	        	},function(errCode, errMsg){
	        		var error = {
	        			errCode : errCode,
	        			errMsg : errMsg,
	        		}
					deffered.reject(error);
	        	});
	        	return deffered;
	        },
	      }
	    }
	  });

	  h5.u.obj.expose("h5connect.connector", {
		  LightConnector: LightConnector,
	  });
});