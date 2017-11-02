$(function() {

	var IOTModel = h5connect.model.IOTModel;

	/**
	 * 
	 * 
	 * @class h5connect.model.LightModel
	 */
	var LightModel = IOTModel.extend(function(super_) {
		return {
			name : 'h5connect.model.LightModel',
			/**
			 * @lends h5connect.model.LightModel#
			 */
			field : {
				_color : null,
				_brightness : null,
				_flashing : null,
				_isOn : null,
			},
			/**
			 * @lends h5connect.model.LightModel#
			 */
			accessor : {

				/**
				 * @override
				 */
				color : {
					get : function() {
						return this._color;
					},
					set : function(value) {
						this._color = value;
					}
				},

				/**
				 * @override
				 */
				brightness : {
					get : function() {
						return this._brightness;
					},
					set : function(value) {
						this._brightness = value;
					}
				},

				/**
				 * @override
				 */
				flashing : {
					get : function() {
						return this._flashing;
					},
					set : function(value) {
						this._flashing = value;
					}
				},

				/**
				 * @override
				 */
				isOn : {
					get : function() {
						return this._isOn;
					},
					set : function(value) {
						this._isOn = value;
					}
				},

			},
			/**
			 * @lends h5connect.model.LightModel#
			 */
			method : {
				/**
				 * ファクトリのインスタンスを生成する。
				 * 
				 * @memberOf h5connect.model.LightModel
				 * @method
				 * @name create
				 * @param
				 * @returns {h5connect.model.LightModel} 生成されたインスタンス。
				 */
				constructor : function LightModel(data) {
					super_.constructor.call(this);
					this.id = data['lightId'];
					this.name = data['name'];
					this.isOn = data['on'];
				},
			}
		}
	});

	h5.u.obj.expose("h5connect.model", {
		LightModel : LightModel,
	});
});