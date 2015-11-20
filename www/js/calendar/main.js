/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var CalendarApp = {
    initialize: function() {
    },
    showEventInfo: function(kind) {
        if (!kind.hasClass('active')) {
            kind.parent().find('li.active').removeClass('active');
            kind.addClass('active');
            var fullContenDiv = kind.closest('.event-menu').find('+ div');
            if (!fullContenDiv.is(':visible'))
                fullContenDiv.slideDown(200);
            var tipo = kind.attr('kind');
            fullContenDiv.find('> div').slideUp(600);
            var contenDiv = fullContenDiv.find('.' + tipo).slideDown(600);
        }
    },
}