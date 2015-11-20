/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



var backend = {
    url: 'http://collaboration.wamdigital.com/runti/admin/',
    //url: 'http://localhost:8888/runti-backend/',
    key: 'OGR0cC4zWVUyNjEyODFHbXN3YW04cXRlYS5W',
    login: function ($scope, localStorageService) {
        var data = {
            appKey: this.key,
            User: {
                username: $scope.mail,
                password: $scope.password
            }
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'users/login',
            data: data,
            dataType: 'json',
            success: function (data) {
                $scope.login = data.login;
                if (data.login) {
                    localStorageService.set('currentUserId', data.userId);
                    localStorageService.set('userTemplate', data.userTemplate);
                    backend.saveRegId(localStorageService);
                    $('.main-menu .login').hide();
                    $('.main-menu .logout').show();
                }
            },
            complete: function (data, da, dat) {
                console.log(data);
            }

        });
        return $scope.login;
    },
    fblogin: function (userdata, localStorageService) {
        var data = {
            appKey: this.key,
            User: userdata
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'users/fblogin',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.login) {
                    loginApp.destroy();
                    loginApp.showHome();
                    localStorageService.set('fcid', data.fcid);
                    localStorageService.set('currentUserId', data.userId);
                    localStorageService.set('userTemplate', data.userTemplate);
                    backend.saveRegId(localStorageService);
                    $('.main-menu .login').hide();
                    $('.main-menu .logout').show();
                }
            },
            complete: function () {
                app.hideLoading();
            }
        });
    },
    saveRegId: function (localStorageService) {
        console.log(sessionStorage.deviceKind);
        var data = {
            registration_id: sessionStorage.regid,
            platform: sessionStorage.deviceKind,
            user_id: localStorageService.get('currentUserId'),
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: true,
            url: this.url + '/registration_devices/add',
            data: data,
            dataType: 'json',
            complete: function (dat1, dat2, dat3) {
                console.log(JSON.stringify(dat1));
                console.log(dat2);
                console.log(dat3);
            }
        });
    },
    getUserData: function ($scope, id) {
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'users/getData/' + id,
            data: data,
            dataType: 'json',
            success: function (data) {
                $scope.user = data;
            },
        });
        return $scope.user;
    },
    getTodosLosArticulos: function (localtorage) {
        var posts = {};
        var storagePosts = localtorage.get('posts');
        var fecha = new Date();
//        if (true) {
        if (storagePosts == null || (storagePosts != null && storagePosts['fecha'] != fecha.toDateString())) {
            var data = {
                appKey: this.key
            };
            $.ajax({
                type: 'POST',
                async: true,
                url: this.url + 'posts/getTodosLosArticulos/',
                data: data,
                dataType: 'json',
                success: function (data) {
                    posts = data;
                    var storePosts = {};
                    storePosts['fecha'] = fecha.toDateString();
                    storePosts['posts'] = posts;
                    localtorage.set('posts', storePosts);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (storagePosts != null && storagePosts['posts'] != null)
                        posts = storagePosts['posts'];
                }
            });
        }
        else {
            posts = storagePosts['posts'];
        }
        return posts;
    },
    getPost: function ($scope, id, localtorage) {
        var post = {};
        var storegaPost = localtorage.get('posts');
        if (storegaPost != null) {
            post = storegaPost['posts']['byId'][id];
        } else {
            storegaPost = this.getTodosLosArticulos(localtorage);
            post = storegaPost['posts']['byId'][id];
        }
        $scope.post = post;
        return $scope.post;
    },
    getPosts: function ($scope, tipo, localtorage) {
        var posts = {};
        var storegaPosts = localtorage.get('posts');
        if (storegaPosts != null) {
            posts = storegaPosts['posts']['byKind'][tipo];
        } else {
            storegaPosts = this.getTodosLosArticulos(localtorage);
            posts = storegaPosts['posts']['byKind'][tipo];
        }
        return posts;
    },
    getUserDataByfcid: function ($scope, fcid) {
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'users/getDataByFcid/' + fcid,
            data: data,
            dataType: 'json',
            success: function (data) {
                $scope.user = data;
            },
        });
        return $scope.user;
    },
    setUserData: function (userData, message, localStorageService, redirect) {
        app.showLoading('Guardando informacion');
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'users/setData/',
            data: userData,
            dataType: 'json',
            success: function (data) {
                if (data.store) {
                    // alert(message.success);
                    if (!$.isEmptyObject(data.datos.User.template)) {
                        localStorageService.set('userTemplate', data.datos.User.template);
                    }
                    if (redirect)
                        location.href = "#/home";
                }
                else
                    alert(message.fail);
            },
            complete: function (dat, dat2, dat3) {
//                alert(dat);
                app.hideLoading();
            }
        });
    },
    uploadImage: function (data) {
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'images/addImage/',
            data: data,
            contentType: false,
            cache: false,
            processData: false,
            success: function (responsedata) {
                alert(responsedata);
                responsedata = JSON.parse(responsedata);
                if (responsedata.store) {
                    alert('Se han subido correctamente tus fotos');
                    $('#select-images .item').remove();
                }
                else
                    alert('No ha sido posible subir todas tus fotos');
            },
            //complete: function(dat, dat2, dat3) {
            //    alert(dat);
            //}
        });
    },
    sendSticker: function (data) {
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'stickers/sendSticker/',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.store) {
                    alert('El sticker ha sido enviado a el o los usuarios seleccionados');
                    StickerApp.closeSticker();
                    $('.send-box.show .button-cancel').click();
                }
                else
                    alert('No fue posible enviar el sticker seleccionado');
            },
            //complete: function(dat, dat2, dat3) {
            //    alert(dat);
            //}
        });
    },
    sendNotifications: function (data) {
        var store = false;
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'notifications/send/',
            data: {
                appKey: this.key,
                'Notification': data
            },
            dataType: 'json',
            success: function (data) {
                if (data.store) {
                    store = true;
                }
            },
            complete: function (dat, dat2, dat3) {
                //  alert(dat);
            }
        });
        return store;
    },
    addAlert: function (data, userId) {
        var store = -1;
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'alerts/agregar/',
            data: {
                appKey: this.key,
                Alert: {
                    userid: userId,
                    date: data.date.getTime(),
                    title: data.event,
                }
            },
            dataType: 'json',
            success: function (data) {
                if (data.store) {
                    store = data.id;
                }
            },
            complete: function (dat, dat2, dat3) {
                //  alert(dat);
            }
        });
        return store;
    },
    getAlerts: function (date, userId) {
        var list = {};
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'alerts/getall/' + userId + '/' + date.getTime(),
            data: {
                appKey: this.key,
            },
            dataType: 'json',
            success: function (data) {
                list = data;
            },
            complete: function (dat, dat2, dat3) {
                //  alert(dat);
            }
        });
        return list;
    },
    deleteAlert: function (alertId) {
        var borrado = false;
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'alerts/cancel/' + alertId,
            data: {
                appKey: this.key,
            },
            dataType: 'json',
            success: function (data) {
                borrado = data;
            },
            complete: function (dat, dat2, dat3) {
                //  alert(dat);
            }
        });
        return borrado;
    },
    viewSticker: function (id) {
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'stickers/viewSticker/' + id,
            data: data,
            dataType: 'json',
            success: function (data) {
                /*if (data.store) {
                 }
                 else*/
            },
            //complete: function(dat, dat2, dat3) {
            //    alert(dat);
            //}
        });
    },
    getStickers: function ($userid) {
        var data = {
            appKey: this.key,
        };
        var stickers = {};
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'stickers/getStickers/' + $userid,
            dataType: 'json',
            data: data,
            success: function (data) {
                stickers = data;
            },
            complete: function (dat, dat2, dat3) {
                //alert(dat);
            }
        });
        return stickers;
    },
    getUnViewStickers: function ($userid) {
        var data = {
            appKey: this.key,
        };
        var stickers = {};
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'stickers/getUnViewStickers/' + $userid,
            dataType: 'json',
            data: data,
            success: function (data) {
                stickers = data;
            },
            complete: function (dat, dat2, dat3) {
                //alert(dat);
            }
        });
        return stickers;
    },
    friendRequest: function ($userProfile, $currentUser) {
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'users/makeFriend/',
            data: {
                appKey: this.key,
                Friend: {
                    user_id: $userProfile,
                    friend_id: $currentUser,
                    estado: 0
                }
            },
            dataType: 'json',
            success: function (data) {
                if (data.store) {
                    $(".friend-status label").text('Solicitud Enviada');
                }
                else
                    alert('No ha sido posible enviar tu solicitud de amistad');
            },
            complete: function (dat, dat2, dat3) {
                //alert(dat);
            }
        });
    },
    acceptRequest: function ($requestID) {
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'users/updateFriendRequest/',
            data: {
                appKey: this.key,
                Friend: {
                    id: $requestID,
                    estado: 1
                }
            },
            dataType: 'json',
            success: function (data) {
                if (data.store) {
                    $('.request-' + $requestID).hide();
                    //$(".request-" + $requestID + " .action").text('Aceptada');
                    //$(".request-" + $requestID + " .action").addClass('accept');
                }
                else
                    alert('No ha sido posible aceptar la solicitud de amistad');
            },
            complete: function (dat, dat2, dat3) {
//                alert(dat);
                console.log(JSON.stringify(dat2));
            }
        });
    },
    denyRequest: function ($requestID) {
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'users/updateFriendRequest/',
            data: {
                appKey: this.key,
                Friend: {
                    id: $requestID,
                    estado: 1
                }
            },
            dataType: 'json',
            success: function (data) {
                if (data.store) {
                    $('.request-' + $requestID).hide();
                    //$(".request-" + $requestID + " .action").text('Aceptada');
                    //$(".request-" + $requestID + " .action").addClass('accept');
                }
                else
                    alert('No ha sido posible aceptar la solicitud de amistad');
            },
            complete: function (dat, dat2, dat3) {
//                alert(dat);
                console.log(JSON.stringify(dat2));
            }
        });
    },
    getFriends: function ($user) {
        var friends = {};
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'users/getFriends/' + $user,
            data: data,
            dataType: 'json',
            success: function (data) {
                friends = data;
            },
            complete: function (data, dat, da) {
                console.log(data);
            },
        });
        return friends;
    },
    getFriendsAndChat: function ($user) {
        var friends = {};
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'users/getFriends/' + $user + '/1',
            data: data,
            dataType: 'json',
            success: function (data) {
                friends = data;
            },
            complete: function (data, dat, da) {
                console.log(data);
            },
        });
        return friends;
    },
    getPendingRequest: function ($user) {
        var friendsRequest = {};
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'users/getFriendRequest/' + $user,
            data: data,
            dataType: 'json',
            success: function (data) {
                friendsRequest = data;
            },
        });
        return friendsRequest;
    },
    getFriendStatus: function ($userProfile, $currentUser) {
        var friendStatus = false;
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'users/getFriendStatus/' + $userProfile + '/' + $currentUser,
            data: data,
            dataType: 'json',
            success: function (data) {
                friendStatus = data;
            },
        });
        return friendStatus;
    },
    addCommentToPhoto: function (userData) {
        $.ajax({
            type: 'POST',
            async: true,
            url: this.url + 'images/addComment/',
            data: userData,
            dataType: 'json',
            success: function (data) {
                if (data.store) {
                    $('#comment-form textarea').val('');
                    var itemLista = $('<li></li>');
                    if (data.fcid == 0) {
                        itemLista.append('<img class="user-photo" src="img/profile/change-image.png" />');
                    } else {
                        itemLista.append('<img class="user-photo" src="https://graph.facebook.com/' + data.fcid + '/picture?type=large" />');
                    }

                    itemLista.append('<p class="text"> <a class="username">' + data.username + ': </a>' + data.text + '</p>');
                    //itemLista.append('<p class="date">' + data.date + '</p>" />');
                    $('.comments').append(itemLista);
                    setTimeout(function () {
                        app.goBack();
                    }, 300);
                }
                else
                    alert('El comentario no ha sido publicado');
            },
            complete: function (dat, dat2, dat3) {
                //  alert(dat);
            }
        });
    },
    sendMessage: function (userData) {
        var enviado = false;
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'messages/send/',
            data: userData,
            dataType: 'json',
            success: function (data) {
                enviado = data.send;
            },
            complete: function (dat, dat2, dat3) {
                //  alert(dat);
            }
        });
        return enviado;
    },
    getConversation: function (userId, friendId) {
        var conversacion = {};
        var data = {
            appKey: this.key
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'messages/getConversation/' + userId + '/' + friendId,
            data: data,
            dataType: 'json',
            success: function (data) {
                conversacion = data;
            },
        });
        return conversacion;
    },
    setLikeToPhoto: function (userData) {
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'images/setLike/',
            data: userData,
            dataType: 'json',
            success: function (data) {
                if (data.store) {
                    var currentLikeAmount = parseInt($('#like-number').text());
                    $('.like').removeClass('liked');
                    if (data.liked) {
                        $('.like').addClass('liked');
                        currentLikeAmount++;
                    } else {
                        currentLikeAmount--;
                    }
                    $('#like-number').text(currentLikeAmount);
                }
                else
                    alert('No fue posible enviar el Me gusta');
            },
            complete: function (dat, dat2, dat3) {
                //alert(dat);
            }
        });
    },
    guardarPhoto: function (imageId, userId) {
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'images/saveImage/' + imageId + "/" + userId,
            dataType: 'json',
            data: data,
            success: function (data) {
                if (data.store) {
                    alert('La imagen ha sido almacenada en sus fotos');
                }
                else
                    alert('No fue posible guardar la imagen en sus fotos');
            },
            complete: function (dat, dat2, dat3) {
                // alert(dat);
            }
        });
    },
    getProximosEventos: function ($scope) {
        var events = {};
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'events/getProximosEventos',
            data: data,
            dataType: 'json',
            success: function (data) {
                events = data;
            },
        });
        return events;
    },
    getTodosLosEventos: function (localtorage) {
        var events = {};
        var storegaEvents = localtorage.get('events');
        var fecha = new Date();
//        if (true) {
        if (storegaEvents == null || (storegaEvents != null && storegaEvents['fecha'] != fecha.toDateString())) {
            var data = {
                appKey: this.key
            };
            $.ajax({
                type: 'POST',
                async: false,
                url: this.url + 'events/getTodosLosEventos/',
                data: data,
                dataType: 'json',
                success: function (data) {
                    events = data;
                    var storeEvents = {};
                    storeEvents['fecha'] = fecha.toDateString();
                    storeEvents['events'] = events;
                    localtorage.set('events', storeEvents);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (storeEvents != null && storeEvents['events'] != null)
                        events = storeEvents['events'];
                }
            });
        }
        else {
            events = storegaEvents['events'];
        }
        return events;
    },
    getEventosPorMes: function ($mes, localtorage) {
        var events = {};
        var storegaEvents = localtorage.get('events');
        if ($mes < 10) {
            $mes = '0' + $mes;
        }
        if (storegaEvents != null) {
            events = storegaEvents['events']['byMonth'][$mes];
        } else {
            storegaEvents = this.getTodosLosEventos(localtorage);
            events = storegaEvents['events']['byMonth'][$mes];
        }
        return events;
    }
    ,
    getEventById: function (id, localtorage) {
        var events = {};
        var storegaEvents = localtorage.get('events');
        if (storegaEvents != null) {
            events = storegaEvents['events']['byId'][id];
        } else {
            storegaEvents = this.getTodosLosEventos(localtorage);
            events = storegaEvents['events']['byId'][id];
        }
        return events;
    },
    getImageByUser: function ($userID) {
        var imagenes = {};
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'images/getImages/' + $userID,
            data: data,
            dataType: 'json',
            success: function (data) {
                imagenes = data;
            },
        });
        return imagenes;
    },
    getImage: function ($imageId) {
        var imagen = {};
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'images/getImage/' + $imageId,
            data: data,
            dataType: 'json',
            success: function (data) {
                imagen = data;
            },
        });
        return imagen;
    },
    getAlbums: function (userid) {
        var imagenes = {};
        var data = {
            appKey: this.key,
            userid: userid
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'albums/getAlbums/',
            data: data,
            dataType: 'json',
            success: function (data) {
                imagenes = data;
            },
        });
        return imagenes;
    },
    getAlbum: function ($id, userid) {
        var imagen = {};
        var data = {
            appKey: this.key,
            user_id: userid
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'albums/getAlbum/' + $id,
            data: data,
            dataType: 'json',
            success: function (data) {
                imagen = data;
            },
            // complete: function(dat, dat2, dat3) {
            //     alert(dat);
            // }
        });
        return imagen;
    },
    getPlaylists: function () {
        var playlists = {};
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'playlists/getPlaylists/',
            data: data,
            dataType: 'json',
            success: function (data) {
                playlists = data;
            },
        });
        return playlists;
    },
    getPlaylist: function ($playlistId) {
        var playlist = {};
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'playlists/getPlaylist/' + $playlistId,
            data: data,
            dataType: 'json',
            success: function (data) {
                playlist = data;
            },
        });
        return playlist;
    },
    getImageComments: function ($imageId) {
        var comentarios = {};
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'images/getComments/' + $imageId,
            data: data,
            dataType: 'json',
            success: function (data) {
                comentarios = data;
            },
        });
        return comentarios;
    },
    getImageLikes: function ($imageId) {
        var likes = {};
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'images/getLikes/' + $imageId,
            data: data,
            dataType: 'json',
            success: function (data) {
                likes = data;
            },
        });
        return likes;
    },
    getLikeStatus: function ($imageId, $userid) {
        var like = false;
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'images/getLikeStatus/' + $imageId + '/' + $userid,
            data: data,
            dataType: 'json',
            success: function (data) {
                like = data.liked;
            },
        });
        return like;
    },
    getLikeStatusPost: function ($postId, $userid) {
        var like = false;
        var data = {
            appKey: this.key,
        };
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'posts/getLikeStatusPost/' + $postId + '/' + $userid,
            data: data,
            dataType: 'json',
            success: function (data) {
                like = data.liked;
            },
        });
        return like;
    },
    setLikeToPost: function (userData) {
        $.ajax({
            type: 'POST',
            async: false,
            url: this.url + 'posts/setLikePost/',
            data: userData,
            dataType: 'json',
            success: function (data) {
                if (data.store) {
                    $('.like').removeClass('liked');
                    if (data.liked) {
                        $('.like').addClass('liked');
                    }
                }
                else
                    alert('No fue posible enviar el Me gusta');
            },
            complete: function (dat, dat2, dat3) {
                //alert(dat);
            }
        });
    },
}
