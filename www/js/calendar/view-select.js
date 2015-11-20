/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CalendarSelectViewApp = {
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
    initialize: function() {
        CalendarSelectViewApp.bindEvents();
        CalendarSelectViewApp.setListitemPosition();
    },
    setListitemPosition: function() {
        var items = $('.next-events > li');
        items.each(function(index, item) {
            $(item).css('top', index * CalendarViewApp.itemHeight);
        });
        var eventContent = $('.next-events .event-menu-content > div');
        eventContent.each(function(index, item) {
            CalendarViewApp.setItemPosition(item);
        });
    },
    bindEvents: function() {
        Hammer($('.option-title .event-title')).on('tap', function() {
            $('.option-title .event-title').closest('li').removeClass('selected');
            $(this).closest('li').addClass('selected');

        });
    },
}