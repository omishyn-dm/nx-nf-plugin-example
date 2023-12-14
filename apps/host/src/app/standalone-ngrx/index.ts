import {EnvironmentProviders, importProvidersFrom, InjectionToken, Type} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreRouterConfig, StoreRouterConnectingModule} from '@ngrx/router-store';
import {
	Action,
	ActionReducer,
	ActionReducerMap,
	FeatureSlice,
	RootStoreConfig,
	StoreConfig,
	StoreModule,
} from '@ngrx/store';
import {StoreDevtoolsConfig, StoreDevtoolsModule} from '@ngrx/store-devtools';

// @ngrx/store
export function provideRootStore<T, V extends Action = Action>(
	reducers?: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,
	config?: RootStoreConfig<T, V>
): EnvironmentProviders {
	// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
	return importProvidersFrom(StoreModule.forRoot(reducers ?? ({} as ActionReducerMap<T, V>), config));
}

export function provideFeatureStore<T, V extends Action = Action>(
	featureName: string,
	reducers: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>,
	config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>
): EnvironmentProviders;
export function provideFeatureStore<T, V extends Action = Action>(
	featureName: string,
	reducer: ActionReducer<T, V> | InjectionToken<ActionReducer<T, V>>,
	config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>
): EnvironmentProviders;
export function provideFeatureStore<T, V extends Action = Action>(feature: FeatureSlice<T, V>): EnvironmentProviders;
export function provideFeatureStore<T, V extends Action = Action>(
	nameOrFeature: string | FeatureSlice<T, V>,
	reducers?:
		| ActionReducerMap<T, V>
		| ActionReducer<T, V>
		| InjectionToken<ActionReducer<T, V>>
		| InjectionToken<ActionReducerMap<T, V>>,
	config?: StoreConfig<T, V> | InjectionToken<StoreConfig<T, V>>
): EnvironmentProviders {
	return importProvidersFrom(StoreModule.forFeature(nameOrFeature as any, reducers as any, config));
}

// @ngrx/effects
export function provideRootEffects(rootEffects?: Type<any>[]): EnvironmentProviders {
	return importProvidersFrom(EffectsModule.forRoot(rootEffects ?? []));
}

export function provideFeatureEffects(featureEffects: Type<any>[]): EnvironmentProviders {
	return importProvidersFrom(EffectsModule.forFeature(featureEffects));
}

// @ngrx/router-store
export function provideRouterStore(config?: StoreRouterConfig): EnvironmentProviders {
	return importProvidersFrom(StoreRouterConnectingModule.forRoot(config));
}

// @ngrx/store-devtools
export function provideStoreDevtools(config?: StoreDevtoolsConfig): EnvironmentProviders {
	return importProvidersFrom(StoreDevtoolsModule.instrument(config));
}
