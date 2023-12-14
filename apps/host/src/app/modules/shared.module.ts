import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatOptionModule} from '@angular/material/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTreeModule} from '@angular/material/tree';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatPaginatorModule} from '@angular/material/paginator';
import {ChartModule} from 'angular-highcharts';
import {TableVirtualScrollModule} from 'ng-om-table-virtual-scroll';
import {NgxMaskModule} from 'ngx-mask';
import {A11yModule} from '@angular/cdk/a11y';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {BidiModule} from '@angular/cdk/bidi';
import {ObserversModule} from '@angular/cdk/observers';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {LayoutModule} from '@angular/cdk/layout';
import {CdkListboxModule} from '@angular/cdk/listbox';
import {CdkMenuModule} from '@angular/cdk/menu';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {TextFieldModule} from '@angular/cdk/text-field';
import {CdkTreeModule} from '@angular/cdk/tree';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */
const MAT_MODULES = [
	MatAutocompleteModule,
	MatBottomSheetModule,
	MatButtonModule,
	MatButtonToggleModule,
	MatCardModule,
	MatCheckboxModule,
	MatChipsModule,
	MatDatepickerModule,
	MatDialogModule,
	MatDividerModule,
	MatExpansionModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatNativeDateModule,
	MatOptionModule,
	MatPaginatorModule,
	MatProgressBarModule,
	MatProgressSpinnerModule,
	MatRadioModule,
	MatRippleModule,
	MatSelectModule,
	MatSidenavModule,
	MatSliderModule,
	MatSlideToggleModule,
	MatSnackBarModule,
	MatSortModule,
	MatStepperModule,
	MatTableModule,
	MatTabsModule,
	MatToolbarModule,
	MatTooltipModule,
	MatTreeModule,
];

const CDK_MODULES = [
	A11yModule,
	CdkAccordionModule,
	BidiModule,
	ClipboardModule,
	LayoutModule,
	CdkListboxModule,
	CdkMenuModule,
	ObserversModule,
	PlatformModule,
	PortalModule,
	ScrollingModule,
	CdkStepperModule,
	CdkTableModule,
	TextFieldModule,
	CdkTreeModule,
];

const SHARED_MODULES = [
	CommonModule,
	FormsModule,
	ReactiveFormsModule,
	ChartModule,
	TableVirtualScrollModule,
	NgxMaskModule,
];

@NgModule({
	imports: [...SHARED_MODULES, ...MAT_MODULES, ...CDK_MODULES],
	declarations: [],
	exports: [
		...MAT_MODULES,
		...CDK_MODULES,
		...SHARED_MODULES,
	],
})
export class SharedModule {
	public static forRoot(): ModuleWithProviders<SharedModule> {
		return {
			ngModule: SharedModule,
			providers: [],
		};
	}
}
