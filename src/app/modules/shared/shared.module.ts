import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './loader/loader.component';
import { AlphabetOnlyDirective } from './directives/alphabet-only.directive';
import { NumberOnlyDirective } from './directives/number-only.directive';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatRippleModule} from '@angular/material/core';
import { NguCarouselModule } from '@ngu/carousel';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {IvyCarouselModule} from 'angular-responsive-carousel';
  import { NgxPrintModule } from 'ngx-print';
@NgModule({
  declarations: [
   LoaderComponent,
   AlphabetOnlyDirective,
   NumberOnlyDirective,
  ],
  imports: [
    NgxPrintModule,
    IvyCarouselModule,
    NguCarouselModule,
    MatRippleModule,
    MomentDateModule,
    CarouselModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatButtonModule,
    FontAwesomeModule,
    MatSelectModule,
    MatDialogModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatMenuModule,
    MatExpansionModule,
    ReactiveFormsModule,
    NgxSliderModule,
    MatCheckboxModule,
    MatListModule,
    MatExpansionModule,
    MatTabsModule,
    MatTooltipModule,
    MatButtonToggleModule,
    MatTabsModule,
    NgxMatSelectSearchModule,
    BsDropdownModule.forRoot(),
    NgxIntlTelInputModule,
    NgxDaterangepickerMd.forRoot(),
    NgbModule,
  ],exports: [
    NgxPrintModule,
    IvyCarouselModule,
    NguCarouselModule,
    CarouselModule,
    ReactiveFormsModule,
    FormsModule, 
    NgSelectModule,
    MomentDateModule,
    MatFormFieldModule,
    MatIconModule,      
    MatInputModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatButtonModule,
    FontAwesomeModule,
    MatSelectModule,
    MatDialogModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatMenuModule,
    MatExpansionModule,
    ReactiveFormsModule,
    NgxSliderModule,
    MatCheckboxModule,
    MatListModule,
    MatExpansionModule,
    MatTabsModule,
    MatTooltipModule,
    MatButtonToggleModule,
    LoaderComponent,
    MatTabsModule,
    AlphabetOnlyDirective,
    NumberOnlyDirective,
    NgxMatSelectSearchModule,
    BsDropdownModule,
    NgxIntlTelInputModule,
    MatRippleModule,
    NgxDaterangepickerMd,
    NgbModule,
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}],
})
export class SharedModule { }
