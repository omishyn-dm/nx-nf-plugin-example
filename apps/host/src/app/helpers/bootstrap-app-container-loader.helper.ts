import {loadRemoteModule} from '@angular-architects/native-federation';
import {BehaviorSubject} from 'rxjs';
import {RouteHelper} from './route.helper';
import {Component, Type} from '@angular/core';

export type MfExtParams = any;
/**
 * Help load AppContainer with hook on loaded
 */
export class BootstrapAppContainerLoaderHelper {
	public static LOADED_BEHAVIOR_SUBJECT_ASSOC: Record<string, BehaviorSubject<boolean>> = {};
	public static BOOTSTRAP_CONTAINER_ASSOC: Record<
		string,
		{
      // @ts-ignore
      setEnvironment: ({environment}) => void;
		} & Type<Component>
	> = {};

	/**
	 * add hook on loaded and check before if it exists
	 * @param key
	 */
	public static addBehaviorSubject(key: string): void {
		if (BootstrapAppContainerLoaderHelper.LOADED_BEHAVIOR_SUBJECT_ASSOC[key]) {
			return;
		}

		BootstrapAppContainerLoaderHelper.LOADED_BEHAVIOR_SUBJECT_ASSOC[key] = new BehaviorSubject(false);
	}

	/**
	 * get and create it if not exists hook on loaded
	 * @param key
	 */
	public static getBehaviorSubject(key: string): BehaviorSubject<boolean> {
		if (!BootstrapAppContainerLoaderHelper.LOADED_BEHAVIOR_SUBJECT_ASSOC[key]) {
			BootstrapAppContainerLoaderHelper.addBehaviorSubject(key);
		}

		return BootstrapAppContainerLoaderHelper.LOADED_BEHAVIOR_SUBJECT_ASSOC[key];
	}

	/**
	 * Load AppContainer and set hook for loaded by key (key is name of project: psvod, tve, ...)
	 *
	 * @param key
	 * @param config
	 * @param environment
	 */
	public static loadBootstrapContainer(key: string, config: MfExtParams, environment: any): void {
		BootstrapAppContainerLoaderHelper.addBehaviorSubject(key);

		const currentProjectConfigurations =
			RouteHelper.getProjectDataByName(key, config as any) || RouteHelper.getCurrentProjectData(config as any);
		const options = RouteHelper.createRemoteModuleOptions(
			config as any,
			currentProjectConfigurations.bootstrapComponent
		);

		void loadRemoteModule({
			remoteEntry: options.remoteEntry,
			exposedModule: options.exposedModule,
			remoteName: options.reference,
		}).then((m) => {
			if (m?.default) {
				BootstrapAppContainerLoaderHelper.BOOTSTRAP_CONTAINER_ASSOC[key] = m.default[0].component;
			} else if (m?.StandaloneComponent) {
				BootstrapAppContainerLoaderHelper.BOOTSTRAP_CONTAINER_ASSOC[key] = m.StandaloneComponent;
			} else if (m?.AppContainer) {
				BootstrapAppContainerLoaderHelper.BOOTSTRAP_CONTAINER_ASSOC[key] = m.AppContainer;
			} else {
				BootstrapAppContainerLoaderHelper.BOOTSTRAP_CONTAINER_ASSOC[key] = m;
			}

			if (environment && typeof BootstrapAppContainerLoaderHelper.BOOTSTRAP_CONTAINER_ASSOC[key]?.setEnvironment === 'function') {
				BootstrapAppContainerLoaderHelper.BOOTSTRAP_CONTAINER_ASSOC[key].setEnvironment({environment});
			}

			BootstrapAppContainerLoaderHelper.LOADED_BEHAVIOR_SUBJECT_ASSOC[key].next(true);
		});
	}
}
