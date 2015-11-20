/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var StickerApp = {
    myAccordion: '',
    initialize: function () {
        StickerApp.bindEvents();
//        StickerApp.myAccordion = new accordion('accordion');
    },
    bindEvents: function () {
        var inputs = $(".friend-search");
        $(inputs).each(function (index, item) {
            var user = $(item).attr('user-id');
            //$(item).tokenInput(backend.url + "users/searchFriends/" + user + "?appKey=" + backend.key, {
            $(item).tokenInput(backend.url + "users/search?appKey=" + backend.key, {
                hintText: "Ingrese el nombre de su amigo",
                noResultsText: "No hay resultados",
                method: "POST",
                dataType: 'json',
                searchingText: "Buscando ...",
                queryParam: 'filter',
                placeholder: 'Ingrese Nombre o Correo electronico',
                defaultAction: true,
                //preventDuplicates: true,
                theme: 'facebook'
            });

        });

    },
    selectSticker: function (elemt) {
        if (!$('.select-sticker').hasClass('onSelect')) {
            $('#sticker-class').val($(elemt).attr('stickerid'));
            $('.select-sticker').addClass('onSelect');
            $('.select-sticker .list > li').not(elemt).addClass('hide');
            $(elemt).addClass('hide-selected');
            setTimeout(function () {
                $(elemt).removeClass('hide-selected').addClass('fullwidth selected');
                $(elemt).find('.send-box').addClass('show');
            }, 800);
        }
    },
    closeStickerSelection: function (elemt) {
        if ($('.select-sticker').hasClass('onSelect')) {
            elemt = $(elemt).closest('li');
            $(elemt).addClass('hide-selected');
            setTimeout(function () {
                $(elemt).addClass('hide');
                $(elemt).removeClass('fullwidth');
                setTimeout(function () {
                    $(elemt).removeClass('selected');
                    $(elemt).find('.send-box').removeClass('show');
                    $('.select-sticker li').removeClass('hide');
                    $(elemt).removeClass('hide-selected');
                    $('.select-sticker').removeClass('onSelect');
                }, 50);
            }, 800);
        }
    },
    showSticker: function () {
        $('#mask,.popup.select').addClass('show');
    },
    closeSticker: function (elemt) {
        $(elemt).closest('.app-popup').removeClass('show');
        $('#mask').removeClass('show');


    }
}