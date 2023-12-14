const {withNativeFederation} = require('@angular-architects/native-federation/config');
const {createNfConfig} = require('../nf');

module.exports = withNativeFederation(createNfConfig('host'));
