/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var FriendsApp = {
    initialize: function() {
        FriendsApp.bindEvents();
    },
    bindEvents: function() {
        $("#search-input").tokenInput(backend.url + "users/search?appKey=" + backend.key, {
            hintText: "Ingrese el nombre de su amigo",
            noResultsText: "No hay resultados",
            method: "POST",
            dataType: 'json',
            searchingText: "Buscando ...",
            queryParam: 'filter',
            placeholder: 'Ingrese Nombre o Correo electronico'
        });
    },
}