var express = require('express');
var router = express.Router();
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth');
var needle = require('needle');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});
var proxy_ex = require('express-http-proxy');
var proxyServer = require('http-route-proxy');

var request = require('url');

var request = require('request');

var tunnel = require('tunnel');

var neoProxy = require('neo-proxy');

var proxy_mid = require('proxy-middleware');

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

passport.use(new LdapStrategy(OPTS));

router.use(passport.initialize());

function checkAuth(req, res, next) {
    if (!app.get('username')) {
        res.redirect('/login');
    } else {
        next();
    }
}

router.get('/', checkAuth, function(req, res, next) {
    //proxy.web(req, res, { target: 'http://10.200.201.98:5000', method: 'GET' });
    //res.render('proxy');
});

router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Tiddly Wiki LDAP login' });
});

router.post('/login', function(req,res,next) {
    passport.authenticate("ldapauth", {session: false}, function(err,user,info){
        if (err) {
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
            return res.render('login', { success : false, message : 'authentication failed' });
        }

        app.set('username', req.body.username);
        res.redirect('/');

    })(req, res, next);
});

router.all('/*', function(req,res,next) {
    //res.render('proxy');
    proxy.web(req, res, { target: 'http://10.200.201.98:5000'});
});


//router.all('/*', function(req, res, next) {
//    proxy.web(req, res, { target: 'http://10.200.201.98:5000'});
//    //req.pipe(request('http://10.200.201.98:5000' + req.url));
//});


module.exports = router;
