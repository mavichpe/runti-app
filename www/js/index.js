/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    pictureSource: '',
    destinationType: '',
    actionFrontQuote: false,
    actionQuote: new Array(),
    menuOnAnimate: false,
    pushEventToQuote: function (action) {
        if (!this.actionFrontQuote) {
            if (typeof action == 'function') {
                app.actionQuote.push(action);
            }
            else {
                app.actionQuote.push(new Function(action));
            }
        }
    },
    shareLink: function (url) {
        window.plugins.socialsharing.share(null, null, null, url);
    },
    openUrl: function (link) {
        var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
        if (deviceType == 'Android')
            navigator.app.loadUrl(link, {openExternal: true});
        else
            window.open(link, '_system');
    },
    popEventToQuote: function () {
        if (app.actionQuote.length != 0) {
            var action = app.actionQuote.pop();
            this.actionFrontQuote = true;
            action.call();
            this.actionFrontQuote = false;
        } else {
            history.back();
            homeApp.hideMenu();
        }
    },
    goBack: function () {
        this.popEventToQuote();
    },
    beforeRender: function ($scope, localStorageService) {
        var template = localStorageService.get('userTemplate');
        $('html').addClass('theme' + template);
    },
    showHome: function () {
        app.showToolbar();
        app.isMenuAble = true;
        location.href = "#/home"
    },
    eventMenuItem: {
        1: {
            class: 'hora',
            title: 'Hora'
        },
        2: {
            class: 'mapa',
            title: 'Mapa'
        },
        3: {
            class: 'inscripciones',
            title: 'Inscripción'
        },
        4: {
            class: 'costo',
            title: 'Costo'
        },
        5: {
            class: 'kit',
            title: 'Kit'
        },
        6: {
            class: 'social',
            title: 'Social'
        },
    },
    toolbar: jQuery('.toolbar'),
    isMenuAble: false,
    initialize: function () {
    },
    makeCall: function (number) {
        location.href = 'tel:' + number;
    },
    setAppGesture: function () {
        Hammer($('.views')).on('swipeleft', function () {
            if (isMenuAble)
                $('.toggle-push-right').trigger('tap');
        });
        Hammer($('.views')).on('swiperight', function () {
            if (isMenuAble)
                $('.toggle-push-left').trigger('tap');
        });
    },
    showLoading: function (text) {
        $('#loading-overlay').addClass('show');
        if (!$.isEmptyObject(text)) {
            $('#loading-overlay .message').text(text);
        }
    },
    hideLoading: function () {
        $('#loading-overlay').removeClass('show');
    },
// Bind any events that are required on startup. Common events are:
// 'load', 'deviceready', 'offline', and 'online'.
    showToolbar: function () {
        app.toolbar.addClass('show');
    },
    hideToolbar: function () {
        app.toolbar.removeClass('show');
    },
};
