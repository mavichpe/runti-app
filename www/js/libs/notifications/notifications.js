var pushNotification;
var configuration_android = {
    badge: 'true',
    sound: 'true',
    alert: 'true',
    senderID: '69004002716',
    ecb: 'onNotification',
};
var configuration_ios = {
    badge: 'true',
    sound: 'true',
    alert: 'true',
    ecb: 'onNotificationAPN',
};

function notificationSetup() {
    sessionStorage.deviceKind = -1;
    try {
        pushNotification = window.plugins.pushNotification;
        var deviceType = (navigator.userAgent.match(/iPad/i)) == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
        console.log(deviceType);
        jQuery('body').addClass(deviceType.toLowerCase());
        if (deviceType == 'android' || deviceType == 'Android') {
            pushNotification.register(successHandler, errorHandler, configuration_android);
        } else {
            pushNotification.register(tokenHandler, errorHandler, configuration_ios);
        }
    } catch (err) {
        alert(err);
        console.log(err);
    }
    console.log('entre a setup noti');
    sessionStorage.messages = {};
}

function onNotificationAPN(e) {
    if (e.alert) {
        navigator.notification.alert(e.alert);
    }

    if (e.sound) {
        if (e.user != 0) {
            var message = {
                user: e.user,
                message: e.body
            }
            ChatApp.showMessage(message);
        }
        var snd = new Media(e.sound);
        snd.play();
    }

    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber("successHandler", e.badge);
    }
}

function onNotification(e) {
    switch (e.event) {
        case 'registered':
            console.log(e.regid);
            sessionStorage.regid = e.regid;
            sessionStorage.deviceKind = 0;
            break;
        case 'message':
            //window.location.href = e.payload.route;
            console.log(JSON.stringify(e));
            if (e.payload.user != 0)
                ChatApp.showMessage(e.payload);
            break;
        case 'error':
            break;
    }
}

function tokenHandler(result) {
    sessionStorage.regid = result;
    sessionStorage.deviceKind = 1;
}

function successHandler(result) {
}

function errorHandler(error) {
}
