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

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [FooterComponent, RightsidebarComponent, HorizontaltopbarComponent, HorizontalnavbarComponent, NavItemsDynamicComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PerfectScrollbarModule,
    NgbDropdownModule,
    ClickOutsideModule,
    RouterModule
  ],
  exports: [ FooterComponent,  RightsidebarComponent, HorizontaltopbarComponent, HorizontalnavbarComponent],
  providers: []
})
export class SharedModule { }
