var mysql = require('mysql');

var bd = 'test_node';
var host = 'localhost';
var user = 'root';
var password = '';
var connection;
var objConnection = {};

var conectar = function(callback){
  connection = mysql.createConnection({
     host: host,
     user: user,
     password: password,
     database: bd,
     port: 3306
  });
  connection.connect(callback);
};

objConnection.executeQuery = function(sql , params, callback){
  conectar(function(error){
    if(error){
      callback(error);
    }
    console.log("*** Conexión a la BD abierta. ***");
    connection.query(sql, params, function(error, result){
      callback(error, result);
      connection.end(function(err){
        if (err){
          console.log("error al cerrar la conexion a la BD");
        }
        console.log("*** Conexión a la BD cerrada. ***");
      });
    });
  })
};


module.exports = objConnection;