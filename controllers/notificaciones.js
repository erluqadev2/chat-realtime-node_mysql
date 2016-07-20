var connection = require('../models/connection.js');
var uuid = require('uuid');

var ctrNotificaciones = {};

ctrNotificaciones.countNotificaciones = function(callback){
  connection.executeQuery('SELECT count(*) as num_notif FROM notificacion', [], function(error, result){
    if(error){
      callback(error);
    }
    callback(false, {'data' : result[0]});
  });
};

ctrNotificaciones.saveNotificacion = function(params, callback){
  params.id = uuid.v4();
  connection.executeQuery('INSERT INTO notificacion SET ?', params, function(error, result){
    if(error){
      callback(error);
    }
    callback(false, {'msg' : 'success'});
  })
};

/*ctrNotificaciones.findKardex = function(callback){
  connection.executeQuery('select * from kardex', [], callback);
};*/

module.exports = ctrNotificaciones;