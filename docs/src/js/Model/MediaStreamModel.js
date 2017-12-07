$(function() {

	var IOTModel = h5connect.model.IOTModel;

	/**
	 * 
	 * 
	 * @class h5connect.model.MediaStreamModel
	 */
	var MediaStreamModel = IOTModel.extend(function(super_) {
		return {
			name : 'h5connect.model.MediaStreamModel',
			/**
			 * @lends h5connect.model.MediaStreamModel#
			 */
			field : {
				_imageHeight : null,
				_imageWidth : null,
				_mimeType : null,
				_previewHeight : null,
				_previewWidth : null,
				_previewMaxFrameRate : null,
				_state : null,
			},
			/**
			 * @lends h5connect.model.MediaStreamModel#
			 */
			accessor : {

				/**
				 * @override
				 */
				imageHeight : {
					get : function() {
						return this._imageHeight;
					},
					set : function(value) {
						this._imageHeight = value;
					}
				},

				/**
				 * @override
				 */
				imageWidth : {
					get : function() {
						return this._imageWidth;
					},
					set : function(value) {
						this._imageWidth = value;
					}
				},

				/**
				 * @override
				 */
				mimeType : {
					get : function() {
						return this._mimeType;
					},
					set : function(value) {
						this._mimeType = value;
					}
				},

				/**
				 * @override
				 */
				previewHeight : {
					get : function() {
						return this._previewHeight;
					},
					set : function(value) {
						this._previewHeight = value;
					}
				},

				/**
				 * @override
				 */
				previewWidth : {
					get : function() {
						return this._previewWidth;
					},
					set : function(value) {
						this._previewWidth = value;
					}
				},

				/**
				 * @override
				 */
				previewMaxFrameRate : {
					get : function() {
						return this._previewMaxFrameRate;
					},
					set : function(value) {
						this._previewMaxFrameRate = value;
					}
				},

				/**
				 * @override
				 */
				state : {
					get : function() {
						return this._state;
					},
					set : function(value) {
						this._state = value;
					}
				},

			},
			/**
			 * @lends h5connect.model.MediaStreamModel#
			 */
			method : {
				/**
				 * ファクトリのインスタンスを生成する。
				 * 
				 * @memberOf h5connect.model.MediaStreamModel
				 * @method
				 * @name create
				 * @param
				 * @returns {h5connect.model.MediaStreamModel} 生成されたインスタンス。
				 */
				constructor : function MediaStreamModel(data) {
					super_.constructor.call(this);
					this.id = data['id'];
					this.name = data['name'];
					this.imageHeight = data['imageHeight'];
					this.imageWidth = data['imageWidth'];
					this.mimeType = data['mimeType'];
					this.previewHeight = data['previewHeight'];
					this.previewWidth = data['previewWidth'];
					this.previewMaxFrameRate = data['previewMaxFrameRate'];
					this.state = data['state'];
				}
			}
		}
	});

	h5.u.obj.expose("h5connect.model", {
		MediaStreamModel : MediaStreamModel,
	});
});