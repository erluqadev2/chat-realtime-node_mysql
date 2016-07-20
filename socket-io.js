module.exports = function(server){
  var io = require('socket.io')(server);
  var ctrNotificaciones = require('./controllers/notificaciones.js');

  var notif = io
    .of('/notificaciones')
    .on('connection' , function(socket){
      console.log("usuario conectado");
      socket.on('new_notif', function(data){
        console.log('**** nueva notif socke io ****');
        console.log(data);
        ctrNotificaciones.countNotificaciones(function(error, response){
          if(error){
            next(error);
          }
          console.log('**********************');
          console.log('a punto de emitir el broadcast');
          console.log(response.data);
          console.log('**********************');
          socket.emit('new_notif', response.data);
          socket.broadcast.emit('new_notif', response.data);
        });
      });
    });

  var chat = io
    .of('/chat')
    .on('connection', function(socket){
      console.log('usuario conectado al chat');
      socket.on('new_msg', function(data){
        console.log('nuevo mensaje');
        console.log(data);
        socket.emit('new_msg', data);
        socket.broadcast.emit('new_msg', data);
      })
    })

}