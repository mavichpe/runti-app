/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var ChatApp = {
    myAccordion: '',
    initialize: function () {
        ChatApp.bindEvents();
        ChatApp.myAccordion = new accordion('accordion');
    },
    bindEvents: function () {
    },
    showMessage: function (payload) {
        if (localStorage.lsmessage == null) {
            localStorage.lsmessage = {};
        }
        console.log(JSON.stringify(payload));
        if ($('#friend-id').val() != null && $('#friend-id').val() == payload.user) {
            ChatApp.addMessage(payload.message);
        } else {
            var message = {
                text: payload.message
            };
            var messages = localStorage.getItem('ls.messages');
            if (messages == null) {
                messages = {};
            } else {
                messages = JSON.parse(messages);
            }
            if (messages[payload.user] == null) {
                messages[payload.user] = new Array();
            }
            messages[payload.user].push(message);
            localStorage.setItem('ls.messages', JSON.stringify(messages));
            if (!$('.new-message').hasClass('show')) {
                $('.new-message').addClass('show');
                setTimeout(function () {
                    $('.new-message').removeClass('show');
                }, 7000);
            }
        }
    },
    addMessage: function (messageText) {
        var message = $('.friend-response-box').clone();
        message.find('.text').text(messageText);
        $('.messages').append(message.find('li'));
    }
}