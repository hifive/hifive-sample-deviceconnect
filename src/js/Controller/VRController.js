$(function() {
	var Utils = h5connect.common.Utils;
	var FileConnector = h5connect.connector.FileConnector;
	var FileModel = h5connect.model.FileModel;

	var NOT_INITIALIZED = 0;
	var INITIALIZE_CALLED = 1;
	var INITIALIZED = 2;

	var VRController = {
		__name: "h5connect.controller.VRController",

		_initialized: null,

	    /**
		 * @private
		 * @type {h5connect.common.dconnectcontroller}
		 */
	    dConnect: h5connect.common.dconnect,

	    /**
		 * @private
		 * @type
		 */
	    container: null,

	    /**
		 * @private
		 * @type
		 */
	    threeScene: null,

	    /**
		 * @private
		 * @type
		 */
	    camera: null,

	    /**
		 * @private
		 * @type
		 */
	    renderer: null,

	    /**
		 * @private
		 * @type
		 */
	    imageRenderer: null,

	    /**
		 * @private
		 * @type
		 */
	    videoRenderer: null,

	    /**
		 * @private
		 * @type
		 */
	    control: null,

	    /**
		 * @private
		 * @type
		 */
	    orbitControls: null,


	    /**
		 * @private
		 * @type
		 */
	    accelControls: null,

	    /**
		 * @private
		 * @type
		 */
	    effect: null,

	    /**
		 * @private
		 * @type
		 */
	    clock: null,

	    /**
		 * @private
		 * @type
		 */
	    animateId: null,

	    /**
		 * @private
		 * @type
		 */
	    vrImageMesh: null,

	    /**
		 * @private
		 * @type
		 */
	    vrVideoMesh: null,

	    isDragging: null,

	    loading: null,


	    /**
		 * @private
		 * @type
		 */
	    fileConnector: null,

	    /**
		 * @private
		 * @type
		 */

		__init: function(context) {
	    	this.fileConnector = FileConnector.create();;

	    	var that = this;
	    	this.loading = this.indicator({target: document});
			this._initialized = NOT_INITIALIZED;
			this.isDragging = false;

	        this.clock = new THREE.Clock();

			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setPixelRatio( window.devicePixelRatio );
			var element = this.renderer.domElement;
			this.container = $('#webglcontent')[0];
			this.container.appendChild(element);

	        this.effect = new THREE.StereoEffect(this.renderer);

			this.threeScene = new THREE.Scene();
			this.threeScene.background = new THREE.Color( 0x101010 );
			// export for inspector
	        window.scene = this.threeScene;

			this.camera = new THREE.PerspectiveCamera(75, 1, 1, 2000);
			this.camera.position.set(0, 0, 0.1);
			this.threeScene.add(this.camera);

			var directionalLight = new THREE.DirectionalLight( 0xffffff );
			directionalLight.position.set( 0, 0.7, 0.7 );
			this.threeScene.add( directionalLight );

			this.orbitControls = new THREE.OrbitControls(this.camera, this.container);
			this.orbitControls.target.set(
				this.camera.position.x,
				this.camera.position.y,
				this.camera.position.z - 0.1
	        );
			this.orbitControls.enablePan = false;
			this.orbitControls.enableZoom = false;

			this.accelControls = new THREE.DeviceOrientationControls(this.camera, true);

			this.control = this.orbitControls;

			$(window).bind('deviceorientation', function(e) {
				if (!e.originalEvent.alpha || that.control == that.accelControls
						|| that.isDragging) {
		    		return;
		    	}
				that.control = that.accelControls;
				that.control.connect();
				that.control.update();
			});

			// Create Image Viewer
			this.createImageRenderer();

			// Create Video Viewer
			// this.createVideoRenderer();

			$(window).bind('resize', function(e) {
	        	that.resize();
			});

	        setTimeout(function(){
	        	that.resize();
	        }, 1);
			this._initialized = INITIALIZE_CALLED;
		},

		__ready: function(context) {

			var that = this;
	    	$(this.rootElement).show();
	        this.animate();
		},

		__dispose: function() {
			this.container.removeChild(this.renderer.domElement);
	    	cancelAnimationFrame(this.animateId);
			this.renderer = null;
	    	$(this.rootElement).hide();
		},

	    createImageRenderer: function() {
	    	var texture = new THREE.Texture();
	    	texture.minFilter = THREE.LinearFilter;
	    	texture.needsUpdate = true;
			var material = new THREE.MeshBasicMaterial({
                map : texture// .load(
								// 'src/css/res/2294472375_24a3b8ef46_o.jpg'
			});

			var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
			// invert the geometry on the x-axis so that all of the faces point
			// inward
			geometry.scale( - 1, 1, 1 );

			this.vrImageMesh = new THREE.Mesh( geometry, material );
			this.vrImageMesh.material.needsUpdate = true;
			this.vrImageMesh.material.map.needsUpdate = true;
			this.vrImageMesh.visible = false;
	        this.threeScene.add(this.vrImageMesh);
	    },

	    createVideoRenderer: function() {
			var video = document.createElement( 'video' );
			video.loop = true;
			video.muted = true;
			video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );

	    	var texture = new THREE.VideoTexture( video );
	    	texture.generateMipmaps = false;
			texture.minFilter = THREE.LinearFilter;
			texture.maxFilter = THREE.LinearFilter;
			texture.format = THREE.RGBFormat;

			// left
			var geometry = new THREE.SphereGeometry( 500, 60, 40);
			// invert the geometry on the x-axis so that all of the faces point
			// inward
			geometry.scale( - 1, 1, 1 );

			var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
			var fisheyeRadius = 435;
			var yFromCenter = 595;
	        for ( i = 0; i < faceVertexUvs.length; i ++ ) {
                var uvs = faceVertexUvs[ i ];
                var face = geometry.faces[ i ];
                for ( var j = 0; j < 3; j ++ ) {
                    var x = face.vertexNormals[ j ].x;
					var y = face.vertexNormals[ j ].y;
					var z = face.vertexNormals[ j ].z;

					if (i < faceVertexUvs.length / 2) {
						var correction = (x == 0 && z == 0) ? 1 : (Math.acos(y) / Math.sqrt(x * x + z * z)) * (2 / Math.PI);
                        uvs[ j ].x = x * (fisheyeRadius / 1920) * correction + (475 / 1920);
                        uvs[ j ].y = -z * (fisheyeRadius / 1080) * correction + ((yFromCenter + 5) / 1080);
                    } else {
						var correction = ( x == 0 && z == 0) ? 1 : (Math.acos(-y) / Math.sqrt(x * x + z * z)) * (2 / Math.PI);
                        uvs[ j ].x = x * (fisheyeRadius / 1920) * correction + (1448 / 1920);
                        uvs[ j ].y = z * (fisheyeRadius / 1080) * correction + ((yFromCenter + 5) / 1080);
                    }
                }
	        }
	        geometry.rotateZ(-Math.PI / 2);

			var material = new THREE.MeshBasicMaterial( { map: texture } );
			this.vrVideoMesh = new THREE.Mesh( geometry, material );
			this.vrVideoMesh.material.needsUpdate = true;
			this.vrVideoMesh.material.map.needsUpdate = true;
			this.vrVideoMesh.rotation.y = - Math.PI / 2;
			this.vrVideoMesh.visible = true;
			this.threeScene.add( this.vrVideoMesh );
	    },

	    loadImage: function(image) {
			var texture = new THREE.Texture();
	    	texture.needsUpdate = true;
	    	texture.minFilter = THREE.LinearFilter;
	    	texture.image = image;

			this.vrImageMesh.material.map = texture;
			this.vrImageMesh.visible = true;
			this.vrVideoMesh.visible = false;
		},

	    changeVideoTexture: function(video) {
			video.play();
	    	this.vrImageMesh.visible = false;
			this.vrVideoMesh.visible = true;

	    	var texture = new THREE.VideoTexture( video );
	    	texture.generateMipmaps = false;
	    	texture.minFilter = THREE.LinearFilter;
			texture.maxFilter = THREE.NearestFilter;
			texture.format = THREE.RGBFormat;

	    	this.vrVideoMesh.material.map = texture;
	    },

	    update : function(dt) {
			this.resize();

			this.camera.updateProjectionMatrix();

			this.control.update(dt);
	    },

	    render: function(dt) {
	    	if(this.isFullSrcreen()){
		    	this.effect.render(this.threeScene, this.camera);
	    	} else {
		    	this.renderer.render(this.threeScene, this.camera);
	    	}
	    },

	    animate: function() {
	    	this.animateId = requestAnimationFrame(this.own(this.animate));

	    	this.update(this.clock.getDelta());
	    	this.render(this.clock.getDelta());
	    },

	    resize: function() {
			var width = this.container.offsetWidth;
			var height = this.container.offsetHeight;
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();

			this.renderer.setSize(width, height);

	    	if(this.isFullSrcreen()){
				this.effect.setSize(width, height);
	    	}
	    },

	    fullscreen: function() {
			if (this.container.requestFullscreen) {
				this.container.requestFullscreen();
// this.isFullscreen = true;
			} else if (this.container.msRequestFullscreen) {
				this.container.msRequestFullscreen();
// this.isFullscreen = true;
			} else if (this.container.mozRequestFullScreen) {
				this.container.mozRequestFullScreen();
// this.isFullscreen = true;
			} else if (this.container.webkitRequestFullscreen) {
				this.container.webkitRequestFullscreen();
// this.isFullscreen = true;
			}
	    },

	    isFullSrcreen: function() {
	    	var full_screen_element = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;

	    	// If no element is in full-screen
	    	if(full_screen_element === null){
	    		return false;
	    	}
	    	else{
	    		return true;
	    	}
	    },

	    setOrientationControls: function(e) {
	    	if (!e.alpha) {
	    		return;
	    	}
// this.vrControls = new THREE.DeviceOrientationControls(this.camera, true);
// this.vrControls.connect();
// this.vrControls.update();
// var that = this;
// $(window).unbind('deviceorientation');
	    },
	    '#webglviewer mousedown': function(){
	    	if(this.control == this.orbitControls){
	    		return;
	    	}
	    	this.isDragging = true;
	    	this.control = this.orbitControls;
// this.control.reset();
	    	this.control.update();
	    },

        '#webglviewer touchstart': function(e){
	    	if(this.control == this.orbitControls){
	    		return;
	    	}
	    	this.isDragging = true;
	    	this.control = this.orbitControls;
// this.control.reset();
	    	this.control.update();
        },

	    '#webglviewer mouseup': function(){
	    	this.isDragging = false;
	    },
        '#webglviewer touchend': function(){
	    	this.isDragging = false;
        },
	    '#vrBtn click': function(context) {
			this.fullscreen();
	    },
	    '.thumbnail click': function(context, $element) {
        	if(this.vrImageMesh.visible){
        		this.changeImageTexture($element.attr('src'));
        	}
	    },
	};
	h5.u.obj.expose("h5connect.controller", {
		VRController: VRController,
	});
});