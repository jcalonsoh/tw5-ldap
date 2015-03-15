/**
 * Created by jcalonsoh on 15-03-15.
 */
var express = require('express');
var app = express();

var yamls = require('yamljs');

var yamls_ldap = yamls.load('config/ldap.yml');
var yamls_server = yamls.load('config/server.yml');

configs = app.set('ldap', yamls_ldap);
configs = app.set('server', yamls_server);

module.exports = configs;