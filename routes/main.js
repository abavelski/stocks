var  myConfig = require('../views/views');

module.exports = function(router) {
  
  router.route('/').get(function(req, res) {
    res.render('index', {
      config : myConfig
    });
  });

};