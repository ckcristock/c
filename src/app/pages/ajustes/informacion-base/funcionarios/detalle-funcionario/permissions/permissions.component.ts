import { Component, OnInit } from '@angular/core';
import { PermissionService } from '../../../../../../core/services/permission.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
interface NavItem {
  name: string;
  link: boolean;
  id: string;
  child: NavItem[];
}
@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  person_id: string
  temporalMenues: Array<NavItem> = [];
  menues: Array<NavItem> = [];
  loading = false;
  saving = false;
  constructor( private _permissions: PermissionService, private route: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.person_id = this.route.snapshot.params.id;
    this.getMenues();
  }


  getMenues() {
    this.loading = true
    this._permissions.getPermissions({ person_id: this.person_id })
      .subscribe((r: any) => { this.menues = r; this.loading = false })
  }

  save() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success mx-2',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: 'Se actualizarán los permisos del usuario',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, ¡Confirmar!',
      cancelButtonText: 'No, déjeme comprobar'
    }).then(result => {
      if (result.value) {
        this.sendData();
      }
    });
  }

  sendData() {
    this.saving = true;
    let filteredMenu = this.filtertData(JSON.parse(JSON.stringify(this.menues)))
    filteredMenu = this.filterGrandpa(filteredMenu);

    this._permissions.save({ filteredMenu, person_id: this.person_id }).subscribe((r: any) => {
      if (r.code == 200) {
        Swal.fire({
          title: 'Actualización exitosa',
          text: 'Felicidades, los permisos del usuario se han actualizado',
          icon: 'success',
       
        })
      }
      this.saving = false;
    })
  }

  public indexMenu = (acc, els) => {
    if (els.child.length > 0) {
      els.child.reduce(this.indexMenu, els.child, {})
    }
    if (els.permissions) {
      els.permissions = els.permissions.reduce(this.indexPermissons, {})
    }
    return ({ ...acc, [els.name]: els })
  }

  public indexPermissons = (acc, el) => ({ ...acc, [el.name]: el });


  public filtertData(menu: any, parent: any = {}, x = -1) {
    for (let element of menu) {
      x++;
      if (element.child) { this.filtertData(element.child, element) }
      try {
        //Buscamos padres sin hijos 
        if (element.child.length == 0 && !element.link && element.parent_id) {
          /*   console.log('padre', element, parent, x); */
          let pos = parent.child.findIndex(f => f.id == element.id)
          throw (pos);
        }

        if (element.link) {
          //eliminamos hijos sin permiso show
          element.permissions.forEach(ele => {
            if (ele.name == 'show' && !ele.Activo) {
              throw (x);
            }
          });
        }
      } catch (posDel) {
        /*   console.log(element, parent, posDel); */
        parent.child.splice(posDel, 1)
        this.filtertData(menu, parent)
      }
    };
    return menu
  }

  filterGrandpa(menu: Array<NavItem>) {
    return menu.filter(d => (d.child.length > 0 || d.name == 'Tablero'));
  }

}
