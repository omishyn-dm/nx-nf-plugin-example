import {loadRemoteModule} from '@angular-architects/native-federation';
import {Routes} from '@angular/router';

const currentEnv = {
  production: true,
  envName: 'dev',
};

export class RouteHelper {
	private static ASSOC_LOADED_REMOTE_MODULES: Record<string, any> = {};

	public static getRootModuleNames(config: any): string[] {
		const currentProjectData = RouteHelper.getCurrentProjectData(config);

		return [...Object.keys(currentProjectData.preloadModules), ...(currentProjectData.preloadTabs || [])];
	}

	public static getRootTab(config: any, moduleName: string): any {
		const [pageName, tabName] = moduleName.split('/');

		return RouteHelper.getPageConfigData(config, pageName)?.['children'][tabName];
	}

	public static getAutoEnvName(config: any): string {
		return RouteHelper.getCurrentProjectData(config).autoEnvName || 'dev';
	}

	public static getEnvUrl(config: any, envUrlKey: string, envName: string): string {
		return RouteHelper.getCurrentProjectData(config).envUrl[envUrlKey || 'default'][envName];
	}

	public static getTemplateUrl(config: any, envName: string): string {
		return RouteHelper.getCurrentProjectData(config).templateUrl[envName];
	}

	public static prepareTemplateUrl(
		templateUrl: string,
		url: string,
		port: string,
		reference: string,
		project: string,
		version: string,
		native: boolean
	): string {
		const newTemplateUrl = templateUrl
			.replace('$url', url)
			.replace('$port', port)
			.replace('$reference', reference)
			.replace('$project', project)
			.replace('$version', version);

		if (!native) {
			return newTemplateUrl;
		}

		return newTemplateUrl.replace('remoteEntry.js', 'remoteEntry.json');
	}

	public static getLoadRemoteModuleOptionsTab(
		config: any,
		moduleName: string
	): any {
		const [pageName, tabName] = moduleName.split('/');
		const pageChildrenData = RouteHelper.getPageChildrenData(config, pageName);
		const tabData = pageChildrenData[tabName];

		return RouteHelper.createRemoteModuleOptions(config, tabData);
	}

	public static createRemoteModuleOptions(
		config: any,
		moduleData: Record<string, any>
	): any {
		const envName = moduleData.env === 'auto' ? RouteHelper.getAutoEnvName(config) : moduleData.env;
		const templateUrl = RouteHelper.getTemplateUrl(config, envName);
		const url = RouteHelper.getEnvUrl(config, moduleData?.envUrlKey, envName);
		const remoteEntry = RouteHelper.prepareTemplateUrl(
			templateUrl,
			url,
			moduleData?.port,
			moduleData?.reference,
			// @ts-ignore
			moduleData?.project || config?.projectName,
			moduleData?.versions.default,
			moduleData?.native
		);

		return {
			remoteEntry,
			exposedModule: `./${moduleData.exposedModule}`,
			moduleName: `${moduleData.reference}/${moduleData.exposedModule}`,
			type: 'module',
			native: moduleData?.native,
			reference: moduleData.reference,
		};
	}

	public static getLoadRemoteModuleOptions(
		config: any,
		moduleName: string
	): any {
		if (moduleName.includes('/')) {
			return RouteHelper.getLoadRemoteModuleOptionsTab(config, moduleName);
		}

		const moduleData = RouteHelper.getModuleConfigData(config, moduleName);

		return RouteHelper.createRemoteModuleOptions(config, moduleData);
	}

	public static getDynamicRoutesWithConfig(
		config: any,
		assocMfProvidersData: Record<string, any>
	): any {
		return {
			config: config as unknown,
			// @ts-ignore
			project: config[LoadMfModuleEsmOptionField.Project] as string,
			assocMfRoutes: RouteHelper.getDynamicRoutes(config, assocMfProvidersData),
		};
	}

	public static getDynamicRoutes(
		config: any,
		assocMfProvidersData: Record<string, any>
	): any {
		// @ts-ignore
		return RouteHelper.getProjectPageNames(config).reduce((acc, pageName) => {
			const childrenProjectPageData = RouteHelper.getPageChildrenData(config, pageName);

			if (!acc[pageName]) {
				acc[pageName] = {};
			}

			if (!acc[pageName]?.['children']) {
				acc[pageName]['children'] = [];
			}

			if (childrenProjectPageData) {
				Object.keys(childrenProjectPageData).forEach((moduleName) => {
					acc[pageName]['children'].push({
						path: childrenProjectPageData[moduleName]['path'] || moduleName,
						data: {preload: childrenProjectPageData[moduleName].data?.preload},
						loadChildren: () => {
							const options = RouteHelper.getLoadRemoteModuleOptions(config, `${pageName}/${moduleName}`);

							if (RouteHelper.ASSOC_LOADED_REMOTE_MODULES[options.moduleName]) {
								return RouteHelper.ASSOC_LOADED_REMOTE_MODULES[options.moduleName];
							}

							return loadRemoteModule({
								remoteEntry: options.remoteEntry,
								exposedModule: options.exposedModule,
								remoteName: options.reference,
							})
								.then((m) => {
									if (m?.default) {
										RouteHelper.ASSOC_LOADED_REMOTE_MODULES[options.moduleName] = m.default;

										if (RouteHelper.ASSOC_LOADED_REMOTE_MODULES[options.moduleName][0]) {
											RouteHelper.ASSOC_LOADED_REMOTE_MODULES[options.moduleName][0].data = {
												environment: currentEnv,
												configData: {
													...assocMfProvidersData.all,
													...assocMfProvidersData[moduleName],
												},
											};
										}
									} else if (m?.[options.moduleName]?.forRoot) {
										RouteHelper.ASSOC_LOADED_REMOTE_MODULES[options.moduleName] = m[
											options.moduleName
										].forRoot(
											{
												environment: currentEnv,
												data: {
													...assocMfProvidersData.all,
													...assocMfProvidersData[moduleName],
												},
											},
											assocMfProvidersData[moduleName] || []
										).ngModule;
									} else {
										RouteHelper.ASSOC_LOADED_REMOTE_MODULES[options.moduleName] =
											m[options.moduleName];
									}

									return RouteHelper.ASSOC_LOADED_REMOTE_MODULES[options.moduleName];
								})
								.catch((error) => {
									console.error('getDynamicRoutes ERROR', error);
								});
						},
					});
				});
			}

			return acc;
		}, {});
	}

	public static getCurrentProjectData(config: any): Record<string, any> {
		// @ts-ignore
		const project = config?.[LoadMfModuleEsmOptionField.Project];
		// @ts-ignore
		return config?.[project] || {};
	}

	public static getProjectDataByName(
		projectName: string,
		config: any
	): Record<string, any> {
		return config?.[projectName];
	}

	public static getPageChildrenData(
		config: any,
		pageName: string
	): Record<string, any> {
		return RouteHelper.getPageConfigData(config, pageName)?.['children'] || {};
	}

	public static getProjectPageNames(config: any): Record<string, any> {
		return Object.keys(RouteHelper.getCurrentProjectData(config)?.['rootPages'] || {});
	}

	public static getPageConfigData(
		config: any,
		pageName: string
	): Record<string, any> {
		return RouteHelper.getCurrentProjectData(config)?.['rootPages']?.[pageName] || {};
	}

	public static getModuleConfigData(
		config: any,
		moduleName: string
	): Record<string, any> {
		return (
			RouteHelper.getCurrentProjectData(config)?.['preloadModules']?.[moduleName] || {}
		);
	}

	public static getCreatedPageRoutesByConfig(dynamicRoutesWithConfig: any): Routes {
		// @ts-ignore
		return dynamicRoutesWithConfig.config?.[dynamicRoutesWithConfig.project]?.['mfPages']?.reduce((acc, pageName) => {
			const config = dynamicRoutesWithConfig.config;
			const pageConfig = RouteHelper.getPageConfigData(config, pageName);
			const path = pageConfig.path;
			const redirectTo = pageConfig.redirectTo;
			const assocMfRoutes = dynamicRoutesWithConfig.assocMfRoutes;
			const childrenRoutes = assocMfRoutes?.[path]?.['children'] || [];
			if (!childrenRoutes?.length) {
				console.warn('no children routes', {config, pageConfig, pageName, assocMfRoutes, path, redirectTo});
			}

			acc.push({
				path,
				children: [
					{
						path: '',
						redirectTo,
						pathMatch: 'full',
					},
					...childrenRoutes,
				] as Routes,
			});

			return acc;
		}, []);
	}
}
