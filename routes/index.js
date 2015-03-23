var express = require('express');
var router = express.Router();
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth');
var http = require('http');
var _ = require('underscore');
var setCookie = require('set-cookie');
var cookieParser = require('cookie-parser')

var configs = require('../lib/configs');

var app = express();

app.use(passport.session());


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
app.use(cookieParser());

router.use(passport.initialize());

function checkAuth(req, res, next) {
    console.log(app.get('username'));
    if (!app.get('username')) {
        res.redirect('/login');
    }
    next();
}

router.get('/login', function(req, res, next) {
    res.render('login', { title: configs.get('server_common').title });
});

router.post('/login', function(req,res,next) {
    passport.authenticate("ldapauth", {session: true}, function(err,user,info){
        if (err) {
            return next(err); // will generate a 500 error
        }

        if (! user) {
            return res.render('login', { title: configs.get('server_common').title, success : false, message : 'Authentication Failed' });
        }

        setCookie('tw5-session', req.body.username, {
            res: res,
            maxAge: null
        });

        app.set('username', req.body.username);

        console.log('Authentication Success Redirect => ' + configs.get('nginx').url);

        res.redirect(configs.get('nginx').url);

    })(req, res, next);
});

router.all('/*', checkAuth, function(req,res) {
    console.log(req.cookies);
    if(JSON.stringify(req.cookies) === '{}')
        res.redirect('/login');
    res.redirect(configs.get('nginx').url);
});

module.exports = router;
