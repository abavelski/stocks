'use strict';
angular.module('security.service', ['security.login','ui.bootstrap', 'storage'])

.factory('security', function($http, $q, $location, $modal, storage) {

  function redirect(url) {
    url = url || '/';
    $location.path(url);
  }

  var modalInstance;

  function openLoginDialog() {
      modalInstance = $modal.open({
          templateUrl: 'security/login/form.tpl.html',
          controller: 'LoginFormController'
      });
  }

  var service = {
    showLogin: function() {
      openLoginDialog();
    },

    login: function(username, password, callback) {
      $http.post('/api/login', {username: username, password: password})
          .success(function(data){
              service.currentUser = data.user.login;
              storage.saveUser(data.user);
              storage.saveToken(data.token);
              if ( service.isAuthenticated() ) {
                  modalInstance.close(true);
              }
          })
          .error(function(){
            storage.clearStorage();
            service.currentUser = null;
            callback('Invalid credentials');
          });
    },
    logout: function(redirectTo) {
      storage.clearStorage();
      service.currentUser = null;
      redirect(redirectTo);      
    },

    isAuthenticated: function(){
      return !!storage.getToken();
    },
    updateCurrentUser : function() {
      service.currentUser =  storage.getUserName();
    },
    currentUser : null
  };

  return service;
})

.factory('authInterceptor', function ($rootScope, $q, storage) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if (storage.getToken()) {
        config.headers.Authorization = 'Bearer ' + storage.getToken();
      }
      return config;
    },
    response: function (response) {
      if (response.status === 401) {
          console.log('401');
        // TODO: handle the case where the user is not authenticated
      }
      return response || $q.when(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});

