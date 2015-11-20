/**
 * The nav stuff
 */
var activeNav;
var events = {
    left: function() {
        body = document.body;
        mask = document.createElement("div");
        mask.className = "mask";
        mask.addEventListener("click", function() {
            homeApp.hideMenu();
        });
        classie.add(body, "pml-open");
        setTimeout(function() {
            document.body.appendChild(mask);
        }, 400);
        activeNav = "pml-open";
    },
    right: function() {
        body = document.body;
        mask = document.createElement("div");
        mask.className = "mask";
        mask.addEventListener("click", function() {
            homeApp.hideMenu();
        });
        classie.add(body, "pmr-open");
        activeNav = "pmr-open";
        app.menuOnAnimate = true;
        setTimeout(function() {
            document.body.appendChild(mask);
        }, 400);
        setTimeout(function() {
            app.menuOnAnimate = false;
        }, 700);

    }
};
(function(window) {

    'use strict';
    var body = document.body,
            mask = document.createElement("div"),
            toggleSlideLeft = document.querySelector(".toggle-slide-left"),
            toggleSlideRight = document.querySelector(".toggle-slide-right"),
            toggleSlideTop = document.querySelector(".toggle-slide-top"),
            toggleSlideBottom = document.querySelector(".toggle-slide-bottom"),
            togglePushLeft = document.querySelector(".toggle-push-left"),
            togglePushRight = document.querySelector(".toggle-push-right"),
            togglePushTop = document.querySelector(".toggle-push-top"),
            togglePushBottom = document.querySelector(".toggle-push-bottom");
    mask.className = "mask";
    /* slide menu left */
    if (toggleSlideLeft != null)
        toggleSlideLeft.addEventListener("click", function() {
            classie.add(body, "sml-open");
            document.body.appendChild(mask);
            activeNav = "sml-open";
        });
    /* slide menu right */
    if (toggleSlideRight != null)
        toggleSlideRight.addEventListener("click", function() {
            classie.add(body, "smr-open");
            document.body.appendChild(mask);
            activeNav = "smr-open";
        });
    /* slide menu top */
    if (toggleSlideTop != null)
        toggleSlideTop.addEventListener("click", function() {
            classie.add(body, "smt-open");
            document.body.appendChild(mask);
            activeNav = "smt-open";
        });
    /* slide menu bottom */
    if (toggleSlideBottom != null)
        toggleSlideBottom.addEventListener("click", function() {
            classie.add(body, "smb-open");
            document.body.appendChild(mask);
            activeNav = "smb-open";
        });
    /* push menu left */
    if (togglePushLeft != null)
        Hammer(togglePushLeft).on('tap', function() {
            events.left();
        });
    /* push menu right */
    if (togglePushRight != null)
        Hammer(togglePushRight).on('tap', function() {
            events.right();
        });
    /* push menu top */
    if (togglePushTop != null)
        togglePushTop.addEventListener("click", function() {
            classie.add(body, "pmt-open");
            document.body.appendChild(mask);
            activeNav = "pmt-open";
        });
    /* push menu bottom */
    if (togglePushBottom != null)
        togglePushBottom.addEventListener("click", function() {
            classie.add(body, "pmb-open");
            document.body.appendChild(mask);
            activeNav = "pmb-open";
        });
    /* hide active menu if mask is clicked */
    if (mask != null)
        mask.addEventListener("click", function() {
            homeApp.hideMenu();
        });

    /* hide active menu if close menu button is clicked */
    [].slice.call(document.querySelectorAll(".close-menu")).forEach(function(el, i) {
        el.addEventListener("click", function() {
            classie.remove(body, activeNav);
            activeNav = "";
            document.body.removeChild(mask);
        });
    });

})(window);