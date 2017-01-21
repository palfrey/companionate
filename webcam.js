var image;
var last = Date.now();
var DEBUG = 0;
var webCamActive = true;
var zxing = null;

var startZXing = function() {
	if (zxing == null) {
		zxing = ZXing();
	}
	runZXing();
};

function log() {
	if (!DEBUG) return;
	var now = Date.now();
	var args = Array.prototype.slice.call(arguments);
	args.unshift('+' + (now - last) + 'ms');
	console.log.apply(console, args);
	last = now;
}

function runZXing() {
	// start
	var video = document.getElementById('webcamVideo');
	video.autoplay = true;

	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

	var tw = 640 // 320 // 640 // 1280;
	var th = 480 // 240 // 480 // 720

	var hdConstraints = {
		audio: false,
		video: {
			mandatory: {
				maxWidth: tw,
				maxHeight: th
			}
		}
	};

	if (navigator.getUserMedia) {
		navigator.getUserMedia(hdConstraints, success, errorCallback);
	} else {
		errorCallback('');
	}

	function errorCallback(e) {
		console.log("Can't access user media", e);
	}

	function success(stream) {
		console.log('success', stream);
		video.src = window.URL.createObjectURL(stream);
		video.onclick = function() { video.play(); };
		video.play();

		var decodeCallback = function(ptr, len, resultIndex, resultCount) {
			var result = new Uint8Array(zxing.HEAPU8.buffer, ptr, len);
			var str = String.fromCharCode.apply(null, result);
			if (resultIndex === 0) {
				window.resultString = '';
			}
			window.resultString += str + '<br>';
		};
		var decodePtr = zxing.Runtime.addFunction(decodeCallback);

		function getFrame() {
            if (!webCamActive) {
				console.log("Inactive webcam");
				var track = stream.getTracks()[0];
				track.stop();
                return;
			}
			requestAnimationFrame(getFrame);

			if (!video.videoWidth) return;

			if (!image) {
				width = video.videoWidth, height = video.videoHeight;
				log('video', width, height, video);

				var canvas = document.getElementById('qrCanvas');
				canvas.width = width;
				canvas.height = height;
				canvas.style.transform = 'scale(-1, 1)';

				ctx = canvas.getContext('2d');

				log('start');

				image = zxing._resize(width, height);
				log('_xsetup', image, 'pointer');
				return;
			}

			log('interval')
			console.time('a')
			ctx.drawImage(video, 0, 0, width, height);
			var imageData = ctx.getImageData(0,0, width, height);
			data = imageData.data;

			for (var i=0, j=0; i<data.length; i+=4, j++) {
				zxing.HEAPU8[image + j] = 0.2989 * data[i + 0] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2] ;
			}

			var err = zxing._decode_qr_multi(decodePtr);
			if (err) {
				scanned.innerHTML = "Can't find a QR Code";
			}
			else {				
				lastScanned.innerHTML = scanned.innerHTML = window.resultString;
			}

			//console.timeEnd('a')
		}
		getFrame();
	};
};