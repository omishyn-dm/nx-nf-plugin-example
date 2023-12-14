import {RouterStateSnapshot} from '@angular/router';
import {RouterStateSerializer} from '@ngrx/router-store';
import {flatten} from 'ramda';

export class CustomSerializer implements RouterStateSerializer<any> {
	public serialize(routerState: RouterStateSnapshot): any {
		let route = routerState.root;

		while (route.firstChild) {
			route = route.firstChild;
		}

		const {
			url,
			root: {queryParams},
		} = routerState;
		const {params} = route;

		const path: string[] = flatten(
			route.pathFromRoot
				.filter((r) => r.routeConfig && r.routeConfig.path)
				// @ts-ignore
				.map((r) => r.routeConfig.path.split('/'))
		);

		// Only return an object including the URL, params and query params
		// instead of the entire snapshot
		return {url, path, params, queryParams};
	}
}
