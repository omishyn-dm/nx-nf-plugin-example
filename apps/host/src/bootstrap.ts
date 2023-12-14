/* eslint-disable @typescript-eslint/naming-convention */
import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {environment} from './environments/environment';
import {MF_PROVIDERS} from './app/di/mf.providers';
import {appContainerConfig} from './app/app-container.config';
import {RouteHelper} from './app/helpers/route.helper';
import {AppContainer} from './app/app-container';

if (environment.production) {
	enableProdMode();
}

const appConfig = {
	settings: {
		app_name: '',
		project: '',
	},
	mfConfig: {
		project: '',
		projectName: '',
	},
	assocMfRoutes: {},
};

const isLocal = environment.envName === 'local';

function prepareEnvAuto(data: Record<string, any>): Record<string, any> {
	const keys = Object.keys(data);

	keys.forEach((key) => {
		if (typeof data[key] === 'object' && data[key] !== null) {
			if ((data[key] as Object)?.hasOwnProperty('env') && data[key].env !== 'auto') {
				data[key].env = 'auto';
			}

			if ((data[key] as Object)?.hasOwnProperty('autoEnvName') && data[key].autoEnvName !== 'auto') {
				data[key].autoEnvName = environment.envName;
			}

			prepareEnvAuto(data[key]);
		}
	});

	return data;
}

fetch('config/gui.settings.json')
	.then(async (resp) => resp.json())
	.then((settings) => {
		appConfig.settings = settings;

		return fetch('config/nf.config.json');
	})
	.then(async (resp) => resp.json())
	.then((mfConfig) => {
		if (mfConfig) {
			appConfig.mfConfig = {
				...appConfig.mfConfig,
				...(isLocal ? mfConfig : prepareEnvAuto(mfConfig)),
			};
		}

		appConfig.mfConfig.project = appConfig.settings.app_name;
		appConfig.mfConfig.projectName = appConfig.settings.project;

		const {assocMfRoutes} = RouteHelper.getDynamicRoutesWithConfig(appConfig.mfConfig as unknown, MF_PROVIDERS);

		if (assocMfRoutes) {
			appConfig.assocMfRoutes = assocMfRoutes;
		}
	})
	.then(() => bootstrapApplication(AppContainer, appContainerConfig(environment, appConfig)))
	// Otherwise, log the boot error
	.catch((err) => {
		console.error('host bootstrapApplication', err);
	});
