/**
 * Created by jcalonsoh on 15-03-15.
 */
var configs = require('./configs.js');
var tcpPortUsed = require('tcp-port-used');

var servers_ldap_config = configs.get('ldap');

var ip_adress = servers_ldap_config.url.split(':');

ip_adress[1] = ip_adress[1].replace('//','');

console.log('Cheking LDAP Server ' + ip_adress[0] + '://' + ip_adress[1] + ':' + ip_adress[2]);

module.exports.check = function(results) {
    tcpPortUsed.check(parseFloat(ip_adress[2]),ip_adress[1])
        .then(function() {
            return results(1);
        }, function(err) {
            console.error(err);
            return results(0);
        }
    );
};
