import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { SwalService } from '../../../../services/swal.service';
interface NavItem {
  checked: boolean;
  name: string;
  link: boolean;
  child: NavItem[];
  permissions: any;
}
@Component({
  selector: 'app-menu-child',
  templateUrl: './menu-child.component.html',
  styleUrls: ['./menu-child.component.scss']
})

export class MenuChildComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
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
    this.isChecked(this.navItems);
  }

  isChecked(array) {
    array.forEach(element1 => {
      element1.checked = true;
      element1.child.forEach(element2 => {
        if (element2.permissions) {
          element2.permissions.forEach(permission => {
            if (!permission.Activo) {
              element1.checked = false;
            }
          });
        } else if (!element2.permission && element2.child.length > 0) {
          element2.checked = true;
          element2.child.forEach(element3 => {
            if (element3.permissions) {
              element3.permissions.forEach(permission => {
                if (!permission.Activo) {
                  element2.checked = false;
                  element1.checked = false;
                }
              });
            } else if (!element3.permission && element3.child.length > 0) {
              element3.checked = true
              element3.child.forEach(element4 => {
                if (element4.permissions) {
                  element4.permissions.forEach(permission => {
                    if (!permission.Activo) {
                      element3.checked = false;
                      element2.checked = false;
                      element1.checked = false;
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  }

  changeAll(item, event) {
    item.child.forEach(el => {
      el.permissions?.forEach(permission => {
        if (event.checked) {
          permission.Activo = true
        } else {
          permission.Activo = false
        }
      });
      el.child?.forEach(child => {
        child.permissions?.forEach(childPermission => {
          if (event.checked) {
            childPermission.Activo = true
          } else {
            childPermission.Activo = false
          }
        });
        child.child?.forEach(subchild => {
          subchild.permissions?.forEach(childPermission => {
            if (event.checked) {
              childPermission.Activo = true
            } else {
              childPermission.Activo = false
            }
          });
        });
      });
    });
    this.isChecked(this.navItems)
  }

  activateAll(permissions) {
    let state: boolean = true
    permissions.forEach(element => {
      if (!element.Activo) {
        element.Activo = true
        state = false
      }
    });
    if (state) {
      permissions.forEach(element => {
        element.Activo = false
      });
    }
    this.isChecked(this.navItems)
  }

  /* orderArray(array) {
    array.sort(function (a, b): any {
      return a.child.length - b.child.length
    })
    array.forEach(element => {
      if (element.child.length > 0) {
        this.orderArray(element.child)
      }
    });
  } */
}
