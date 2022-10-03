import { Component, OnInit, ViewChild } from '@angular/core';
import { TercerosService } from './terceros.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { MatAccordion } from '@angular/material/expansion';
import { Location } from '@angular/common';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { UserService } from 'src/app/core/services/user.service';


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

  checkFoto: boolean = true;
  campos: any[] = []
  matPanel = false;
  panelOpenState = false;
  form: FormGroup;
  parametro: string = '';
  loading: boolean = false;
  thirdParties: any[] = [];
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtros: any = {
    nit: '',
    name: '',
    third_party_type: '',
    email: '',
    cod_dian_address: '',
    municipio: '',
    phone: ''
  }
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
    private _user: UserService
  ) {
    this.paginator.itemsPerPageLabel = "Items por página:";
  }

  estado: any
  public sacarMenu(menu, state) {
    for (let i in menu) {
      if (menu[i]['child'].length > 0) {
        this.sacarMenu(menu[i]['child'], state)
      } else if (menu[i]['link'] && state.url.split('?')[0].match(menu[i]['link'])) {
        this.estado = true
      }
    }
    return this.estado
  }


  ngOnInit(): void {
    let estado = this.sacarMenu(this._user.user.menu, this.router)
    if (!estado) {
      this.router.navigateByUrl('/notauthorized');
    } else {
      for (let i in this.listaCampos) {
        if (this.listaCampos[i].selected) {
          this.selectedCampos.push(this.listaCampos[i].value)
        }
      }
      this.route.queryParamMap
        .subscribe((params) => {
          this.orderObj = { ...params.keys, ...params };
          for (let i in this.orderObj.params) {
            if (this.orderObj.params[i]) {
              if (Object.keys(this.orderObj).length > 2) {
                this.filtrosActivos = true
              }
              this.filtros[i] = this.orderObj.params[i]

            }
          }

          if (this.orderObj.params.pag) {
            this.getThirdParties(this.orderObj.params.pag);
          } else {
            this.getThirdParties()
          }

        }
        );
    }

  }

  cambiarCampo(event) {
    let position = event.source._keyManager._activeItemIndex
    this.listaCampos[position].selected ? this.listaCampos[position].selected = false : this.listaCampos[position].selected = true
  }

  SetFiltros(paginacion) {
    let params: any = {};

    params.pag = paginacion;
    for (let i in this.filtros) {
      if (this.filtros[i] != "") {
        params[i] = this.filtros[i];
      }
    }
    let queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;
  }
  openClose() {
    if (this.matPanel == false) {
      this.firstAccordion.openAll();
      this.matPanel = true;
    } else {
      this.firstAccordion.closeAll();
      this.matPanel = false;
    }
  }

  resetFiltros() {
    for (let i in this.filtros) {
      this.filtros[i] = ''
    }
    this.filtrosActivos = false
    this.getThirdParties()
  }

  paginacion: any
  handlePageEvent(event: PageEvent) {
    console.log(event)
    this.getThirdParties(event.pageIndex + 1)
  }

  getThirdParties(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('/crm/terceros', paramsurl);
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
