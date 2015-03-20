var express = require('express');
var router = express.Router();
var passport = require('passport');
var LdapStrategy = require('passport-ldapauth');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});

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

/*
var isAuthenticated = function(req,res,next){
    if(res.isAuthenticated())
        next();
    res.redirect('/login');
}
*/

/* GET home page.
router.get('/', ensureAuthenticated, function(req, res, next) {
    return proxy.web(req, res, {
        forward: {
            host: '10.200.201.98',
            port: 5000
        }
    });
});
*/

router.get('/', function(req, res, next) {
    res.render('login', { title: 'Tiddly Wiki LDAP login' });
});

router.post('/', function(req,res,next) {
    passport.authenticate("ldapauth", {session: false}, function(err,user,info){
        if (err) {
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (! user) {
            return res.render('login', { success : false, message : 'authentication failed' });
        }
        /*
        return proxy.web(req, res, {
            forward: {
                port: 5000,
                host: '10.200.201.98'
            }
        });*/

        proxy.web(req, res, { target: 'http://10.200.201.95/centos6.6/', method: 'GET' });

    })(req, res, next);
});


module.exports = router;
