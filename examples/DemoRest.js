/**
 * Created by yang on 2016/3/7.
 */
var app = angular.module('app', ['ng-resthelper']);

app.factory('AppRest', function(RestApi) {
    return RestApi({
        user: {
            uri: '/user',
            get: true,
            post: true,
            put: true,
            remove: true,
            sign: ['post', '/user/sign']
        }
    });
});

app.service('User', function(AppRest) {

    function User(attrs) {
        attrs = attrs || {};

        this.userId = attrs.userId;
        this.userName = attrs.userName;
        this.gender = attrs.gender;
        this.birth = attrs.birth;
    }

    User.prototype = {
        constructor: User,

        getUser: function() {
            return AppRest.user.get({userId: this.userId}).then(function(res) {
                return new User(res);
            });
        },

        newUser: function() {
            return AppRest.user.post(this).then(function(res) {
                return new User(res);
            });
        },

        updateUser: function() {
            return AppRest.user.put(this).then(function(res) {
                return new User(res);
            });
        },

        deleteUser: function() {
            return AppRest.user.remove({userId: this.userId});
        },

        sign: function() {
            return AppRest.user.sign(this);
        }
    };

    return User;
});