var $ = require('jquery');
var io = require('socket.io-client');

var socket = io.connect("http://192.168.1.58:3000/chat");
socket.on('new_msg', function(data){
  console.log(data);
  var span_new_msg =  $('<div>').html(data.msg);
  $(".content_chat").append(span_new_msg);
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
});