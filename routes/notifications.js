var express = require('express');
var router = express.Router();
var ctrNotificaciones = require('../controllers/notificaciones.js');

/* GET notifications listing. */
router.get('/', function(req, res, next){
  res.render('notificaciones', { title: 'Notificaciones'});
});

router.post('/save', function(req, res, next){
  ctrNotificaciones.saveNotificacion(req.body, function(error, response){
    if(error){
      next(error);
    }
    res.status(200).json(response);
  })
});

router.get('/count', function(req, res, next){
  ctrNotificaciones.countNotificaciones(function(error, response){
    if(error){
      next(error);
    }
    res.status(200).json(response);
  });
});

/*router.get('/kardex', function(req, res, next){
  ctrNotificaciones.findKardex(function(error, result){
    if(error){
      next(error);
    }
    res.render('kardex', { title: 'kardex' , 'data' : result});
  });
});
*/

module.exports = router;
