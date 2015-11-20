/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var ImageUploadApp = {
    $scope: '',
    indexImg: 0,
    initialize: function ($scope) {
        ImageUploadApp.$scope = $scope;
    },
    showCommentBox: function () {
    },
    capturePhoto: function () {
        navigator.camera.getPicture(ImageUploadApp.addPhotoToForm, ImageUploadApp.onFail, {
            quality: 30,
            targetWidth: 1024,
            targetHeight: 1024,
            destinationType: app.destinationType.FILE_URI,
            saveToPhotoAlbum: true,
            correctOrientation: true
        });
    },
    getPhoto: function () {
        window.imagePicker.getPictures(
                function (results) {
                    for (var i = 0; i < results.length; i++) {
                        ImageUploadApp.addImageToForm(results[i]);
                    }
                    ImageUploadApp.$scope.$apply();
                }, function (error) {
            alert('Error: ' + error);
        }, {
            maximumImagesCount: 10,
            width: 1024
        }
        );
    },
    onFail: function (message) {
//        alert('Failed because: ' + message);
    },
    addPhotoToForm: function (path) {
        ImageUploadApp.addImageToForm(path);
        ImageUploadApp.$scope.$apply();
    },
    addImageToForm: function (path) {
        $('.upload').show();
        var image = $('<div class="item" />');
        image.append('<img src="' + path + '" ">');
        image.append('<div class="close-bt" onclick="ImageUploadApp.deleteImg(this)"></div>');
        image.append('<input type="file" name="data[Image][' + ImageUploadApp.indexImg + '][url]" value="' + path + '" style="display:none;">');
        ImageUploadApp.indexImg++;
        $('#select-images').append(image);

    },
    deleteImg: function (elem) {
        $(elem).closest('.item').remove();
    }
}

