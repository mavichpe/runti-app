/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * Inicializacion de Angular
 */

angulargap = angular.module("angulargap", ['ngTouch', 'ngRoute', 'ngAnimate', 'LocalStorageModule', 'ngSanitize', 'ionic']);
angulargap.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 1; i < total; i++)
            input.push(i);
        return input;
    };
});
angulargap.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});
angulargap.directive("bindCompiledHtml", function ($compile, $timeout) {
    return {
        template: '<div></div>',
        scope: {
            rawHtml: '=bindCompiledHtml'
        },
        link: function (scope, elem, attrs) {
            scope.$watch('rawHtml', function (value) {
                if (!value)
                    return;
                // we want to use the scope OUTSIDE of this directive
                // (which itself is an isolate scope).
                var newElem = $compile(value)(scope.$parent);
                elem.contents().remove();
                elem.append(newElem);
            });
        }
    };
});
angulargap.controller("LoadController", ['$scope', 'localStorageService', function ($scope, localStorageService) {
        var notFirstTime = localStorageService.get('not-first-time');

        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                if (notFirstTime == null || !notFirstTime) {
                    setTimeout(function () {
                        $('#load').addClass('show');
                    }, 1200);
                } else {
                    $('#load').addClass('no-first');
                    setTimeout(function () {
                        location.href = '#/login';
                    }, 4000);
                }
            }, 0);
        });

        $scope.goNext = function () {
            location.href = '#/login';
            localStorageService.set('not-first-time', true);
        }

    }]);
angulargap.controller("LoginController", ['$scope', 'localStorageService', function ($scope, localStorageService) {
        if (localStorageService.get('currentUserId')) {
            location.href = '#/home';
        }
        $scope.cancel = function () {
            loginApp.cancelLogin();
        };
        $scope.submit = function () {
            app.showLoading();
            if (backend.login($scope, localStorageService))
            {
                loginApp.destroy();
                loginApp.showHome();
            } else {
                app.hideLoading();
                alert("Los datos de inicio de sesion no son correctos");
            }
        };
        $scope.asInvite = function () {
            localStorageService.set('currentUserId', 0);
            localStorageService.set('userTemplate', 1);
            location.href = '#/home';
            $('.main-menu .login').show();
            $('.main-menu .logout').hide();
        };
        $scope.fblogin = function () {
            app.showLoading();
            facebookConnectPlugin.login(["email,publish_actions,public_profile,user_friends,read_friendlists"],
                    function (userData) {
                        facebookConnectPlugin.api(userData.authResponse.userID + "/", ["public_profile"],
                                function (result) {
                                    var user = {
                                        email: result.email,
                                        fcid: userData.authResponse.userID,
                                        nombre: result.first_name,
                                        apellido: result.last_name,
                                        role: 'runner',
                                        template: 1,
                                        username: userData.authResponse.userID
                                    };
                                    backend.fblogin(user, localStorageService);
                                },
                                function (error) {
                                    alert("Error: " + error);
                                    app.hideLoading();
                                });
                    },
                    function (error) {
                        alert("" + error);
                        app.hideLoading();
                    }
            );
        };
        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                loginApp.initialize();
            }, 0);
        });
        $scope.$on('$locationChangeStart', function (next, current) {
            loginApp.hideLogin();
        });
    }]);
angulargap.controller("HomeController", ['$scope', 'localStorageService', function ($scope, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.pathImg = backend.url + "img/";
        backend.getTodosLosEventos(localStorageService);
        backend.getTodosLosArticulos(localStorageService);
        $scope.ano = new Date().getFullYear();
        $scope.mesactual = new Date().getMonth() + 1;
        $scope.meses = {
            '1': 'ENE',
            '2': 'FEB',
            '3': 'MAR',
            '4': 'ABR',
            '5': 'MAY',
            '6': 'JUN',
            '7': 'JUL',
            '8': 'AGO',
            '9': 'SEP',
            '10': 'OCT',
            '11': 'NOV',
            '12': 'DIC'
        };
        $scope.template = localStorageService.get('userTemplate');
        $scope.eventMenuItem = app.eventMenuItem;
        $scope.$on('$viewContentLoaded', function () {
            app.actionQuote = new Array();
            setTimeout(function () {
                homeApp.initialize();
            }, 0);
        });
    }]);
angulargap.controller("CalendarController", ['$scope', 'localStorageService', function ($scope, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.ano = new Date().getFullYear();
        $scope.mesactual = new Date().getMonth() + 1;
        $scope.meses = {
            '1': 'ENE',
            '2': 'FEB',
            '3': 'MAR',
            '4': 'ABR',
            '5': 'MAY',
            '6': 'JUN',
            '7': 'JUL',
            '8': 'AGO',
            '9': 'SEP',
            '10': 'OCT',
            '11': 'NOV',
            '12': 'DIC'
        };
        $scope.template = localStorageService.get('userTemplate');
        $scope.$on('$viewContentLoaded', function () {
            app.actionQuote = new Array();
            setTimeout(function () {
                homeApp.initialize();
            }, 0);
        });
    }]);
angulargap.controller("CalendarSelectViewController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        var month = $routeParams.month;
        $scope.mes = CalendarViewApp.months[month];
        $scope.events = backend.getEventosPorMes(month, localStorageService);
        $scope.dias = {
            'Monday': 'Lunes',
            'Tuesday': 'Martes',
            'Wednesday': 'Miércoles',
            'Thursday': 'Jueves',
            'Friday': 'Viernes',
            'Saturday': 'Sábado',
            'Sunday': 'Domingo',
        };
        $scope.meses = {
            '01': 'ENE',
            '02': 'FEB',
            '03': 'MAR',
            '04': 'ABR',
            '05': 'MAY',
            '06': 'JUN',
            '07': 'JUL',
            '08': 'AGO',
            '09': 'SEP',
            '10': 'OCT',
            '11': 'NOV',
            '12': 'DIC',
        };
        $scope.selectRace = function () {
            var selectedRace = $('.next-events li.selected');
            if (selectedRace.length == 0) {
                alert('Por favor seleccione una carrera antes de continuar');
            } else {
                var selectedEvent = selectedRace.attr('event-id');
                localStorageService.set('selectedEvent', selectedEvent);
                location.href = localStorageService.get('selectReturnPath');
            }
        };
        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                CalendarSelectViewApp.initialize();
            }, 0);
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("CalendarViewController", ['$scope', '$routeParams', 'localStorageService', '$ionicScrollDelegate', function ($scope, $routeParams, localStorageService, $ionicScrollDelegate) {
        app.beforeRender($scope, localStorageService);
        var month = $routeParams.month;
        $scope.mes = CalendarViewApp.months[month];
        $scope.pathImg = backend.url + "img/";
        $scope.events = backend.getEventosPorMes(month, localStorageService);
        $scope.dias = {
            'Monday': 'Lunes',
            'Tuesday': 'Martes',
            'Wednesday': 'Miércoles',
            'Thursday': 'Jueves',
            'Friday': 'Viernes',
            'Saturday': 'Sábado',
            'Sunday': 'Domingo',
        };
        $scope.meses = {
            '01': 'ENE',
            '02': 'FEB',
            '03': 'MAR',
            '04': 'ABR',
            '05': 'MAY',
            '06': 'JUN',
            '07': 'JUL',
            '08': 'AGO',
            '09': 'SEP',
            '10': 'OCT',
            '11': 'NOV',
            '12': 'DIC',
        };
        $scope.showOptions = function (isLast) {
            if (isLast) {
                setTimeout(function () {
                    $ionicScrollDelegate.scrollBottom(true);
                }, 600);
            }
        };
        $scope.showSubMenu = function (item, eventId, isLastEvent) {
            CalendarViewApp.showEventInfo(item, eventId);
            if (isLastEvent) {
                setTimeout(function () {
                    $ionicScrollDelegate.scrollBottom(true);
                }, 600);
            }
        };
        $scope.showMapa = function (idMapa) {
            CalendarViewApp.showMapa(idMapa);
        };
        $scope.openURL = function (url) {
            app.openUrl(url);
        };
        $scope.eventMenuItem = app.eventMenuItem;
        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                CalendarViewApp.initialize();
            }, 0);
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("ProfileController", ['$scope', 'localStorageService', function ($scope, localStorageService) {
        app.beforeRender($scope, localStorageService);
        var userData = backend.getUserData($scope, localStorageService.get('currentUserId'));
        if (userData.User.nacimiento != null) {
            var fechaNacimiento = userData.User.nacimiento.split("-");
            userData.User.nacimiento = new Array();
            userData.User.nacimiento.ano = fechaNacimiento[0];
            userData.User.nacimiento.mes = fechaNacimiento[1];
            userData.User.nacimiento.dia = fechaNacimiento[2];
        }
        $scope.black = true;
        $scope.appKey = backend.key;
        var event = localStorageService.get('selectedEvent');
        if (event != null) {
            localStorageService.remove('selectedEvent');
            userData.app = event;
            userData.User['event_id'] = event;
            userData.appKey = backend.key;
            backend.setUserData(userData, '', localStorageService, false);
            userData = backend.getUserData($scope, localStorageService.get('currentUserId'));
        }
        $scope.userData = userData;
        $scope.requestFBFriends = function () {
            InviteApp.invitar();
        };
        $scope.pedingRequests = backend.getPendingRequest(localStorageService.get('currentUserId'));
        $scope.submit = function ()
        {
            var Userdata = $('#profile-form').serialize();
            var message = {
                success: 'Perfil Modificado exitosamente',
                fail: 'No ha sido posible modificar la informacion de su perfil',
            };
            backend.setUserData(Userdata, message, localStorageService, true);
        };
        $scope.compartir = function (evento, titulo, message) {
            window.plugins.socialsharing.share(message, 'Carrera en runti', null, backend.url + "evento/" + evento + "-" + localStorageService.get('currentUserId') + "-" + titulo);
        };
        $scope.selectRace = function () {
            localStorageService.set('selectReturnPath', '#/profile');
            location.href = "#/calendar";
        };
        $scope.$on('$viewContentLoaded', function () {
            ProfileApp.initialize();
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("ProfileViewController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        var userId = $routeParams.userid;
        var userData;
        if (userId == -1) {
            var fcid = $routeParams.fcid;
            userData = backend.getUserDataByfcid($scope, fcid);
            userId = userData.User.id;
        }
        else
            userData = backend.getUserData($scope, userId);
        var friendStatus = backend.getFriendStatus(userId, localStorageService.get('currentUserId'));
        $scope.userData = userData;
        $scope.friendStatus = friendStatus;
        $scope.friendRequest = function ()
        {
            backend.friendRequest(userId, localStorageService.get('currentUserId'));
        };
        $scope.$on('$viewContentLoaded', function () {
            //ProfileApp.initialize();
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            $.each(current.params, function (index, value) {
                funcPath = funcPath.replace(':' + index, value);
            });
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("TemplateController", ['$scope', 'localStorageService', function ($scope, localStorageService) {
        app.beforeRender($scope, localStorageService);
        var userData = backend.getUserData($scope, localStorageService.get('currentUserId'));
        var template = localStorageService.get('userTemplate');
        $scope.appKey = backend.key;
        $scope.userData = userData;
        $scope.currentTemplate = template;
        $scope.submit = function (template)
        {
            $('#currentTemplate').val(template);
            var Userdata = $('#profile-form').serialize();
            var message = {
                success: 'El tema ha sido configurado correctamente',
                fail: 'No ha sido posible cambiar el tema',
            };
            backend.setUserData(Userdata, message, localStorageService, true);
        }

        $scope.$on('$viewContentLoaded', function () {
            TemplateApp.initialize();
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("StickerController", ['$scope', 'localStorageService', function ($scope, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.userid = localStorageService.get('currentUserId');
        $scope.recibedStickers = backend.getStickers($scope.userid);
        $scope.unViewSticker = backend.getUnViewStickers($scope.userid);
        var stickersAnimated = new Array();
        var stickersImage = new Array();
        var stickers = new Array();
        for (var index = 1; index < 26; index++) {
            sticker = {
                img: 'runti' + index + (index < 7 ? ".gif" : ".png"),
                type: (index < 7 ? "animate" : "image"),
                id: index
            };
            if (sticker.type == 'animate')
                stickersAnimated.push(sticker);
            else
                stickersImage.push(sticker);
            stickers.push(sticker);
        }
        $scope.stickersImage = stickersImage;
        $scope.stickersAnimated = stickersAnimated;
        $scope.stickers = stickers;
        $scope.goToSendSticker = function () {
            location.href = "#/sticker-select";
        };
        $scope.verSticker = function (sticker, stickerId) {
            backend.viewSticker(stickerId);
            $('.view-sticker,#mask').addClass('show');
            $('#sticker-sended').attr('src', 'img/stickers/runti' + sticker + (sticker < 7 ? ".gif" : ".png"));
            $('#recibe-sticker-' + stickerId).addClass('viewed');
            var currentAmout = parseInt($('#sticker .notificacion-amount').text());
            currentAmout--;
            if (currentAmout == 0)
                $('#sticker .notificacion-amount').remove();
            else
                $('#sticker .notificacion-amount').text(currentAmout);
            $('#accordion .acOpen :first-child').click();
        };
        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                StickerApp.initialize();
            }, 0);
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("StickerSelectController", ['$scope', 'localStorageService', function ($scope, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.appKey = backend.key;
        $scope.userid = localStorageService.get('currentUserId');
        var stickersAnimated = new Array();
        var stickersImage = new Array();
        var stickers = new Array();
        for (var index = 1; index < 26; index++) {
            sticker = {
                img: 'runti' + index + (index < 7 ? ".gif" : ".png"),
                type: (index < 7 ? "animate" : "image"),
                id: index
            };
            if (sticker.type == 'animate')
                stickersAnimated.push(sticker);
            else
                stickersImage.push(sticker);
            stickers.push(sticker);
        }
        $scope.selectSticker = function (stickerid) {
            location.href = "#sticker-send/" + stickerid;
        };
        $scope.stickersImage = stickersImage;
        $scope.stickersAnimated = stickersAnimated;
        $scope.stickers = stickers;
        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                StickerApp.initialize();
            }, 0);
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("StickerSendController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.appKey = backend.key;
        $scope.idsticker = $routeParams.idsticker;
        $scope.userid = localStorageService.get('currentUserId');
        var stickersAnimated = new Array();
        var stickersImage = new Array();
        var stickers = new Array();
        for (var index = 1; index < 26; index++) {
            sticker = {
                img: 'runti' + index + (index < 7 ? ".gif" : ".png"),
                type: (index < 7 ? "animate" : "image"),
                id: index
            };
            if (sticker.type == 'animate')
                stickersAnimated.push(sticker);
            else
                stickersImage.push(sticker);
            stickers.push(sticker);
        }
        $scope.sendSticker = function () {
            var sticker = $('#stikerTosend').serialize();
            backend.sendSticker(sticker);
        };
        $scope.sticker = stickers[$scope.idsticker];
        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                StickerApp.initialize();
            }, 0);
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("ImagesController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.goToMyImages = function () {
            $userId = localStorageService.get('currentUserId');
            if ($userId != 0)
                location.href = "#/images-list/";
            else {
                alert('Para crear un album con tus fotos debes de crear una cuenta o ingresar mediante facebook');
            }
        };
        $scope.goToRuntiImages = function () {
            location.href = "#/images-album-runti";
        };
        var userid = localStorageService.get('currentUserId');
        var albums = backend.getAlbums(userid);
        var pendend = 0;
        albums.forEach(function (item) {
            if (item.Userpenden.id == null)
                pendend++;
        });
        $scope.pendend = pendend;
        $scope.$on('$routeChangeSuccess', function () {
            setTimeout(function () {
                ImageApp.initialize();
            }, 0);
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("ImagesAlbumsController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        var userid = localStorageService.get('currentUserId');
        $scope.albums = backend.getAlbums(userid);
        $scope.$on('$routeChangeSuccess', function () {
            setTimeout(function () {
                ImageAlbumApp.initialize();
            }, 0);
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("ImagesViewAlbumsController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.appKey = backend.key;
        $scope.pathImg = backend.url + "img/";
        albumId = $routeParams.albumId;
        $scope.album = backend.getAlbum(albumId, localStorageService.get('currentUserId'));
        $scope.cantidadImages = $scope.album.Image.length;
        $scope.imagesPorPagina = 10;
        var chunk = $scope.album.Image.splice(0, $scope.imagesPorPagina);
        $scope.images = chunk;
        $scope.pagina = 1;
        $scope.initImageLoaded = 1;

        $scope.loadMore = function () {
            $scope.pagina++;
            $scope.totalCargadas = 1;

            if ($scope.cantidadImages >= (($scope.pagina - 1) * $scope.imagesPorPagina)) {
                app.showLoading();
                var nextChunk = $scope.album.Image.splice(0, $scope.imagesPorPagina);
                nextChunk.forEach(function (item) {
                    var toAddImage = $('<li/>');
                    var link = $('<a href="#/images-view/' + item.id + '"/>');
                    var image = $('<img src="' + $scope.pathImg + item.url + '"/>');
                    image.load(function () {
                        $scope.totalCargadas++;
                        if ($scope.totalCargadas == nextChunk.length) {
                            setTimeout(function () {
                                $('#grid').masonry('layout');
                                $scope.$apply();
                                setTimeout(function () {
                                    $('#grid li').addClass('shown');
                                    app.hideLoading();
                                }, 600);
                            }, 10);
                        }
                    });
                    link.append(image);
                    toAddImage.append(link);
                    $('#grid').masonry().append(toAddImage[0]).masonry('appended', toAddImage[0]);
                });
                if ($scope.cantidadImages <= ($scope.pagina * $scope.imagesPorPagina))
                    $('#loadMore').hide();
            } else {
                $('#loadMore').hide();
            }
        };

        app.showLoading();
        $scope.$on('$routeChangeSuccess', function () {
            setTimeout(function () {
                ImageListApp.initialize();
                $scope.$apply();
                $('.grid li').addClass('shown');
                $('.grid li img').load(function () {
                    $scope.initImageLoaded++;
                    if ($scope.initImageLoaded == $scope.images.length)
                        app.hideLoading();
                }).each(function () {
                    if (this.complete)
                        $(this).load();
                });
            }, 50);
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            $.each(current.params, function (index, value) {
                funcPath = funcPath.replace(':' + index, value);
            });
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("ImagesListController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.appKey = backend.key;
        $scope.pathImg = backend.url + "img/";
        var hideUpload = true;
        var userName = '';
        $userId = $routeParams.userid;
        if ($userId == null) {
            $userId = localStorageService.get('currentUserId');
            if ($userId != 0)
                hideUpload = false;
        } else {
            var userData = backend.getUserData($scope, $userId);
            userName = userData.User.nombre + ' ' + userData.User.apellido;
        }
        $scope.userName = userName;
        $scope.hideUpload = hideUpload;
        $scope.images = backend.getImageByUser($userId);
        $scope.goToUpload = function () {
            location.href = "#/image-upload";
        }
        $scope.$on('$routeChangeSuccess', function () {
            setTimeout(function () {
                ImageListApp.initialize();
            }, 0);
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            if (jQuery.isEmptyObject(current.params)) {
                funcPath = "location.href = '#/images-list";
            } else
                $.each(current.params, function (index, value) {
                    funcPath = funcPath.replace(':' + index, value);
                });
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("ImagesViewController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        var imagen = $routeParams.imagen;
        $scope.comments = backend.getImageComments(imagen);
        //$scope.links = backend.getImageLikes(imagen);
        $scope.imagen = backend.getImage(imagen);
        $scope.pathImg = backend.url + "img/";
        $scope.shareUrl = backend.url + "images/view/" + $scope.imagen.Image.id;
        $scope.likestatus = backend.getLikeStatus(imagen, localStorageService.get('currentUserId'));
        $scope.currentUser = localStorageService.get('currentUserId');
        $scope.appKey = backend.key;
        $scope.sendComment = function () {
            var commentData = $('#comment-form').serialize();
            backend.addCommentToPhoto(commentData);
        };
        $scope.guardarImagen = function (imageId, userId) {
            backend.guardarPhoto(imageId, userId);
        };
        $scope.sendLike = function (elemt) {
            $('#likestatus').val(1);
            if ($('.like').hasClass('liked'))
                $('#likestatus').val(0);
            var likedata = $('#like-form').serialize();
            backend.setLikeToPhoto(likedata);
        };
        $scope.showCommentBox = function (image) {
            ImageViewApp.showCommentBox(image);
        };
        $scope.shareFBPost = function (imageurl) {
            facebookConnectPlugin.showDialog({method: 'share',
                href: imageurl
            }, function (response) {
                console.log(response);
            });
        };
        $scope.compartir = function (image) {
            window.plugins.socialsharing.share('Mira esta imagen de Runti', null, null, backend.url + 'imagen-carrera/' + image);
        };
        $scope.shareOptions = function () {
            $('#mask,.share-popup').addClass('show');
        }
        $scope.closePopup = function () {
            $('#mask,.share-popup').removeClass('show');
        }

        $scope.$on('$viewContentLoaded', function () {
            ImageViewApp.initialize();
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            $.each(current.params, function (index, value) {
                funcPath = funcPath.replace(':' + index, value);
            });
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("ImagesComentsController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        var imagen = $routeParams.imagen;
        $scope.comments = backend.getImageComments(imagen);
        $scope.currentUser = localStorageService.get('currentUserId');
        $scope.appKey = backend.key;
        $scope.sendComment = function () {
            var commentData = $('#comment-form').serialize();
            backend.addCommentToPhoto(commentData);
        };
        $scope.sendLike = function (elemt) {
            $('#likestatus').val(1);
            if ($('.like').hasClass('liked'))
                $('#likestatus').val(0);
            var likedata = $('#like-form').serialize();
            backend.setLikeToPhoto(likedata);
        };
        $scope.$on('$viewContentLoaded', function () {
        });
    }]);
angulargap.controller("ImagesUploadController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.appKey = backend.key;
        $scope.userId = localStorageService.get('currentUserId');
        $scope.showGalery = function () {
            ImageUploadApp.getPhoto();
        };
        $scope.capturePhoto = function () {
            ImageUploadApp.capturePhoto();
        };
        $scope.uploadImage = function () {
            $('#loading').show();
            //var data = $('#images-to-upload').serialize();
            //var formData = new FormData(document.querySelector('#images-to-upload'));
            //backend.uploadImage(formData);

            $imagenes = $('#images-to-upload img');
            var store = true;
            $imagenes.each(function (index, item) {
                var imageURI = item.src;
                var options = new FileUploadOptions();
                options.fileKey = "data[Image][0][url]";
                options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                var params = {
                    'appKey': backend.key,
                    'userId': localStorageService.get('currentUserId')
                };
                options.params = params;
                options.chunkedMode = false;
                var ft = new FileTransfer();
                ft.upload(imageURI, backend.url + 'images/addImage/', function (r) {
                    $('#select-images .item').remove();
                    $('.upload').hide();
                    console.log("Code = " + r.responseCode);
                    console.log("Response = " + r.response);
                    console.log("Sent = " + r.bytesSent);
                }, function (error) {
                    store = false;
                    console.log("upload error source " + error.source);
                    console.log("upload error target " + error.target);
                },
                        options
                        );
            });
            if (store) {
                alert('Se han sudido todas tus imagenes');
                location.href = '#/images'
            } else {
                alert("No ha sido posible guardar todas tus imagenes");
            }
            $('#loading').hide();
        };
        $scope.$on('$routeChangeSuccess', function () {
            setTimeout(function () {
                ImageUploadApp.initialize($scope);
            }, 0);
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("FriendsController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.currentUser = localStorageService.get('currentUserId');
        $scope.showSearchForm = function () {
            location.href = '#/search-friends';
        };
        $scope.showFriendList = function () {
            location.href = '#/friends-list';
        };
        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                FriendsApp.initialize();
            }, 0)
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("FriendsListController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.pedingRequests = backend.getPendingRequest(localStorageService.get('currentUserId'));
        $scope.friends = backend.getFriends(localStorageService.get('currentUserId'));
        $scope.currentUser = localStorageService.get('currentUserId');
        $scope.acceptRequest = function ($requestID) {
            backend.acceptRequest($requestID);
        };
        $scope.requestFBFriends = function () {
            InviteApp.invitar();
        };
        $scope.showSearchForm = function () {
            location.href = '#/search-friends';
        };
        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                FriendsApp.initialize();
                setTimeout(function () {
                    $('.request-bubble').addClass('hide-bubble');
                }, 2000);
            }, 0)
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("SearchFriendsController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.currentUser = localStorageService.get('currentUserId');
        $scope.requestFBFriends = function () {
            InviteApp.invitar();
        };
        $scope.showSearchForm = function () {
            $('.search-wrapper .search-form').addClass('show');
        };
        $scope.hideAddFriend = function () {
            $('.search-wrapper .search-form').removeClass('show');
        };
        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                FriendsApp.initialize();
            }, 0)
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("ChatListController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        var friends = backend.getFriendsAndChat(localStorageService.get('currentUserId'));
        $scope.friends = friends.Friends;
        $scope.currentChat = friends.Chats;
        $scope.currentUser = localStorageService.get('currentUserId');
        var pendingMessage = localStorageService.get('messages');
        if (pendingMessage == null)
            pendingMessage = {
                ad: {}
            };
        $scope.pendingMessage = pendingMessage;
        $scope.pendingAmount = Object.keys(pendingMessage).length;
        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                ChatApp.initialize();
            }, 0);
        });
        $scope.$on('$locationChangeStart', function (next, current) {
            funcPath = "location.href = '" + current + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("ChatMessageController", ['$scope', '$routeParams', 'localStorageService', '$ionicScrollDelegate', function ($scope, $routeParams, localStorageService, $ionicScrollDelegate) {
        app.beforeRender($scope, localStorageService);
        $scope.friendData = backend.getUserData($scope, $routeParams.id);
        var message = $routeParams.message;
        $scope.currentUser = localStorageService.get('currentUserId');
        $scope.appKey = backend.key;
        $scope.messages = backend.getConversation($scope.currentUser, $routeParams.id);
        var pendingMessage = localStorageService.get('messages');
        if (pendingMessage == null)
            pendingMessage = {};
        if (pendingMessage[$routeParams.id] != null)
            delete pendingMessage[$routeParams.id];
        localStorageService.set('messages', pendingMessage);
        $scope.pendingMessage = pendingMessage;
//        $scope.message = backend.getChatMessage(friendId);
        $scope.sendMessage = function () {
            var messageData = $('#comment-form').serialize();
            if (backend.sendMessage(messageData)) {
                var message = $('#message-content').val();
                $('#message-content').val('');
                message = $('<li class="user"> <div class="right"> <div class="text">' + message + '</div> <div class="box-footer"> <img  class="image" src="img/chat/box-footer-green.png"/> <div class="line" /></div></div>  </li>');
                $('.messages').append(message);
            }
            else {
                alert('Su mensaje no pudo ser enviado');
            }

        };
        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                ChatApp.initialize();
                if (message != null)
                    ChatApp.addMessage(message);
                setTimeout(function () {
                    $ionicScrollDelegate.scrollBottom();
                }, 100);
            }, 0);
        });
        $scope.$on('$locationChangeStart', function (next, current) {
            funcPath = "location.href = '" + current + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("FriendsRequestController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.pedingRequests = backend.getPendingRequest(localStorageService.get('currentUserId'));
        $scope.currentUser = localStorageService.get('currentUserId');
        $scope.acceptRequest = function ($requestID) {
            backend.acceptRequest($requestID);
        };
        $scope.denegarRequest = function ($requestID) {
            backend.denyRequest($requestID);
        };
        $scope.$on('$viewContentLoaded', function () {
            setTimeout(function () {
                FriendsApp.initialize();
            }, 0)
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("SpotifyController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        $scope.playlists = backend.getPlaylists();
        $scope.$on('$viewContentLoaded', function () {
            //ImageViewApp.initialize();
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("SpotifyViewController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        var playlist = $routeParams.playlist;
        $scope.playlist = backend.getPlaylist(playlist);
        $scope.$on('$viewContentLoaded', function () {
            // ImageViewApp.initialize();
        });
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("SendinviteController", ['$scope', '$routeParams', 'localStorageService', function ($scope, $routeParams, localStorageService) {
        app.beforeRender($scope, localStorageService);
        var users = localStorageService.get('userlist-invite');
        if (users != null)
            $scope.users = users;
        var selectedEvent = localStorageService.get('selectedEvent');
        if (selectedEvent != null) {
            selectedEvent = backend.getEventById(selectedEvent, localStorageService);
            $scope.selectedEvent = selectedEvent;
        }

        $scope.$on('$viewContentLoaded', function () {
            InviteApp.initialize();
        });
        $scope.closePopup = function () {
            $('.app-popup').removeClass('show');
        }
        $scope.addFriends = function () {
            var eventName = $(".options.selectedRace").attr("event-name");
            if (eventName == null) {
                $('.app-popup').addClass('show');
                return;
            }
            $('.search-wrapper .search-form').addClass('show');
        }
        $scope.hideAddFriend = function () {
            $('.search-wrapper .search-form').removeClass('show');
        }
        $scope.removeItem = function (item) {
            $('#invite-user-' + item).remove();
            var users = InviteApp.getUserList();
            localStorageService.set('userlist-invite', users);
        };
        $scope.selectRace = function () {
            var users = InviteApp.getUserList();
            localStorageService.set('userlist-invite', users);
            localStorageService.set('selectReturnPath', '#/sendinvite');
            location.href = "#/calendar";
        };
        $scope.deselectRace = function () {
            localStorageService.remove('selectedEvent');
            $('.selectedRaceBox').remove();
        };
        $scope.sendInvitation = function () {
            var eventMonth = $(".options.selectedRace").attr("event-month");
            var eventName = $(".options.selectedRace").attr("event-name");
            if (eventName == null) {
                alert('Por favor seleccione una carrera');
                return;
            }
            var amigos = $(".invitedFriends .user-search-result");
            if (amigos.length == 0) {
                alert('Por favor seleccione al menos un amigo de tu lista antes de enviar la invitacion');
                return;
            }

            var sendData = new Array();
            var userData = backend.getUserData($scope, localStorageService.get('currentUserId'));
            amigos.each(function (index, item) {
                item = $(item);
                var data = {
                    'user_id': userData.User.id,
                    'target_user': item.attr('user-id'),
                    'text': userData.User.nombre + ' ' + userData.User.apellido + ' te ha invitado a correr la carrera <b> ' + eventName + '</b> con El.',
                    'url': '#/calendar/' + eventMonth,
                    'kind': 0

                };
                sendData.push(data);
            });
            if (backend.sendNotifications(sendData)) {
                alert('Se ha enviado las invitaciones correctamente');
                localStorageService.remove('selectedEvent');
                localStorageService.remove('userlist-invite');
                localStorageService.remove('selectedEvent');
                $('.sended').show();
                $('.selected-friends').remove();
                $('.selectedRaceBox').remove();
                $('.invitedFriends .user-search-result').remove();
            } else
                alert('No ha sido posible enviar tus invitaciones');
        };
        $scope.inviteFBEvent = function (evento, titulo) {
            var eventName = $(".options.selectedRace").attr("event-name");
            if (eventName == null) {
                $('.app-popup').addClass('show');
                return;
            }
            window.plugins.socialsharing.share('Voy a Corre la carrera ' + titulo, 'Carrera en runti', null, backend.url + "evento/" + evento + "-" + localStorageService.get('currentUserId') + "-" + titulo);
        };
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("NotificationController", ['$scope', '$routeParams', 'localStorageService', '$sce', '$route', function ($scope, $routeParams, localStorageService, $sce, $route) {
        app.beforeRender($scope, localStorageService);
        var selectedEvent = localStorageService.get('selectedEvent');
        var currentUserId = localStorageService.get('currentUserId');
        if (selectedEvent != null) {
            selectedEvent = backend.getEventById(selectedEvent, localStorageService);
            $scope.selectedEvent = selectedEvent;
        }

        $scope.today = new Date();
        $scope.anos = new Array('2014', '2015', '2016', '2017', '2018');
        $scope.meses = {
            '1': {
                id: '01',
                label: 'ENE'
            },
            '2': {
                id: '02',
                label: 'FEB'},
            '3': {
                id: '03',
                label: 'MAR'},
            '4': {
                id: '04',
                label: 'ABR'},
            '5': {
                id: '05',
                label: 'MAY'},
            '6': {
                id: '06',
                label: 'JUN'},
            '7': {
                id: '07',
                label: 'JUL'},
            '8': {
                id: '08',
                label: 'AGO'},
            '9': {
                id: '09',
                label: 'SEP'},
            '10': {
                id: '10',
                label: 'OCT'},
            '11': {
                id: '11',
                label: 'NOV'},
            '12': {
                id: '12',
                label: 'DIC'},
        };
        $scope.alerts = backend.getAlerts($scope.today, currentUserId);
        $scope.$on('$viewContentLoaded', function () {
            NotificationApp.initialize();
        });
        $scope.formatDate = function (date) {
            var fecha = new Date();
            fecha.setTime(date);
            return $sce.trustAsHtml('Fecha de Alerta: ' + fecha.toLocaleString());
        };
        $scope.selectRace = function () {
            localStorageService.set('selectReturnPath', '#/notification');
            location.href = "#/calendar";
        };
        $scope.deselectRace = function () {
            localStorageService.remove('selectedEvent');
            $('.selectedRaceBox').remove();
        };
        $scope.setNotification = function () {
            //var eventMonth = $(".options.selectedRace").attr("event-month");

            var eventDate = new Date($(".options.selectedRace").attr("event-date"));
            var eventName = $(".options.selectedRace").attr("event-name");
            if (eventName == null) {
                alert('Por favor seleccione una carrera');
                return;
            }
            var ano = parseInt($("#ano").val());
            var mes = parseInt($("#mes").val()) - 1;
            var dia = parseInt($("#dia").val());
            var hora = parseInt($("#hora").val());
            var minuto = parseInt($("#minuto").val());
            if ($("#ampm").val() == 'pm') {
                hora += 12;
            }

            eventDate = '' + eventDate.getDate() + '-' + (eventDate.getMonth() + 1) + '-' + eventDate.getFullYear();
            var date = new Date(ano, mes, dia, hora, minuto);
            var alertData = {
                title: 'Recordatorio de Carrera',
                message: 'La carrera "' + eventName + '" se realizara el ' + eventDate,
                date: date,
                event: eventName
            };
            var alertId = backend.addAlert(alertData, currentUserId);
            if (alertId != -1) {
                alertData.id = alertId;
                window.plugin.notification.local.add(alertData);
                $scope.deselectRace();
                $scope.alerts = backend.getAlerts($scope.today, currentUserId);
                alert('Su notificacion fue agregada correctamente');
                $scope.$apply();
            }
            else {
                alert('No ha sido posible crear su notificacion, intentalo mas tarde.');
            }
        };
        $scope.cancelarAlerta = function (alertId) {
            if (backend.deleteAlert(alertId)) {
                $('#alert-' + alertId).remove();
                window.plugin.notification.local.cancel(alertId, function () {
                });
            } else
            {
                alert('No ha sido posible eliminar tu notificacion, intentalo mas tarde.');
            }

        };
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("NutricionalController", ['$scope', '$location', 'localStorageService', '$sce', function ($scope, $location, localStorageService, $sce) {
        app.beforeRender($scope, localStorageService);
        $scope.posts = backend.getPosts($scope, 2, localStorageService);
        $scope.postType = 'nutricional';
        $scope.pathImg = backend.url + "img/";
        $scope.getExcerpt = function (text) {
            var visibleText = $(text).text().substring(1, 200);
            return $sce.trustAsHtml('<p>' + visibleText + '<p>');
        }
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
        $scope.$on('$viewContentLoaded', function () {
            PostApp.initialize();
        });
    }]);
angulargap.controller("TrainingController", ['$scope', '$location', 'localStorageService', '$sce', function ($scope, $location, localStorageService, $sce) {
        app.beforeRender($scope, localStorageService);
        $scope.posts = backend.getPosts($scope, 1, localStorageService);
        $scope.postType = 'training';
        $scope.pathImg = backend.url + "img/";
        $scope.getExcerpt = function (text) {
            var visibleText = $(text).text().substring(1, 200);
            return $sce.trustAsHtml('<p>' + visibleText + '<p>');
        }
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
        $scope.$on('$viewContentLoaded', function () {
            PostApp.initialize();
        });
    }]);
angulargap.controller("NewsController", ['$scope', '$location', 'localStorageService', '$sce', function ($scope, $location, localStorageService, $sce) {
        app.beforeRender($scope, localStorageService);
        $scope.posts = backend.getPosts($scope, 3, localStorageService);
        $scope.postType = 'Noticias';
        $scope.pathImg = backend.url + "img/";
        $scope.getExcerpt = function (text) {
            var visibleText = $(text).text().substring(1, 200);
            return $sce.trustAsHtml('<p>' + visibleText + '<p>');
        }
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
        $scope.$on('$viewContentLoaded', function () {
            PostApp.initialize();
        });
    }]);
angulargap.controller("ViewPostController", ['$scope', '$routeParams', '$location', 'localStorageService', function ($scope, $routeParams, $location, localStorageService) {
        app.beforeRender($scope, localStorageService);
        var id = $routeParams.id;
        var $categorias = {
            1: 'entrenamiento',
            2: 'nutricional',
            3: 'noticias'
        };
        $scope.post = backend.getPost($scope, id, localStorageService);
        $scope.appKey = backend.key;
        $scope.postType = $categorias[$scope.post.Post.categoria];
        $scope.pathImg = backend.url + "img/";
        $scope.likestatus = backend.getLikeStatusPost(id, localStorageService.get('currentUserId'));
        $scope.shareFBPost = function (message) {
            facebookConnectPlugin.showDialog({method: 'share',
                message: message,
                href: "http://collaboration.wamdigital.com/runti/"
            }, function (response) {
                console.log(response);
            });
        };
        $scope.shareOptions = function () {
            $('#mask,.share-popup').addClass('show');
        };
        $scope.compartir = function (id, title) {
            window.plugins.socialsharing.share('Mira este articulo en Runti "' + title + '"', null, null, backend.url + 'articulo/' + id + '-' + title);
        };
        $scope.closePopup = function () {
            $('#mask,.share-popup').removeClass('show');
        };
        $scope.sendLike = function (elemt) {
            $('#likestatus').val(1);
            if ($('.like').hasClass('liked'))
                $('#likestatus').val(0);
            var likedata = $('#like-form').serialize();
            backend.setLikeToPost(likedata);
        };
        $scope.$on('$routeChangeStart', function (events, next, current) {
            funcPath = "location.href = '#" + current.$$route.originalPath + "'";
            app.pushEventToQuote(funcPath);
        });
    }]);
angulargap.controller("LeftMenuController", ['$scope', '$location', 'localStorageService', function ($scope, $location, localStorageService) {
        $scope.changeLocation = function (link) {
            if (!app.menuOnAnimate) {
                app.pushEventToQuote('events.left()');
                homeApp.hideMenu();
                setTimeout(function () {
                    location.href = '#' + link;
                }, 800);
            }
        };
        $scope.leftActions = {
            0: {
                class: 'nutricional',
                link: '/nutricional',
                title: 'Nutrición'
            },
            1: {
                class: 'training',
                link: '/training',
                title: 'Entrenamiento'
            },
            2: {
                class: 'news',
                link: '/news',
                title: 'Noticias'
            },
        };
    }]);
angulargap.controller("MainMenuController", ['$scope', '$location', 'localStorageService', function ($scope, $location, localStorageService) {
        $scope.validActionForGuest = ['/images', '/tem', '/nutricional', 'training/', '/news'];
        $scope.userId = localStorageService.get('currentUserId');
        $scope.appLogout = function () {
            appLogout();
        };
        $scope.changeLocation = function (link) {
            $scope.userId = localStorageService.get('currentUserId');
            if (!app.menuOnAnimate) {
                homeApp.hideMenu();
                var gotoPage = true;
                if ($scope.userId == 0) {
                    if ($scope.validActionForGuest.indexOf(link) == -1) {
                        gotoPage = false;
                        alert('Para acceder a esta seccion debes de crear una cuenta de usuario o iniciar sesion con facebook');
                    }
                }
                if (gotoPage) {
                    app.actionQuote = new Array();
                    app.pushEventToQuote('events.right()');
                    setTimeout(function () {
                        location.href = '#' + link;
                    }, 800);
                }
            }
        };
        $scope.actions = {
            0: {
                class: 'account',
                link: '/profile',
                title: 'Editar Perfil'
            },
            1: {
                class: 'template',
                link: '/template',
                title: 'Cambiar Fondo'
            },
            2: {
                class: 'friends',
                link: '/friends',
                title: 'Mis Amigos'
            },
            3: {
                class: 'invite',
                link: '/sendinvite',
                title: 'Invitar Amigos a Evento'
            },
            4: {
                class: 'chat',
                link: '/chat',
                title: 'Chat'
            },
            5: {
                class: 'photos',
                link: '/images',
                title: 'Fotos'
            },
            6: {
                class: 'sticker',
                link: '/sticker',
                title: 'Stickers'
            },
            /*7: {
             class: 'spotify',
             link: '/spotify',
             title: 'Playlists Spotify'
             },*/
            9: {
                class: 'term',
                link: '/tem',
                title: 'Terminos y condiciones'
            },
            10: {
                class: 'notification',
                link: '/notification',
                title: 'Noticar Carreras'
            }
        }
    }]);



