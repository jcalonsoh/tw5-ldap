var express = require('express');
var router = express.Router();
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth');
var needle = require('needle');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
var expressproxy = require('express-http-proxy');
var http = require('http');
var _ = require('underscore');

var request = require('request');
var tunnel = require('tunnel');
var url = require('url');

var configs = require('../lib/configs');

var app = express();

var OPTS = {
    server: {
        url: configs.get('ldap').url,
        bindDn: configs.get('ldap').bindDn,
        bindCredentials: configs.get('ldap').bindCredentials,
        searchBase: configs.get('ldap').searchBase,
        searchFilter: configs.get('ldap').searchFilter
    }
};

function allowCrossDomain(req, res, next, err) {
  console.log('allowingCrossDomain: ' + req.method + '=>' + req.url);
  //console.log('Body => ' + req.body);
  req.setHeader('Access-Control-Allow-Origin', '*');
  req.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE, OPTIONS');
  req.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Origin, Accept');
  req.setHeader('Access-Control-Allow-Credentials', 'true');

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Origin, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  next();
};

passport.use(new LdapStrategy(OPTS));

router.use(passport.initialize());

function checkAuth(req, res, next) {
    if (!app.get('username')) {
        res.redirect('/login');
    } else {
      console.log(app.get('username'));
        next();
    }
}

router.get('/', checkAuth, function(req, res, next) {
    proxy.web(req, res, { target: 'http://10.200.201.98:5000', method: 'GET' });
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Tiddly Wiki LDAP login' });
});

router.post('/login', function(req,res,next) {
    passport.authenticate("ldapauth", {session: false}, function(err,user,info){
        if (err) {
            return next(err); // will generate a 500 error
        }

        if (! user) {
            return res.render('login', { success : false, message : 'authentication failed' });
        }

        app.set('username', req.body.username);
        res.redirect('/');

    })(req, res, next);
});

router.all('/*', function(req,res) {
  proxy.web(req, res, { target: 'http://localhost:8888' });
});

module.exports = router;
