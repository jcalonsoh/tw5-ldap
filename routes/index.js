var express = require('express');
var router = express.Router();
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth');

var configs = require('../lib/configs');

var check_ldap_service = require('../lib/check_ldap_service');

//console.log(check_ldap_service);

passport.use(new LdapStrategy(configs.get('ldap')));

router.use(passport.initialize());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Tiddly Wiki LDAP login' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Tiddly Wiki LDAP login' });
});

router.post('/login', passport.authenticate('ldapauth', {session: false}), function(req, res, next) {
  res.render('index', { title: 'Go Wiki' });
});

module.exports = router;
