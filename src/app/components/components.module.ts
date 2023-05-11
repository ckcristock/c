import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UiModule } from '../shared/ui/ui.module';
import { NgbAccordionModule, NgbAlertModule, NgbDropdownModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalBasicComponent } from './modal-basic/modal-basic.component';
import { BuildingComponent } from './building/building.component';
import { RestorePasswordComponent } from './restore-password/restore-password.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { StatsComponent } from './stats/stats.component';
import { TimeLineComponent } from './time-line/time-line.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PipesModule } from '../core/pipes/pipes.module';
import { NotDataComponent } from './not-data/not-data.component';
import { ApplicantComponent } from './applicant/applicant.component';
import { GetApusComponent } from './get-apus/get-apus.component';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatNativeDateModule, MatPaginatorModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { NoPermissionsComponent } from './no-permissions/no-permissions.component';
import { PlaceholderFormComponent } from './placeholder-form/placeholder-form.component';
import { ReloadButtonComponent } from './reload-button/reload-button.component';
import { ModalPreliquidarComponent } from './modal-preliquidar/modal-preliquidar.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ListItemsComponent } from './list-items/list-items.component';
import { GetBudgetsComponent } from './get-budgets/get-budgets.component';
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@NgModule({
  declarations: [
    ModalBasicComponent,
    BuildingComponent,
    RestorePasswordComponent,
    StatsComponent,
    TimeLineComponent,
    NotDataComponent,
    ApplicantComponent,
    GetApusComponent,
    CabeceraComponent,
    NoPermissionsComponent,
    PlaceholderFormComponent,
    ReloadButtonComponent,
    ModalPreliquidarComponent,
    ListItemsComponent,
    GetBudgetsComponent
  ],
  exports: [
    ModalBasicComponent,
    BuildingComponent,
    RestorePasswordComponent,
    StatsComponent,
    TimeLineComponent,
    NotDataComponent,
    ApplicantComponent,
    GetApusComponent,
    CabeceraComponent,
    PipesModule,
    NoPermissionsComponent,
    PlaceholderFormComponent,
    ReloadButtonComponent,
    ModalPreliquidarComponent,
    ListItemsComponent,
    GetBudgetsComponent
  ],
  imports: [
    NgbAccordionModule,
    FormsModule,
    CommonModule,
    NgSelectModule,
    PerfectScrollbarModule,
    PipesModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    NgbDropdownModule,
    NgbPaginationModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatRadioModule,
    MatPaginatorModule
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ComponentsModule { }
