import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-items-dynamic',
  templateUrl: './nav-items-dynamic.component.html',
  styleUrls: ['./nav-items-dynamic.component.scss']
})
export class NavItemsDynamicComponent implements OnInit {
  @Input('navItems') navItems : any;
  @Input('first') first : any;

  constructor() { }

  ngOnInit(): void {
  }

}
