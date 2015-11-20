/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var ImageListApp = {
    initialize: function () {
        ImageListApp.bindEvents();
        ImageListApp.createMosaic();
    },
    createMosaic: function () {
        new AnimOnScroll(document.getElementById('grid'), {
            minDuration: 0.4,
            maxDuration: 0.7,
            viewportFactor: 0.2
        });
    },
    bindEvents: function () {
    }
}
