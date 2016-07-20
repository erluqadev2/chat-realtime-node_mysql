var $ = require('jquery');
var io = require('socket.io-client');

var socket = io.connect("http://localhost:3000");

socket.on('new_notif', function(data){
  console.log('recibiendo nueva notificacion en el cliente');
  console.log(data);
  $("#span_num_notif").text(" " + data.num_notif);
})

var p = $("p");

console.log(p.html());

$("#btn_send").on('click' , function(){
  console.log('click');
  $.ajax({
    type : 'POST',
    url : 'notifications/save',
    data : $("#form_notif").serialize(),
    dataType : 'json',
    success : function(respJson){
      console.log(respJson);
      socket.emit('new_notif',{'msg' : 'nueva notificación'});
    },
    error : function(jqXHR, status, error){
      console.log(error);
    }
  });
});

$(function(){
  var num_notif = function(){
    $.ajax({
      type : 'GET',
      url : 'notifications/count',
      data : {},
      dataType : 'json',
      success : function(respJson){
        var data = respJson.data;
        $("#span_num_notif").text(" " + data.num_notif);
      },
      error : function(jqXHR, status, error){
        console.log(error);
      }
    });
  }
  num_notif();
});
