/**
 * Created by jcalonsoh on 15-03-15.
 */
var express = require('express');
var app = express();

var async = require('async');

var configs = require('./configs.js');

var tcpPortUsed = require('tcp-port-used');

var servers_ldap_config = configs.get('ldap');

var ip_adress = servers_ldap_config.url.split(':');

ip_adress[1] = ip_adress[1].replace('//','');

console.log('Cheking LDAP Server ' + ip_adress[0] + '://' + ip_adress[1] + ':' + ip_adress[2]);

var check_ldap_service = async.each('ldap',
    function () {
        tcpPortUsed.check(parseFloat(ip_adress[2]), ip_adress[1])
            .then(function(inUse) {
                console.log('Port usage: '+inUse);
                check_ldap_service = app.set('ldap', 0);
            }, function(err) {
                console.error('Error on check:', err.message);
                check_ldap_service = app.set('ldap', 1);
            })
    }
);

module.exports = check_ldap_service;