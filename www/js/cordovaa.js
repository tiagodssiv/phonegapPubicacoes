var pictureSource;   // picture source
var destinationType; // sets the format of returned value

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
	
}

function clearCache() {
    navigator.camera.cleanup();
}

var retries = 0;
function onCapturePhoto(fileURI) {
    var win = function (r) {
        clearCache();
        retries = 0;
        alert('Done!');
    }

    var fail = function (error) {
        if (retries == 0) {
            retries ++
            setTimeout(function() {
                onCapturePhoto(fileURI)
            }, 1000)
        } else {
            retries = 0;
            clearCache();
            alert('Ups. Something wrong happens!');
        }
    }

    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.params = {}; // if we need to send parameters to the server request
    var ft = new FileTransfer();
    ft.upload(fileURI, encodeURI( "http://sistemerc.freetzi.com/publica.php"), win, fail, options);
}

function capturePhoto() {
    navigator.camera.getPicture(onCapturePhoto, onFail, {
        quality: 100,
        destinationType: destinationType.FILE_URI
		alert("ok");
    });
}

function onFail(message) {
    alert('Failed because: ' + message);
}