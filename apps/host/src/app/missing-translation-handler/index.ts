import {of} from 'rxjs';
import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';

/**
 * This class implements the `MissingTranslationHandler` interface and returns `null` when the missing translation is encountered.
 */
export class MissingTranslationHandlerThatReturnsNull implements MissingTranslationHandler {
	/**
	 * Handles the missing translation by returning `null`.
	 * @param params - The parameters of the missing translation handler.
	 */
	public handle(params: MissingTranslationHandlerParams) {
		return of(null);
	}
}
