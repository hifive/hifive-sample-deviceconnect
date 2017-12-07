$(function() {
	var RootClass = h5.cls.RootClass;

	var IOTFactory = RootClass.extend(function(super_) {
		return {
			name : 'h5connect.model.IOTFactory',
			/**
			 * @lends h5connect.model.IOTFactory#
			 */
			field : {
				/**
				 * @private
				 * @type {Map.<String, *>}
				 */
				_classes : null
			},
			/**
			 * @lends h5connect.model.IOTFactory#
			 */
			accessor : {
				/**
				 * クラス種別を指定しない際に使用される標準のクラス種別を取得または設定する。
				 * 
				 * @type {String}
				 */
				defaultClassType : null
			},
			/**
			 * @lends h5connect.model.IOTFactory#
			 */
			method : {
				/**
				 * ファクトリのインスタンスを生成する。
				 * 
				 * @memberOf h5connect.model.IOTFactory
				 * @method
				 * @name create
				 * @param {String}
				 *            [defaultClassType] 標準のクラス種別
				 * @param {Object.
				 *            <String,
				 *            h5connect.model.IOTFactory~InitialParameters>}
				 *            [initialMap] 初期登録データのマッピング
				 * @returns {h5connect.model.IOTFactory} 生成されたインスタンス。
				 */
				/**
				 * @ignore
				 * @param {String}
				 *            [defaultClassType] 標準のクラス種別
				 * @param {Object.
				 *            <String,
				 *            h5connect.model.IOTFactory~InitialParameters>}
				 *            [initialMap] 初期登録データのマッピング
				 */
				constructor : function IOTFactory(defaultClassType) {
					super_.constructor.call(this);
					this.defaultClassType = defaultClassType || '';
					this._classes = new Map();
				},

				/**
				 * 引数に指定した種別がファクトリに登録されているかどうかを取得する。
				 * 
				 * @param {String}
				 *            type 登録の確認を行う種別
				 * @return {Boolean} 登録されていた場合true、されていない場合false
				 */
				has : function(type) {
					return this._classes.has(type);
				},

				/**
				 * 引数の種別と追加パラメータを使用して、登録済みの定義からオブジェクトを取得する。
				 * 
				 * @param {String}
				 *            type 種別
				 * @param {Object}
				 *            [params] 追加パラメータ
				 * @return {*} 取得されたオブジェクト
				 */
				createObject : function(type, params) {
					if (!this.has(type)) {
						throw new Error('存在しない種別です： ' + type);
					}

					var classObject = this._classes.get(type);
					return classObject.create(params);
				},

				// /**
				// * ファクトリに定義を登録する。
				// *
				// * @param {String} type 種別
				// * @param {Object} params ファクトリに登録されているクラスのインスタンス生成に使用されるパラメータ
				// * @param {String} [params.type] 登録されているクラス種別。設定しない場合{@link
				// h5connect.model.IOTFactory#defaultClassType
				// defaultClassType}が使用される。
				// */
				// register: function(type, params) {
				// var classType = params.type || this.defaultClassType;
				// if (!this._classes.has(classType)) {
				// throw new Error('存在しないクラス種別です： ' + classType);
				// }
				//
				// // Materialの初期化パラメーターにtypeを渡すと正しくレンダリングされない
				// params = $.extend({}, params);
				// delete params.type;
				//
				// var classObject = this._classes.get(classType);
				// this._map.set(type, classObject.create(params));
				// },

				/**
				 * クラス定義を登録する。
				 * 
				 * @param {String}
				 *            type クラス種別
				 * @param {*}
				 *            classObject クラスオブジェクト
				 */
				register : function(type, classObject) {
					this._classes.set(type, classObject);
				}
			}
		}
	});
	h5.u.obj.expose("h5connect.model", {
		IOTFactory : IOTFactory,
	});
});