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
  title: any = '';
  checked2: boolean = true;
  collapsed: boolean[] = [];

  color = 'primary';
  checked = false;
  disabled = false;

  constructor(private _swal: SwalService) { }

  ngOnInit(): void {
    console.log(this.navItems)
    this.orderArray(this.navItems)
  }

  orderArray(array) {
    array.sort(function (a, b): any {
      return a.child.length - b.child.length
    })
    array.forEach(element => {
      if (element.child.length > 0) {
        console.log(element.child)
        this.orderArray(element.child)
      }
    });
  }

  setValues(item: any, position) {
    item['permissions'][position] != item['permissions'][position];
  }

  changeAll(item) {
    item.child.forEach(el => {
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

  changeAllChild(item) {
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
