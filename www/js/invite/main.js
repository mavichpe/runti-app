/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var InviteApp = {
    initialize: function() {
        InviteApp.bindEvents();
    },
    bindEvents: function() {
        $("#search-input").tokenInput(backend.url + "users/search?appKey=" + backend.key, {
            hintText: "Ingrese el nombre de su amigo",
            noResultsText: "No hay resultados",
            method: "POST",
            dataType: 'json',
            searchingText: "Buscando ...",
            queryParam: 'filter',
            placeholder: 'Ingrese Nombre o Correo electronico',
            target: '.invitedFriends',
            defaultAction: true,
        });

    },
    invitar: function() {
        facebookConnectPlugin.showDialog({method: 'apprequests',
            message: 'Runti el app para corredores'
        }, function(response) {
            console.log(response);
        });
    },
    getUserList: function() {
        var users = new Array();
        friends = $('.invitedFriends li.user-search-result');
        friends.each(function(index, item) {
            if ($(item).attr('user-id') != null) {
                var user = {
                    id: $(item).attr('user-id'),
                    name: $(item).attr('user-name'),
                    fcid: $(item).attr('user-fcid'),
                };
                users.push(user);
            }
        });
        return users;
    }
}