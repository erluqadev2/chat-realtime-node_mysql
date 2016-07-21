var $ = require('jquery');
var io = require('socket.io-client');

var socket = io.connect("http://192.168.1.58:3000/chat", {
      'reconnection': true,
      'reconnectionDelay': 3000,
      'reconnectionDelayMax' : 5000,
      'reconnectionAttempts': 3
});

socket.on('new_msg', function(data){
  console.log(data);
  var span_new_msg =  $('<div>').html(data.msg);
  $(".content_chat").append(span_new_msg);
});

socket.on('connect_user_group', function(data){
  var user = sessionStorage.getItem("user");
  if(data.usuario == user.username){
    $(".content_grupos").hide('slow');
    $(".content_chat").show('slow');
    $(".content_input_chat").show('slow');
  }
});


$(function(){
  $('#btn_send_msg').on('click', function(){
    var msg = $(".content_input_msg input").val();
    console.log(msg);
    if(msg == ''){
      alert('ingrese mensaje');
      return;
    }
    socket.emit('new_msg', {msg : msg});
    $(".content_input_msg input").val('')
  });
  $(".content_input_msg input").on('keyup', function(e){
    if(e.keyCode == 13){
      $('#btn_send_msg').trigger('click');
    }
  })
  $("#btn_send_login").on('click', function(){
    var username = $('input[name=usuario]').val();
    var clave = $('input[name=clave]').val();
    if(username == '' || clave == ''){
      alert('Ingrese su usuario y clave');
      return;
    }
    $.ajax({
      type: 'POST',
      url: 'chat/login',
      data : {username : username, clave: clave},
      dataType : 'json',
      success : function(respJson){
        console.log(respJson);
        if(respJson.msg == 'success'){
          sessionStorage.setItem('user', respJson.user);
          respJson.user.groups.forEach(function(g, i){
            var div = $('<div>').html('Grupo ' + g);
            div.data('id' , g);
            $(".content_grupos").append(div);
          });
          $(".content_login").hide('slow');
          $(".content_grupos").show('slow');
          $(".content_grupos div").on('click', function(){
            var id = $(this).data('id');
            console.log('click ' + id);
            var user = sessionStorage.getItem('user');
            socket.emit('connect_user_group', {'user' : user, 'grupo_id' : id});
          });
        }
      },
      error: function(jqXHR, status, error){
        console.log(error);
      }
    });
  });
});