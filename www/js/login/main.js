/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var login = {
    root: function () {
        return jQuery('#login');
    },
    logo: function () {
        return jQuery('#login .logo');
    },
    builds: function () {
        return jQuery('#login .builds');
    },
    runti: function () {
        return jQuery('#login .runti-men');
    },
    rayoLogo: function () {
        return jQuery('#login .rayo-logo');
    },
    selectLoginMethod: function () {
        return jQuery('#login .select-login-method');
    },
    loginMethod: function () {
        return jQuery('#login .login-method');
    },
}

var loginApp = {
    loginTween: new TimelineMax({paused: true}),
    initialize: function () {
        loginApp.bindEvents();
        loginApp.showLogin();
        jQuery('#login').addClass('show');
        notificationSetup();
    },
    destroy: function () {
        $('.select-login-method').remove();
        $('.login-method').remove();
    },
    calculatePosition: function (fullvalue, imgSize) {
        var value = fullvalue / 2;
        value = value - (imgSize / 2);
        return value;
    },
    bindEvents: function () {
    },
    showLoginMethod: function (loginMethod) {
        loginApp.loginTween.tweenFromTo(loginMethod + "In", loginMethod + "Out");
    },
    onViewReady: function () {
        loginApp.showLogin();
    },
    showLogin: function () {
        loginApp.loginTween.tweenFromTo("in", "emailIn");
    },
    hideLogin: function () {
        loginApp.loginTween.tweenFromTo("hideLogin", "end");
        setTimeout(function () {
            login.root().hide();
        }, 650)
    },
    cancelLogin: function () {
        loginApp.loginTween.tweenFromTo("emailOut", "emailIn");
    },
    showHome: function () {
//        jQuery('.slide').removeClass('no-animate');
        app.hideLoading();
        loginApp.hideLogin();
        setTimeout(function () {
            app.showHome();
        }, 600);
    }
}

