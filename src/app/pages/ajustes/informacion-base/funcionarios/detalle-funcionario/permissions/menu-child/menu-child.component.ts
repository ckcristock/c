import { Component, OnInit, Input } from '@angular/core';
interface NavItem {
  name: string;
  link: boolean;
  child: NavItem[];
}
@Component({
  selector: 'app-menu-child',
  templateUrl: './menu-child.component.html',
  styleUrls: ['./menu-child.component.scss']
})

export class MenuChildComponent implements OnInit {
  /*   @Input('menuItems') menuItems:any; */
  @Input() navItems: NavItem[];
  
  constructor() { }

  ngOnInit(): void {
  }

  setValues(item: any, position) {
    item['permissions'][position] != item['permissions'][position];
  }
/*   
  save() {
    let navFilter = [...this.navItems]
    console.log(this.filtertData(navFilter))

  }
 */
}
