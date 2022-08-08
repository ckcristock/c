import { Component, OnInit, ViewChild } from '@angular/core';
import { TercerosService } from './terceros.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { MatAccordion } from '@angular/material/expansion';
import { Location } from '@angular/common';
import 'rxjs/add/operator/filter';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-terceros',
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss']
})
export class TercerosComponent implements OnInit {
  checkFoto: boolean = true;
  checkNIT: boolean = true;
  checkNombre: boolean = true;
  checkDireccion: boolean = true;
  checkMunicipio: boolean = true;
  checkTelefono: boolean = true;
  checkTipo: boolean = true;
  checkEstado: boolean = true;
  checkEmail: boolean = false;
  @ViewChild('firstAccordion') firstAccordion: MatAccordion;
  @ViewChild('secondAccordion') secondAccordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.firstAccordion.openAll();
      this.matPanel = true;
    } else {
      this.firstAccordion.closeAll();
      this.matPanel = false;
    }
  }
  matPanel2 = false;
  openClose2() {
    if (this.matPanel2 == false) {
      this.secondAccordion.openAll();
      this.matPanel2 = true;
    } else {
      this.secondAccordion.closeAll();
      this.matPanel2 = false;
    }
  }
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
  constructor(
    private _tercerosService: TercerosService,
    private fb: FormBuilder,
    private location: Location,
    public router: Router,
    private route: ActivatedRoute,
    private paginator: MatPaginatorIntl,
    private _swal: SwalService
  ) { 
    this.paginator.itemsPerPageLabel = "Items por página:";
  }

  SetFiltros(paginacion) {
    let params: any = {};

    params.pag = paginacion;
    for (let i in this.filtros){
      if (this.filtros[i] != "") {
        params[i] = this.filtros[i];
      }
    }
    let queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;
  }
  orderObj: any
  filtrosActivos: boolean = false
  ngOnInit(): void {    
    this.route.queryParamMap
      .subscribe((params) => {
        this.orderObj = { ...params.keys, ...params };
        console.log(Object.keys(this.orderObj).length)
        for (let i in this.orderObj.params){
          if (this.orderObj.params[i]){      
            if (Object.keys(this.orderObj).length > 2){
              this.filtrosActivos = true
            }                          
            this.filtros[i] = this.orderObj.params[i]
            
          }
        }
        
        if (this.orderObj.params.pag){
          this.getThirdParties(this.orderObj.params.pag);
        } else {
          this.getThirdParties()
        }
        
      }
      );
  }

  resetFiltros(){
    for(let i in this.filtros){
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
      console.log(this.paginacion)
      
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
