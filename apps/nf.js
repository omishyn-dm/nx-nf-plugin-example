const {getMappedPaths} = require('@softarc/native-federation/src/lib/utils/mapped-paths');
const path = require('path');
const {shareAll} = require('@angular-architects/native-federation/config');
const rootTsConfigPath = path.join(__dirname, '../tsconfig.base.json');
const defaultSharedMappings = getMappedPaths({
	rootTsConfigPath,
	sharedMappings: [
		/* mapped paths to share */
	],
});

function createNfConfig(name, exposes = {}, sharedMappings = defaultSharedMappings) {
	return {
		name,
		exposes,
		shared: {
			...shareAll({singleton: true, strictVersion: false, requiredVersion: 'auto'}),
		},
		skip: [
			// Add further packages you don't need at runtime
			'exceljs',
			'@bugsnag/js',
			'@bugsnag/plugin-angular',
			'@amcharts/amcharts4',
			'lodash-es',
			'highcharts',
			'angular-highcharts',
			'lodash',
			'file-saver',
			'bowser',
			'coa',
			'shifty',
			'rxjs/ajax',
			'rxjs/fetch',
			'rxjs/testing',
			'rxjs/webSocket',
		],
		sharedMappings,
	};
}

module.exports = {
	createNfConfig,
};
