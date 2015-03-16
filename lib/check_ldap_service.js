/**
 * Created by jcalonsoh on 15-03-15.
 */
var express = require('express');
var app = express();
var configs = require('./configs.js');

var tcpPortUsed = require('tcp-port-used');

var servers_ldap_config = configs.get('ldap');

console.log(servers_ldap_config.server.port);

var check_ldap_service = 2;

tcpPortUsed.check(servers_ldap_config.server.port, servers_ldap_config.server.ip_address)
  .then(function(inUse) {
    console.log('Port usage: '+inUse);
    check_ldap_service = app.set('ldap_enable', 0);
  }, function(err) {
    console.error('Error on check:', err.message);
    check_ldap_service = app.set('ldap_enable', 1);
  });

module.export = check_ldap_service;