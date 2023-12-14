import {Routes} from '@angular/router';
import {RouteHelper} from './route.helper';

export const getRootRoutes = (dynamicRoutesWithConfig: any): Routes => {
	const dynamicRoutes = RouteHelper.getCreatedPageRoutesByConfig(dynamicRoutesWithConfig);

	return [
		...dynamicRoutes,
		{
			path: 'tve',
			component: null,
		},
		{
			path: '**',
			redirectTo: 'overview',
			pathMatch: 'full',
		},
	] as Routes;
};
