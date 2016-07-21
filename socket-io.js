module.exports = function(server){
  var io = require('socket.io')(server);
  var ctrNotificaciones = require('./controllers/notificaciones.js');

  var notif = io
    .of('/notificaciones')
    .on('connection' , function(socket){
      console.log("usuario conectado a notificaciones");
      socket.on('new_notif', function(data){
        ctrNotificaciones.countNotificaciones(function(error, response){
          if(error){
            next(error);
          }
          socket.emit('new_notif', response.data);
          socket.broadcast.emit('new_notif', response.data);
        });
      });
    });

  var groups = [
    {
      'grupo_id' : 'g1',
      'users_connect' : [],
      'msgs' : []
    },
    {
      'grupo_id' : 'g2',
      'users_connect' : [],
      'msgs' : []
    }
  ];


  var chat = io
    .of('/chat')
    .on('connection', function(socket){
      console.log(socket.id);
      console.log('usuario conectado al chat');

      var emit_msg = function(users, msg, username){
        console.log('xxxxxxxxx');
        console.log('emitiendo msg');
        users.forEach(function(u, i){
          chat.sockets[u.socket_id].emit('new_msg' , {username : username, msg : msg});
        });
      };

      socket.on('new_msg', function(data){
        console.log(data);
        for(var i = 0; i < groups.length; i++){
          if(groups[i].grupo_id == data.grupo_id){
            var users_connect = groups[i].users_connect;
            for(var j = 0; j < users_connect.length; j++){
              if(users_connect[j].socket_id == socket.id){
                emit_msg(users_connect, data.msg, users_connect[j].username);
                break;
              }
            }
          }
        }
      })

      socket.on('connect_user_group', function(data){
        var grupo_id = data.grupo_id;
        var user = data.user;
        user.socket_id = socket.id;
        for(var i = 0; i < groups.length; i++){
          if(groups[i].grupo_id == grupo_id){
            groups[i].users_connect.push(user);
            console.log(groups[i]);
            var users_connect = groups[i].users_connect;
            for(var j = 0; j < users_connect.length; j++){
              var user_socket_id = users_connect[j].socket_id;
              if(users_connect[j].username == user.username && user_socket_id != socket.id){
                users_connect.splice(j,1);
                j--
                continue;
              }
              if(chat.sockets[user_socket_id]){
                chat.sockets[user_socket_id].emit('connect_user_group', {username : user.username, grupo_id : grupo_id});
              }
            }
            break;
          }
        }
      });
    })

}