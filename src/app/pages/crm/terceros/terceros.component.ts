import { Component, OnInit, ViewChild } from '@angular/core';
import { TercerosService } from './terceros.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { MatAccordion } from '@angular/material/expansion';
import { Location } from '@angular/common';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { UserService } from 'src/app/core/services/user.service';
import { debounceTime, filter, pairwise } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';


@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss']
})
export class TercerosComponent implements OnInit {
  @ViewChild('firstAccordion') firstAccordion: MatAccordion;
  selectedCampos = [];
  camposForm = new FormControl(this.selectedCampos);
  orderObj: any
  filtrosActivos: boolean = false
  estado: any
  campos: any[] = []
  matPanel: boolean;
  panelOpenState = false;
  form_filters: FormGroup;
  parametro: string = '';
  loading: boolean = false;
  thirdParties: any[] = [];
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  permission: Permissions = {
    menu: 'Terceros',
    permissions: {
      show: true,
      add: true
    }
  };
  listaCampos: any[] = [
    { value: 0, text: 'Foto', selected: true },
    { value: 2, text: 'Nombre', selected: true },
    { value: 1, text: 'Documento', selected: true },
    { value: 3, text: 'Dirección', selected: true },
    { value: 4, text: 'Municipio', selected: true },
    { value: 5, text: 'Teléfono', selected: true },
    { value: 6, text: 'Tipo', selected: true },
    { value: 8, text: 'Correo electrónico', selected: false },
    { value: 7, text: 'Estado', selected: true },

  ]

  constructor(
    private _tercerosService: TercerosService,
    private fb: FormBuilder,
    private location: Location,
    public router: Router,
    private route: ActivatedRoute,
    private paginator: MatPaginatorIntl,
    private _swal: SwalService,
    private _permission: PermissionService,
    private _user: UserService,
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
    this.permission = this._permission.validatePermissions(this.permission)
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();
      for (let i in this.listaCampos) {
        if (this.listaCampos[i].selected) {
          this.selectedCampos.push(this.listaCampos[i].value)
        }
      }
      this.route.queryParamMap
        .subscribe((params) => {
          this.orderObj = { ...params.keys, ...params }
          if (Object.keys(this.orderObj).length > 2) {
            this.filtrosActivos = true
            const formValues = {};
            for (const param in params) {
              formValues[param] = params[param];
            }
            this.form_filters.patchValue(formValues['params']);
          }
          if (this.orderObj.params.pag) {
            this.getThirdParties(this.orderObj.params.pag);
          } else {
            this.getThirdParties()
          }
        }
        );
    } else {
      this.router.navigate(['/notauthorized'])
    }
  }

  createFormFilters() {
    this.form_filters = this.fb.group({
      nit: '',
      name: '',
      third_party_type: '',
      email: '',
      cod_dian_address: '',
      municipio: '',
      phone: ''
    })
    this.form_filters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getThirdParties();
    })
  }

  cambiarCampo(event) {
    let position = event.source._keyManager._activeItemIndex
    this.listaCampos[position].selected ? this.listaCampos[position].selected = false : this.listaCampos[position].selected = true
  }

  SetFiltros(paginacion) {
    let params = new HttpParams;
    params = params.set('pag', paginacion)
    for (const controlName in this.form_filters.controls) {
      const control = this.form_filters.get(controlName);
      if (control.value) {
        params = params.set(controlName, control.value);
      }
    }
    return params;
  }
  openClose() {
    this.matPanel = !this.matPanel;
    this.matPanel ? this.firstAccordion.openAll() : this.firstAccordion.closeAll();
  }

  resetFiltros() {
    for (const controlName in this.form_filters.controls) {
      this.form_filters.get(controlName).setValue('');
    }
    this.filtrosActivos = false
  }

  paginacion: any
  handlePageEvent(event: PageEvent) {
    this.getThirdParties(event.pageIndex + 1)
  }

  getThirdParties(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.form_filters.value
    }
    this.loading = true;
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/crm/terceros', paramsurl.toString());
    this._tercerosService.getThirdParties(params).subscribe((r: any) => {
      this.thirdParties = r.data.data;
      this.paginacion = r.data
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    });
  }

  changeState(third, state) {
    let data = {
      id: third.id,
      state
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estas Seguro?',
      text: (data.state == 'Inactivo' ? '¡El Tercero se Anulará!' : '¡El Tercero se Activará!')
    }).then((r) => {
      if (r.isConfirmed) {
        this._tercerosService.changeState(data).subscribe((r: any) => {
          this.getThirdParties();
          this._swal.show({
            icon: 'success',
            title: 'Proceso Satisfactio',
            text: (data.state == 'Inactivo' ? 'El tercero ha sido Anulado.' : 'El tercero ha sido Activado.'),
            showCancel: false
          });
        });
      }
    });
  }



}
