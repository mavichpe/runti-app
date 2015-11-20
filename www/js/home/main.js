/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var homeApp = {
    initialize: function () {
        homeApp.bindEvents();
        homeApp.showHome();
    },
    menuItemTween: {},
    bindEvents: function () {
        Hammer($('.event-menu li')).on('tap', function () {
            homeApp.showEventInfo($(this));
        });
        Hammer($('.event-clickable')).on('tap', function () {
            if (!$(this).hasClass('showMenu')) {
                $('.event-clickable').removeClass('showMenu');
                $('.event-menu-content').removeClass('showContent');
                $('.event-menu-content .show').css('height', 0);
                $('.event-menu-content .show').removeClass('show');

                $(this).addClass('showMenu');
            }
        });
        Hammer($('.mapa-index li')).on('tap', function () {
            if (!$(this).hasClass('showMenu')) {
                $('.event-clickable').removeClass('showMenu');
                $('.event-menu-content').removeClass('showContent');
                $('.event-menu-content .show').css('height', 0);
                $('.event-menu-content .show').removeClass('show');
                $(this).addClass('showMenu');
            }
        });
        /* $('.main-menu a').click(function() {
         $('.mask').click();
         });
         Hammer($('.main-menu a')).on('tap', function() {
         homeApp.hideMenu();
         });*/
    },
    showEventInfo: function (kind) {
        if (!kind.hasClass('active')) {
            kind.parent().find('li.active').removeClass('active');
            kind.addClass('active');
            var fullContenDiv = kind.closest('.event-menu').find('+ div');
            if (!fullContenDiv.hasClass('showContent')) {
                fullContenDiv.addClass('showContent');
            }
            var tipo = kind.attr('kind');
            fullContenDiv.find('> div').css('height', 0).removeClass('show');
            var currentItem = fullContenDiv.find('> .' + tipo);
            var elemente = currentItem.clone();
            $('.hiddenContent').html('');
            elemente.css('height', 'auto');
            $('.hiddenContent').append(elemente);
            currentItem.css('height', elemente.height() + 50);
            currentItem.addClass('show');

        }
    },
    showHome: function () {
        app.showToolbar();
        app.isMenuAble = true;
    },
    hideMenu: function () {
        try {
            classie.remove(document.body, activeNav);
            activeNav = "";
            document.body.removeChild(document.querySelector('.mask'));
        } catch (err) {

        }
    }
}