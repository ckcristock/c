import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthModule } from './auth/auth.module';
import { LayoutsModule } from './layouts/layouts.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AuthInterceptor } from './core/interceptor/auth.interceptor';

import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import { ArchwizardModule } from 'angular-archwizard';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

import localeEs from '@angular/common/locales/es';
import { DatePipe, registerLocaleData } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material';
import { getEspañolPaginatorIntl } from './core/utils/español-paginator-intl';
import { NgbModalModule, NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [AppComponent],
  imports: [
    ArchwizardModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    LayoutsModule,
    NgSelectModule,
    FormsModule,
    NgbModule,
    NgbModalModule,
    NgbToastModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-CO' },
    { provide: MatPaginatorIntl, useValue: getEspañolPaginatorIntl() },
    DatePipe
  ],
  bootstrap: [AppComponent],
  exports: [BrowserModule, BrowserAnimationsModule]
})
export class AppModule { }
