/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

angulargap
        .config(function ($routeProvider, $compileProvider) {
            $routeProvider.when("/",
                    {
                        templateUrl: "views/load.html",
                        controller: "LoadController"
                    }
            );
            $routeProvider.when("/login",
                    {
                        templateUrl: "views/login.html",
                        controller: "LoginController"
                    }
            );
            $routeProvider.when("/home",
                    {
                        templateUrl: "views/home.html",
                        controller: "HomeController"
                    }
            );
            $routeProvider.when("/calendar",
                    {
                        templateUrl: "views/calendar.html",
                        controller: "CalendarController"
                    }
            );
            $routeProvider.when("/calendar/:month",
                    {
                        templateUrl: "views/calendar-view.html",
                        controller: "CalendarViewController"
                    }
            );
            $routeProvider.when("/calendar-select/:month",
                    {
                        templateUrl: "views/calendar-view-select.html",
                        controller: "CalendarSelectViewController"
                    }
            );
            $routeProvider.when("/profile",
                    {
                        templateUrl: "views/profile.html",
                        controller: "ProfileController"
                    }
            );
            $routeProvider.when("/profile/:userid/:fcid?",
                    {
                        templateUrl: "views/profile-view.html",
                        controller: "ProfileViewController"
                    }
            );
            $routeProvider.when("/template",
                    {
                        templateUrl: "views/template.html",
                        controller: "TemplateController"
                    }
            );
            $routeProvider.when("/sticker",
                    {
                        templateUrl: "views/sticker.html",
                        controller: "StickerController"
                    }
            );
            $routeProvider.when("/sticker-select",
                    {
                        templateUrl: "views/sticker-select.html",
                        controller: "StickerSelectController"
                    }
            );
            $routeProvider.when("/sticker-send/:idsticker",
                    {
                        templateUrl: "views/sticker-send.html",
                        controller: "StickerSendController"
                    }
            );
            $routeProvider.when("/images/",
                    {
                        templateUrl: "views/images.html",
                        controller: "ImagesController"
                    }
            );
            $routeProvider.when("/images-list/:userid?",
                    {
                        templateUrl: "views/images-list.html",
                        controller: "ImagesListController"
                    }
            );
            $routeProvider.when("/images-album-runti",
                    {
                        templateUrl: "views/images-albums.html",
                        controller: "ImagesAlbumsController"
                    }
            );
            $routeProvider.when("/images-view-album/:albumId",
                    {
                        templateUrl: "views/albums-images-list.html",
                        controller: "ImagesViewAlbumsController"
                    }
            );
            $routeProvider.when("/images-view/:imagen",
                    {
                        templateUrl: "views/images-view.html",
                        controller: "ImagesViewController"
                    }
            );
            $routeProvider.when("/images-comments/:imagen",
                    {
                        templateUrl: "views/images-comments.html",
                        controller: "ImagesViewController"
                    }
            );

            $routeProvider.when("/image-upload",
                    {
                        templateUrl: "views/images-upload.html",
                        controller: "ImagesUploadController"
                    }
            );
            $routeProvider.when("/spotify",
                    {
                        templateUrl: "views/spotify.html",
                        controller: "SpotifyController"
                    }
            );
            $routeProvider.when("/spotify/:playlist",
                    {
                        templateUrl: "views/spotify-view.html",
                        controller: "SpotifyViewController"
                    }
            );
            $routeProvider.when("/friends",
                    {
                        templateUrl: "views/friends.html",
                        controller: "FriendsController"
                    }
            );
            $routeProvider.when("/friends-list",
                    {
                        templateUrl: "views/friends-lists.html",
                        controller: "FriendsListController"
                    }
            );
            $routeProvider.when("/search-friends",
                    {
                        templateUrl: "views/friends-search.html",
                        controller: "SearchFriendsController"
                    }
            );
            $routeProvider.when("/friends-request",
                    {
                        templateUrl: "views/friends-request.html",
                        controller: "FriendsRequestController"
                    }
            );
            $routeProvider.when("/sendinvite",
                    {
                        templateUrl: "views/sendinvite.html",
                        controller: "SendinviteController"
                    }
            );
            $routeProvider.when("/notification",
                    {
                        templateUrl: "views/notifications.html",
                        controller: "NotificationController"
                    }
            );
            $routeProvider.when("/nutricional",
                    {
                        templateUrl: "views/posts.html",
                        controller: "NutricionalController"
                    }
            );
            $routeProvider.when("/training",
                    {
                        templateUrl: "views/posts.html",
                        controller: "TrainingController"
                    }
            );
            $routeProvider.when("/news",
                    {
                        templateUrl: "views/posts.html",
                        controller: "NewsController"
                    }
            );
            $routeProvider.when("/viewpost/:id",
                    {
                        templateUrl: "views/post.html",
                        controller: "ViewPostController"
                    }
            );
            $routeProvider.when("/chat",
                    {
                        templateUrl: "views/chatlist.html",
                        controller: "ChatListController"
                    }
            );
            $routeProvider.when("/chat/:id/:message?",
                    {
                        templateUrl: "views/chatmessage.html",
                        controller: "ChatMessageController"
                    }
            );
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

        });

