import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  NavigationStart,
} from '@angular/router';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../../core/services/user.service';
import { User } from 'src/app/core/models/users.model';
import { interval, timer, Subscription } from 'rxjs';
import { AlertasComunService } from 'src/app/pages/rrhh/alertas-comun/alertas-comun.service';

@Component({
  selector: 'app-horizontaltopbar',
  templateUrl: './horizontaltopbar.component.html',
  styleUrls: ['./horizontaltopbar.component.scss'],
})
export class HorizontaltopbarComponent implements OnInit {
  alerts$: Subscription;
  configData: any;
  alerts: any[] = [];
  element: any;
  cookieValue;
  flagvalue;
  countryName;
  loading: boolean
  valueset: string;
  imageProfile: any;

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.jpg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.jpg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.jpg', lang: 'de' },
    { text: 'Italian', flag: 'assets/images/flags/italy.jpg', lang: 'it' },
    { text: 'Russian', flag: 'assets/images/flags/russia.jpg', lang: 'ru' },
  ];

  public user: User;
  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    private _user: UserService,
    public cookiesService: CookieService,
    public http: HttpClient,
    private _alert: AlertasComunService,
  ) { }

  ngOnInit(): void {
    console.log(this._user)
    this.element = document.documentElement;
    this.user = this._user.user;
    this.http.get(this.user.imagenUrl).subscribe(result => {
      //console.log(result)
    },
      error => {
        //console.log(error)
        if (error.status == 500) {
          this.imageProfile = null
        } else {
          this.imageProfile = this.user.imagenUrl
        }
      });
    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3,
    };

    this.cookieValue = this.cookiesService.get('lang');
    const val = this.listLang.filter((x) => x.lang === this.cookieValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.valueset = 'assets/images/flags/us.jpg';
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        //notificaciones
      }
    });
    this.getAlerts();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement &&
      !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement
    ) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
  }

  /**
   * Togglemenu bar
   */
  toggleMenubar() {
    const element = document.getElementById('topnav-menu-content');
    element.classList.toggle('show');
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
  }

  /**
   * Logout the user
   */
  logout() {
    this._user.logout();
  }

  getAlerts() {
    this.loading = true;
    if (this.user.person.id) {
      let param = { person_id: this.user.person.id };

      this._alert.getAlerts(param).subscribe((r: any) => {
        this.alerts = r.data.data;
        this.loading = false
      });
      this.initSearch()
    } else {
      this.initSearch()
    }

  }

  initSearch() {
    this.loading = true;
    const source = interval(10000); //output: 0,1,2,3,4,5....
    this.alerts$ = source.subscribe((val) => {
      let param = { person_id: this.user.person.id };

      this._alert.getAlerts(param).subscribe((r: any) => {
        this.alerts = r.data.data;
        //console.log(r.data.data)
        this.loading = false
      });
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.alerts$.unsubscribe();
  }
}
