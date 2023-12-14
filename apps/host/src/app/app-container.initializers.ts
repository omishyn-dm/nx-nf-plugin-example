import {APP_INITIALIZER, createNgModule, Injector} from '@angular/core';
import {Router, Routes} from '@angular/router';
import {HttpClient as NgHttpClient} from '@angular/common/http';
import {MAT_CHIPS_DEFAULT_OPTIONS} from '@angular/material/chips';
import {MAT_PAGINATOR_DEFAULT_OPTIONS} from '@angular/material/paginator';
import {CookieService} from 'ngx-cookie-service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {loadRemoteModule} from '@angular-architects/native-federation';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HIGHCHARTS_MODULES} from 'angular-highcharts';
import {
	MfInjectorToken,
	MfSettingsInjectionToken,
	RouteInitializer,
} from './di/tokens';
import {getRootRoutes} from './helpers/root-routes.helper';
import {PLATFORM_ROUTES} from './di/platform.token';
import {BootstrapAppContainerLoaderHelper, MfExtParams} from './helpers/bootstrap-app-container-loader.helper';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-om-perfect-scrollbar';
import {RouteHelper} from './helpers/route.helper';

export function highchartsModules() {
	// apply Highcharts Modules to this array
	return [

	];
}

const routeList = (mfConfig: any, assocMfRoutes: any) => () => {
	return getRootRoutes({
		config: mfConfig,
		project: mfConfig['project'],
		assocMfRoutes,
	});
};

export const routeInitializer = (router: Router, rootRoutes: Routes) => () => {
	router.resetConfig(rootRoutes);
};

// AoT requires an exported function for factories
export function TranslateHttpLoaderFactory(httpClient: NgHttpClient) {
	return new TranslateHttpLoader(httpClient, 'assets/i18n/');
}

export const preloadModules = (mfConfig: MfExtParams, injector: Injector) => async () => {
	const rootModules = RouteHelper.getRootModuleNames(mfConfig);

	if (rootModules?.length) {
		for (const moduleName of rootModules) {
			const {exposedModule: preloadExposedModule} = moduleName.includes('/')
				? RouteHelper.getRootTab(mfConfig, moduleName)
				: mfConfig[mfConfig.project]['preloadModules'][moduleName];

			const {
				remoteEntry,
				exposedModule,
				reference: remoteName,
			} = RouteHelper.getLoadRemoteModuleOptions(mfConfig, moduleName);

			const preloadModule = await loadRemoteModule({
				remoteEntry,
				exposedModule,
				remoteName,
			});

			createNgModule(preloadModule?.default?.[0]?.component || preloadModule[preloadExposedModule], injector);
		}
	}

	Object.values(['host']).forEach((key) => {
		BootstrapAppContainerLoaderHelper.loadBootstrapContainer(key, mfConfig as MfExtParams, mfConfig.environment);
	});
};

export const APP_INITIALIZERS = [
	{
		provide: APP_INITIALIZER,
		useFactory: preloadModules,
		deps: [MfSettingsInjectionToken, Injector, PLATFORM_ROUTES],
		multi: true,
	},
	{
		provide: MfInjectorToken,
		useFactory: (injector: Injector) => () => injector,
		deps: [Injector],
	},
	{
		provide: RouteInitializer,
		useFactory: (mfConfig: any, assocMfRoutes: any) =>
			routeList(mfConfig, assocMfRoutes)(),
		deps: [MfSettingsInjectionToken, PLATFORM_ROUTES],
	},
	{
		provide: APP_INITIALIZER,
		useFactory: routeInitializer,
		deps: [Router, RouteInitializer],
		multi: true,
	},
];

export const MODULE_PROVIDERS = [
	{
		provide: PERFECT_SCROLLBAR_CONFIG,
		useValue: {
			wheelSpeed: 0.5,
			minScrollbarLength: 10,
		},
	},
	{provide: MAT_CHIPS_DEFAULT_OPTIONS, useValue: {separatorKeyCodes: [ENTER, COMMA]}},
	{
		provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
		useValue: {
			hideRequiredMarker: true,
		},
	},
	{provide: HIGHCHARTS_MODULES, useFactory: highchartsModules},
	{
		provide: MAT_PAGINATOR_DEFAULT_OPTIONS,
		useValue: {
			formFieldAppearance: 'fill',
		},
	},
];

export const TOKEN_PROVIDERS = (config: any, environment: any) => [
	{
		provide: MfSettingsInjectionToken,
		useValue: {
			...config.mfConfig,
			project: config.settings.app_name,
			environment,
		},
	},
	{
		provide: PLATFORM_ROUTES,
		useValue: config.assocMfRoutes,
	},
];

export const SERVICES = [
	CookieService,
];
