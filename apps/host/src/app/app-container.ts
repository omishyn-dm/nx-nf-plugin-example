import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	inject,
	Input,
	OnChanges,
	Type,
	ViewContainerRef,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationEnd, Router, Scroll} from '@angular/router';
import {BehaviorSubject, combineLatest, tap} from 'rxjs';
import {filter} from 'rxjs/operators';
import {BootstrapAppContainerLoaderHelper} from './helpers/bootstrap-app-container-loader.helper';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
	selector: 'template-wrapper-component',
	template: '',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateWrapperComponent implements OnChanges {
	private readonly viewContainerRef = inject(ViewContainerRef);

	@Input() componentRef!: Type<Component> | null;

	ngOnChanges(): void {
		if (this.componentRef) {
			this.viewContainerRef.clear();

			const cr = this.viewContainerRef.createComponent(this.componentRef);
			cr.changeDetectorRef.detectChanges();
		}
	}
}

@Component({
	selector: 'app-root',
	template: `
		<template-wrapper-component [componentRef]='componentRef$ | async' />
	`,
	standalone: true,
	imports: [CommonModule, TemplateWrapperComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppContainer {
	private readonly destroyRef = inject(DestroyRef);
	private readonly router = inject(Router);

	private isPSVODVisited = false;

	// @ts-ignore
  public componentRef$ = new BehaviorSubject<Type<Component>>(null);

	constructor() {
		combineLatest([
			this.router.events,
			BootstrapAppContainerLoaderHelper.getBehaviorSubject('host'),
		])
			.pipe(
				filter(([event]) => event instanceof NavigationEnd || event instanceof Scroll),
				tap(([event, isBootstrapLoaded]) => {
					if (isBootstrapLoaded && !this.isPSVODVisited) {
						this.isPSVODVisited = true;

						this.componentRef$.next(
							BootstrapAppContainerLoaderHelper.BOOTSTRAP_CONTAINER_ASSOC['host']
						);
					}
				}),
				takeUntilDestroyed(this.destroyRef)
			)
			.subscribe();
	}
}
