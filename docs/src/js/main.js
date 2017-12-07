$(function() {
	var Utils = h5connect.common.Utils;
	var mainController = {
		__name: "h5connect.sample.maincontroller",

	    /**
		 * @private
		 * @type {h5connect.sample.dconnectcontroller}
		 */
	    _dConnect: h5connect.common.dconnect,

		__init: function() {
		},

		__postInit: function() {
		},

	    /**
		 *
		 *
		 * @ignore
		 * @param {EventContext}
		 *            context
		 */
	    '#balloonBtn click': function(context) {
	    	var ip = Utils.getUrlParam('ip', null);
		    var uri = "PumpPage.html";
		    uri += ip ? '?ip=' + ip : '';
	    	window.location = uri;
// location.hash = '#app_page';
	    },

	    /**
		 *
		 *
		 * @ignore
		 * @param {EventContext}
		 *            context
		 */
	    '#thetaBtn click': function(context) {
	    	var ip = Utils.getUrlParam('ip', null);
	    	var app = context.event.currentTarget.getAttribute("value");
		    var uri = "CameraPage.html";
		    uri += ip ? '?ip=' + ip : '';
	    	window.location = uri;
	    },

	    /**
		 *
		 *
		 * @ignore
		 * @param {EventContext}
		 *            context
		 */
	    '#hueBtn click': function(context) {
	    	var ip = Utils.getUrlParam('ip', null);
	    	var app = context.event.currentTarget.getAttribute("value");
		    var uri = "HuePage.html";
		    uri += ip ? '?ip=' + ip : '';
	    	window.location = uri;
	    },

	    /**
		 *
		 *
		 */
	    '#bluetoothBtn click': function() {
// alert("start");
	    	if(navigator.bluetooth.requestLEScan == null){
	    		alert("Not support requestLEScan");
	    		return;
	    	}
			var promise = navigator.bluetooth.requestDevice({acceptAllDevices: true});
	    	promise.then(device => {
	    		alert("ok");
				var div = '<div>';
				div += JSON.stringify(device);
				div += '</div>';
				alert(JSON.stringify(device));
			});
	    	promise.catch(error => { alert(error); });
	    },

	};

	h5.core.controller("#home", mainController);
});