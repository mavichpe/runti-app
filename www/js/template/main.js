/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var TemplateApp = {
    initialize: function() {
        TemplateApp.bindEvents();
    },
    bindEvents: function() {
        $('.template-options a').click(function() {
            var newTemplate = $(this).attr('templateId');
            $("#currentTemplate").val(newTemplate);
            $("html").attr('class', 'theme' + newTemplate);
            $('.template-options a').removeClass('current');
            $(this).addClass('current');

        });
    },
}