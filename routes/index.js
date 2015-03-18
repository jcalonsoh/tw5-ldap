var express = require('express');
var router = express.Router();
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth');

var configs = require('../lib/configs');

var OPTS = {
    server: {
        url: configs.get('ldap').url,
        bindDn: configs.get('ldap').bindDn,
        bindCredentials: configs.get('ldap').bindCredentials,
        searchBase: configs.get('ldap').searchBase,
        searchFilter: configs.get('ldap').searchFilter
    }
};

passport.use(new LdapStrategy(OPTS));

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
