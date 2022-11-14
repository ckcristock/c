import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from './footer/footer.component';
import { RightsidebarComponent } from './rightsidebar/rightsidebar.component';
import { HorizontaltopbarComponent } from './horizontaltopbar/horizontaltopbar.component';
import { HorizontalnavbarComponent } from './horizontalnavbar/horizontalnavbar.component';
import { NavItemsDynamicComponent } from './horizontalnavbar/nav-items-dynamic/nav-items-dynamic.component';
import { PipesModule } from '../../core/pipes/pipes.module';
import { ModalAlertComponent } from './horizontaltopbar/modal-alert/modal-alert.component';
import { ComponentsModule } from '../../components/components.module';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { PagesModule } from 'src/app/pages/pages.module';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [FooterComponent, RightsidebarComponent, HorizontaltopbarComponent, HorizontalnavbarComponent, NavItemsDynamicComponent, ModalAlertComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PerfectScrollbarModule,
    NgbDropdownModule,
    ClickOutsideModule,
    RouterModule,
    PipesModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgSelectModule,
    PagesModule
  ],
  exports: [ FooterComponent,  RightsidebarComponent, HorizontaltopbarComponent, HorizontalnavbarComponent],
  providers: []
})
export class SharedModule { }
