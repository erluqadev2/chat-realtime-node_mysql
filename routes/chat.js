var express = require('express');
var router = express.Router();

var groups = ['g1', 'g2'];

var users = [
  {
    username : 'ericson',
    clave : 'ericson',
    groups : ['g1', 'g2']
  },
  {
    username : 'rodrigo',
    clave : 'rodrigo',
    groups : ['g1', 'g2']
  },
  {
    username : 'mishelle',
    clave : 'mishelle',
    groups : ['g1']
  },
  {
    username : 'antonia',
    clave : 'antonia',
    groups : ['g2']
  }
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('chat');
});

router.post('/login', function(req, res, next) {
  var user = req.body;
  var correcto = false;
  console.log(req.body);
  for(var i = 0; i < users.length; i++){
    if(users[i].username == user.username && users[i].clave == user.clave){
      correcto = true;
      user = users[i];
      break;
    }
  }
  if(correcto){
    res.status(200).json({'msg' : 'success', 'user' : user});
  }
  else{
    res.status(403).json({'msg' : 'error'});
  }
});

module.exports = router;