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

      socket.on('new_msg', function(data){
        socket.emit('new_msg', data);
        socket.broadcast.emit('new_msg', data);
      })

      socket.on('connect_user_group', function(data){
        console.log(data);
        var grupo_id = data.grupo_id;
        console.log(grupo_id);
        for(var i = 0; i < groups.length; i++){
          if(groups[i].grupo_id == grupo_id){
            var user = data.user;
            user.socket_id = socket.id;
            console.log(socket.id);
            groups[i].users_connect.push(user);
            var users_connect = groups[i].users_connect;
            console.log(users_connect);
            for(var j = 0; j < users_connect.length; j++){
              var socket_id = users_connect['socket_id'];
              console.log(socket_id);
              if(users_connect[j].username == user.username && users_connect[j].socket_id != socket.id){
                users_connect.splice(j,1);
                j--
                continue;
              }
              if(chat.sockets[socket_id]){
                console.log(socket_id);
                chat.sockets[socket_id].emit('connect_user_group', {usuario : data.user.username});
              }
            }
            break;
          }
        }
      });
    })

}