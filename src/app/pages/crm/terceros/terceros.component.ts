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
import { PaginatorService } from 'src/app/core/services/paginator.service';


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
  paginationMaterial: any;
  pagination: any = {
    page: '',
    pageSize: '',
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
    { value: 4, text: 'Ciudad', selected: true },
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
    private _paginator: PaginatorService
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
      this.route.queryParamMap.subscribe((params: any) => {
        if (params.params.pageSize) {
          this.pagination.pageSize = params.params.pageSize
        } else {
          this.pagination.pageSize = 100
        }
        if (params.params.pag) {
          this.pagination.page = params.params.pag
        } else {
          this.pagination.page = 1
        }
        this.orderObj = { ...params.keys, ...params }
        if (Object.keys(this.orderObj).length > 3) {
          this.filtrosActivos = true
          const formValues = {};
          for (const param in params) {
            formValues[param] = params[param];
          }
          this.form_filters.patchValue(formValues['params']);
        }
        this.getThirdParties()
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
  openClose() {
    this.matPanel = !this.matPanel;
    this.matPanel ? this.firstAccordion.openAll() : this.firstAccordion.closeAll();
  }

  SetFiltros(paginacion) {
    return this._paginator.SetFiltros(paginacion, this.pagination, this.form_filters)
  }

  resetFiltros() {
    this._paginator.resetFiltros(this.form_filters)
    this.filtrosActivos = false
  }

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination)
    this.getThirdParties()
  }

  getThirdParties() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.form_filters.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/crm/terceros', paramsurl.toString());
    this._tercerosService.getThirdParties(params).subscribe((r: any) => {
      this.loading = false;
      this.thirdParties = r.data.data;
      this.paginationMaterial = r.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getThirdParties()
      }
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
