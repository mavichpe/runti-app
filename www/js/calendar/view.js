/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var myAccordion;
var CalendarViewApp = {
    months: {
        1: 'Enero',
        2: 'Febrero',
        3: 'Marzo',
        4: 'Abril',
        5: 'Mayo',
        6: 'Junio',
        7: 'Julio',
        8: 'Agosto',
        9: 'Septiembre',
        10: 'Octubre',
        11: 'Noviembre',
        12: 'Diciembre'
    },
    itemHeight: 70,
    initialize: function () {
        CalendarViewApp.bindEvents();
        CalendarViewApp.setListitemPosition();
    },
    setListitemPosition: function () {
        var items = $('.next-events > li');
        items.each(function (index, item) {
            $(item).css('top', index * CalendarViewApp.itemHeight);
        });
        var eventContent = $('.next-events .event-menu-content > div');
        eventContent.each(function (index, item) {
            CalendarViewApp.setItemPosition(item);
        });
    },
    setItemPosition: function (item) {
        var height = 0;
        if ($(item).attr('initial-heigth') == null) {
            height = $(item).outerHeight();
            $(item).attr('initial-heigth', height);
        } else
            height = $(item).attr('initial-heigth');
        $(item).css('transform', 'translate3d(0, -' + height + 'px, 0)');
        $(item).css('-webkit-transform', '-webkit-transform(0, -' + height + 'px, 0)');
    },
    setItemPositionToZero: function (item) {
        $(item).css('transform', 'translate3d(0, 0, 0)');
        $(item).css('-webkit-transform', '-webkit-transform(0, 0, 0)');
    },
    removeItemPosition: function (item) {
        $(item).css('transform', '');
        $(item).css('-webkit-transform', '');
    },
    disableItemAnimation: function (item) {
        $(item).css('transition', '0s all');
        $(item).css('-webkit-transition', '0s all');
        setTimeout(function () {
            $(item).css('transition', '');
            $(item).css('-webkit-transition', '');
        }, 700);
    },
    showSubMenu: function (item) {
        item.addClass('showMenu');
        $('.next-events li:nth-child(n+' + (item.index() + 2) + ')').addClass('otherSubMenuOpen');
    },
    hideCurrentViewContent: function () {
        var eventContent = $('.next-events .event-menu-content.showContent').css('height', 0).removeClass('showContent').find('> div');
        eventContent.each(function (index, item) {
            CalendarViewApp.setItemPosition(item);
        });
        var options = $('.event-clickable');
        options.each(function (index, item) {
            CalendarViewApp.removeItemPosition(item);
        });
    },
    clearSubMenuItem: function (item) {
        $('.next-events li').removeClass('otherSubMenuOpen');
        if ($('.next-events li.showMenu').length > 0)
            $('.next-events li').addClass('resetMenu');
        $('.next-events li').removeClass('showMenu');
        setTimeout(function () {
            $('.next-events li').removeClass('resetMenu');
        }, 650);
    },
    bindEvents: function () {
        Hammer($('.option-title .event-title')).on('tap', function () {
            var parent = $(this).closest('.event-clickable');
            if (!parent.hasClass('showMenu')) {
                $('.active').removeClass('active');
                CalendarViewApp.hideCurrentViewContent();
                CalendarViewApp.clearSubMenuItem(parent);
                CalendarViewApp.showSubMenu(parent);
            } else {
                CalendarViewApp.hideCurrentViewContent();
                CalendarViewApp.clearSubMenuItem(parent);
            }
        });
        Hammer($('.mapa-index li')).on('tap', function () {
        }
        );
    },
    resetMapaContent: function () {
        var currentMap = $('.mapa-index').find('.currentMap');
        if (currentMap.lenght != 0) {
            currentMap.removeClass('currentMap');
            currentMap.closest('.map-wrapper').removeClass('activeMap');

            currentMap.css('height', 0);
            CalendarViewApp.setItemPosition(currentMap);
        }
    },
    showMapa: function (idMapa) {
        var mapa = $('.mapa-id-' + idMapa);
        if (!mapa.hasClass('currentMap')) {
            mapa.closest('.map-wrapper').addClass('activeMap');
            CalendarViewApp.resetMapaContent()
            mapa.addClass('currentMap');
            var height = parseInt(mapa.attr('initial-heigth'));

            var items = mapa.closest('.mapa-index').attr('total-trips') - 1;
            mapa.css('height', height);

            height += (items * 110);
            $('.event-menu-content.showContent').css('height', height);
            CalendarViewApp.setItemPositionToZero(mapa);
            CalendarViewApp.moveOtherItem(height, mapa);
        }
    }
    , showEventInfo: function (kind, eventId) {
        if ($('.event-clickable[event-id="' + eventId + '"]').hasClass('showMenu')) {
            kind = $('.event-clickable[event-id="' + eventId + '"] .event-menu .' + kind);
            if (!kind.hasClass('active')) {
                var activeKind = $('.event-clickable[event-id=' + eventId + '] .event-menu li.active');
                kind.parent().find('li.active').removeClass('active');
                kind.addClass('active');
                var fullContenDiv = $('.event-clickable[event-id=' + eventId + '] .event-menu-content');
                if (!fullContenDiv.hasClass('showContent')) {
                    fullContenDiv.addClass('showContent');
                }
                var nextTipo = kind.attr('kind');
                CalendarViewApp.resetMapaContent()

                if (nextTipo == 'mapa') {
                    $('.event-clickable[event-id="' + eventId + '"]  .map-content').css('height', 'auto');
                    $('.event-clickable[event-id="' + eventId + '"]  .map-content').each(function (index, item) {
                        CalendarViewApp.setItemPosition(item);
                        $(item).css('height', 0);
                    });

                }

                var nextItem = fullContenDiv.find('> .' + nextTipo);
                var nextHeight = parseInt(nextItem.attr('initial-heigth'));
                nextItem.closest('.event-menu-content').css('height', nextHeight);
                CalendarViewApp.setItemPositionToZero(nextItem);
                if (activeKind.length > 0) {
                    var activeTipo = activeKind.attr('kind');
                    var activeItem = fullContenDiv.find('> .' + activeTipo);
                    var moveActiveHeight = parseInt(activeItem.attr('initial-heigth')) + nextHeight;
                    activeItem.css('transform', 'translate3d(0, ' + moveActiveHeight + 'px, 0)');
                    activeItem.css('-webkit-transform', '-webkit-transform(0, ' + moveActiveHeight + 'px, 0)');
                }
                CalendarViewApp.moveOtherItem(nextHeight, nextItem);
                setTimeout(function () {
                    if (activeItem != null && activeItem.length > 0) {
                        CalendarViewApp.disableItemAnimation(activeItem);
                    }
                    CalendarViewApp.restartOtherItemStyle(nextItem);
                }, 700);
            }
        }
    },
    moveOtherItem: function (moveHeight, nextItem) {
        if ($(window).width() < 480)
            moveHeight = parseInt(moveHeight) + 150 + 30;
        else
            moveHeight = parseInt(moveHeight) + CalendarViewApp.itemHeight + 30;
        if (!$('.next-events').hasClass('showingContent')) {
            $('.next-events').addClass('showingContent');
        }
        var anotherItems = $('.next-events .event-clickable:nth-child(n+' + (nextItem.closest('.event-clickable').index() + 2) + ')').not('.showMenu');
        anotherItems.css('transform', 'translate3d(0, ' + moveHeight + 'px, 0)');
        anotherItems.css('-webkit-transform', '-webkit-transform(0, ' + moveHeight + 'px, 0)');
    },
    restartOtherItemStyle: function (nextItem) {
        var anotherItems = $('.next-events .event-menu-content.showContent > div').not(nextItem);
        anotherItems.each(function (index, item) {
            CalendarViewApp.setItemPosition(item);
        });
    }
}