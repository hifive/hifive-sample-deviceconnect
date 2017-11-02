$(function() {

	var IOTModel = h5connect.model.IOTModel;

	/**
	 * 
	 * 
	 * @class h5connect.model.FileModel
	 */
	var FileModel = IOTModel.extend(function(super_) {
		return {
			name : 'h5connect.model.FileModel',
			/**
			 * @lends h5connect.model.FileModel#
			 */
			field : {
				_type : null,
				_mimeType : null,
				_path : null,
				_size : null,
				_updateDate : null,
			},
			/**
			 * @lends h5connect.model.FileModel#
			 */
			accessor : {

				/**
				 * @override
				 */
				type : {
					get : function() {
						return this._type;
					},
					set : function(value) {
						this._type = value;
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
				path : {
					get : function() {
						return this._path;
					},
					set : function(value) {
						this._path = value;
					}
				},

				/**
				 * @override
				 */
				size : {
					get : function() {
						return this._size;
					},
					set : function(value) {
						this._size = value;
					}
				},

				/**
				 * @override
				 */
				updateDate : {
					get : function() {
						return this._updateDate;
					},
					set : function(value) {
						this._updateDate = value;
					}
				},

			},
			/**
			 * @lends h5connect.model.FileModel#
			 */
			method : {
				/**
				 * ファクトリのインスタンスを生成する。
				 * 
				 * @memberOf h5connect.model.FileModel
				 * @method
				 * @name create
				 * @param
				 * @returns {h5connect.model.FileModel} 生成されたインスタンス。
				 */
				constructor : function FileModel(data) {
					super_.constructor.call(this);
					this.name = data['fileName'];
					this.type = data['fileType'];
					this.mimeType = data['mimeType'];
					this.path = data['path'];
					this.size = data['fileSize'];
					this.updateDate = data['updateDate'];
				},
			}
		}
	});

	h5.u.obj.expose("h5connect.model", {
		FileModel : FileModel,
	});
});