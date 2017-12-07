$(function() {

	var RootClass = h5.cls.RootClass;

	/**
	 * 
	 * 
	 * @class h5connect.model.IOTModel
	 */
	var IOTModel = RootClass.extend(function(super_) {
		return {
			name : 'h5connect.model.IOTModel',
			/**
			 * @lends h5connect.model.IOTModel#
			 */
			field : {
				_id : null,
				_name : null,
			},
			/**
			 * @lends h5connect.model.IOTModel#
			 */
			accessor : {

				/**
				 * @override
				 */
				id : {
					get : function() {
						return this._id;
					},
					set : function(value) {
						this._id = value;
					}
				},

				/**
				 * @override
				 */
				name : {
					get : function() {
						return this._name;
					},
					set : function(value) {
						this._name = value;
					}
				},

			},
			/**
			 * @lends h5connect.model.IOTModel#
			 */
			method : {
				/**
				 * ファクトリのインスタンスを生成する。
				 * 
				 * @memberOf h5connect.model.IOTModel
				 * @method
				 * @name create
				 * @param
				 * @returns {h5connect.model.IOTModel} 生成されたインスタンス。
				 */
				constructor : function IOTModel() {
					super_.constructor.call(this);
				}
			}
		}
	});

	h5.u.obj.expose("h5connect.model", {
		IOTModel : IOTModel,
	});
});