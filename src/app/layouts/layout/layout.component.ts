import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { LAYOUT_HORIZONTAL, LAYOUT_VERTICAL } from './layouts.model';
import { EventService } from '../../core/services/event.service';
import { UserService } from 'src/app/core/services/user.service';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    /* document.body.setAttribute('data-topbar', 'dark'); */
    document.body.setAttribute('data-layout', 'horizontal');
    document.body.removeAttribute('data-sidebar');
    document.body.setAttribute('data-topbar', 'light');
    /* document.body.removeAttribute('data-layout-size'); */

  }
  
  AfterViewInit(){
    
   
  }

}