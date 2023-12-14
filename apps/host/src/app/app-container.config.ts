import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter, Routes, withComponentInputBinding, withHashLocation} from '@angular/router';
import {
	HttpClient as NgHttpClient,
	HttpClientModule,
	provideHttpClient,
	withInterceptorsFromDi,
} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRootEffects, provideRootStore, provideRouterStore, provideStoreDevtools} from './standalone-ngrx';
import {NavigationActionTiming, routerReducer} from '@ngrx/router-store';
import {ChartModule} from 'angular-highcharts';
import {MissingTranslationHandler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {
	APP_INITIALIZERS,
	MODULE_PROVIDERS,
	SERVICES,
	TOKEN_PROVIDERS,
	TranslateHttpLoaderFactory,
} from './app-container.initializers';
import {MissingTranslationHandlerThatReturnsNull} from './missing-translation-handler';
import {SharedModule} from './modules/shared.module';
import {CustomSerializer} from './entities/custom-serializer.entity';

const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./app-container.routes'),
	},
];

export const appContainerConfig = (environment: any, config: any): ApplicationConfig => {
	return {
		providers: [
			provideRouter(routes, withHashLocation(), withComponentInputBinding()),
			provideHttpClient(withInterceptorsFromDi()),
			provideAnimations(),
			provideRootStore(
				{router: routerReducer},
				{
					runtimeChecks: {
						strictStateImmutability: false,
						strictStateSerializability: false,
						strictActionImmutability: true,
						strictActionSerializability: false,
						strictActionWithinNgZone: false,
						strictActionTypeUniqueness: true,
					},
				}
			),
			provideRootEffects(),
			provideRouterStore({
				serializer: CustomSerializer,
				navigationActionTiming: NavigationActionTiming.PostActivation,
			}),
			environment.envName !== 'prod'
				? provideStoreDevtools({
						maxAge: 100,
				  })
				: [],
			importProvidersFrom(ChartModule),
			importProvidersFrom(HttpClientModule),
			importProvidersFrom(
				TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: TranslateHttpLoaderFactory,
						deps: [NgHttpClient],
					},
					missingTranslationHandler: {
						provide: MissingTranslationHandler,
						useClass: MissingTranslationHandlerThatReturnsNull,
					},
				})
			),
			importProvidersFrom(SharedModule.forRoot()),
			...SERVICES,
			...TOKEN_PROVIDERS(config, environment),
			...APP_INITIALIZERS,
			...MODULE_PROVIDERS,
		],
	};
};
