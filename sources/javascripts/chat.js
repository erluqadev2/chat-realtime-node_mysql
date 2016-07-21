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
  var div_new_msg =  $('<div>');
  var span_user = $('<span class="username">').text(data.username);
  var span_msg = $('<span class="msg">').text(data.msg);
  div_new_msg.append(span_user);
  div_new_msg.append(span_msg);
  $(".content_chat").append(div_new_msg);
});

socket.on('connect_user_group', function(data){
  console.log('connect_user_group');
  console.log(data);
  var username = sessionStorage.getItem("username");
  if(data.username == username){
    sessionStorage.setItem('grupo_id' , data.grupo_id);
    $(".content_grupos").hide('slow');
    $(".content_chat").show('slow').find('h3').html("Chat del Grupo " + data.grupo_id).data('id', data.grupo_id);
    $(".content_input_chat").show('slow');
  }
  else{
    $("#alert_user_connect").html("<strong>" + data.username + "</strong>" + " acaba de conectarse")
                            .show('slow');
    setTimeout(function(){
      $("#alert_user_connect").hide('slow');
    }, 1000);
  }
});


$(function(){
  $('#btn_send_msg').on('click', function(){
    var msg = $(".content_input_chat input").val();
    if(msg == ''){
      alert('ingrese mensaje');
      return;
    }
    var grupo_id = sessionStorage.getItem('grupo_id');
    socket.emit('new_msg', {msg : msg, grupo_id : grupo_id});
    $(".content_input_chat input").val('')
  });


  $(".content_input_chat input").on('keyup', function(e){
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
        if(respJson.msg == 'success'){
          sessionStorage.setItem('username', respJson.user.username);
          sessionStorage.setItem('clave', respJson.user.clave);
          respJson.user.groups.forEach(function(g, i){
            var div = $('<div>').html('Grupo ' + g);
            div.data('id' , g);
            $(".content_grupos").append(div);
          });
          $(".content_login").hide('slow');
          $(".content_grupos").show('slow');


          $(".content_grupos div").on('click', function(){
            var id = $(this).data('id');
            var username = sessionStorage.getItem('username');
            var clave = sessionStorage.getItem('clave');
            socket.emit('connect_user_group', {'user' : {username : username, clave : clave}, 'grupo_id' : id});
          });
        }
      },
      error: function(jqXHR, status, error){
        console.log(error);
      }
    });
  });
});