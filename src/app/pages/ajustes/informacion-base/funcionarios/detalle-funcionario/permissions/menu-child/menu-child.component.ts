import { Component, OnInit, Input } from '@angular/core';
import { SwalService } from '../../../../services/swal.service';
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
  title:any = '';
  checked: boolean = true;
  collapsed:boolean[] = [];
  constructor( private _swal:SwalService ) { }

  ngOnInit(): void {
  }

  setValues(item: any, position) {
    item['permissions'][position] != item['permissions'][position];
  }

  changeAll(item){
    item.child.forEach( el => {
      el.permissions?.forEach(permission => {
        permission.Activo = !permission.Activo  
      });
      el.child?.forEach(child => {
        child.permissions?.forEach(childPermission => {
          childPermission.Activo = !childPermission.Activo
        });
      });
    });
  }

  changeAllChild(item){
    item.child.forEach(child => {
      child.permissions.forEach(el => {
        el.Activo = !el.Activo;
      });
    });
  }

/*   
  save() {
    let navFilter = [...this.navItems]

  }
 */
}
