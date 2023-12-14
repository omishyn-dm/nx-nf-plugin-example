const fse = require('fs-extra');
const path = require('path');

function getSource(name) {
	return path.join(__dirname, `./resources/${name}`);
}

function getDest(name) {
	return path.join(__dirname, `./node_modules/${name}`);
}

function copyResources() {
	try {
		['highcharts', '@angular-architects', '@bugsnag'].forEach(async (name) => {
			await fse.copy(getSource(name), getDest(name));
		});

		console.log('files in resources has been copy to node_modules');
	} catch (err) {
		console.error(err);
	}
}

copyResources();
