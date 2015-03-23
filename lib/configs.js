/**
 * Created by jcalonsoh on 15-03-15.
 */
var express = require('express');
var app = express();

var nconf = require('nconf');
var yaml = require('js-yaml');

var app_config_ldap = __dirname + '/../config/ldap.yml';
var app_config_nginx = __dirname + '/../config/nginx.yml';
var app_config = __dirname + '/../config/server.yml';

nconf.argv().env();

nconf.file('ldap', {
    file: app_config_ldap,
    format: {
        parse: yaml.safeLoad,
        stringify: yaml.safeDump
    }
});

nconf.file('nginx', {
    file: app_config_nginx,
    format: {
        parse: yaml.safeLoad,
        stringify: yaml.safeDump
    }
});

nconf.file('server_common', {
    file: app_config,
    format: {
        parse: yaml.safeLoad,
        stringify: yaml.safeDump
    }
});

nconf.defaults({
    'ldap': {
        'url': 'ldap://localhost:389',
        'bindDn': 'cn=root',
        'bindCredentials': 'password',
        'searchBase': 'dc=example,dc=com',
        'searchFilter': '(uid={{username}})'
    },
    'server_common': {
        'ip_address': '0.0.0.0',
        'port': '5000'
    },
    'nginx': {
        'url': 'http://localhost'
    }
});

//console.log('NCONF LDAP: ');
//console.log(nconf.get('ldap'));
//console.log('NCONF Server: ');
//console.log(nconf.get('server_common'));

configs = app.set('ldap', nconf.get('ldap'));
configs = app.set('server_common', nconf.get('server_common'));
configs = app.set('nginx', nconf.get('nginx'));

module.exports = configs;