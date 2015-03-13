var express = require('express');
var router = express.Router();
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth');

var OPTS = {
  server: {
    url: 'ldap://10.200.201.98:389',
    bindDn: 'cn=root,dc=bbr,dc=cl',
    bindCredentials: 'dev.tes.123',
    searchBase: 'dc=bbr,dc=cl',
    searchFilter: '(uid={{username}})'
  }
};

passport.use(new LdapStrategy(OPTS));

router.use(passport.initialize());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Tiddly Wiki LDAP login' });
});

router.post('/login', passport.authenticate('ldapauth', {session: false}), function(req, res, next) {
  res.render('index', { title: 'Go Wiki' });
});

module.exports = router;
