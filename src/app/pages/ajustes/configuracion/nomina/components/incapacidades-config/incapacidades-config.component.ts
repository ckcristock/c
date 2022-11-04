import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from '../../nomina-config.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-incapacidades-config',
  templateUrl: './incapacidades-config.component.html',
  styleUrls: ['./incapacidades-config.component.scss']
})

export class IncapacidadesConfigComponent implements OnInit {

  @Input('datos') datos;
  @Output('notificacion') notificacion = new EventEmitter<any>();
  form: FormGroup;
  page: any = '';
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  loading: boolean = false;
  filtros: any  = {
    nombre:'',
    categoria:'',
    vida_util:'',
    depreciacion:''
  };
  pageSize: any = 10;
  cuentas: any;

  constructor(
    private _nominaService: NominaConfigService,
    private fb: FormBuilder,
    private _swal: SwalService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }
/*
  getBodegas(page = 1) {

    this.loading = true;
    this.bodegaService.getBodegas(params).subscribe((r */

    setFiltros(paginacion:boolean) {

      let params:any = {};

      params.tam = this.pageSize;

      if(paginacion === true){
        params.pag = this.page;
      }else{
        this.page = 1; // Volver a la página 1 al filtrar
        params.pag = this.page;
      }

      if (this.filtros.nombre.trim() != "") {
        params.nombre = this.filtros.nombre;
      }

      if (this.filtros.categoria.trim() != "") {
        params.categoria = this.filtros.categoria;
      }

      if (this.filtros.vida_util.trim() != "") {
        params.vida_util = this.filtros.vida_util;
      }

      if (this.filtros.depreciacion.trim() != "") {
        params.depreciacion = this.filtros.depreciacion;
      }

      let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
      return queryString;
    }

    resetValues(){
      this.filtros = {
        nombre:'',
        categoria:'',
        vida_util:'',
        depreciacion:''
      };
    }

  consultaFiltrada(paginacion:boolean = false, page = 1) {

    /* this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    } */

    let params = this.setFiltros(paginacion);
    if(params === ''){
      this.resetValues();
      return;
    }

    this.loading = true;
    this.http.get(`${environment.ruta}php/plancuentas/filtrar_cuentas.php?`+{params}).subscribe((data:any) => {
      console.log(data)
      /* if (data.codigo == 'success') {
        this.TiposActivosFijos = data.query_result;
        this.TotalItems = data.numReg;
      }else{
        this.TiposActivosFijos = [];
      } */

      this.loading = false;

    });
  }
//{ params: { coincidencia: term, tipo: 'niif' }}
  //formatter1 = (x: { Nombre_Cuenta: string }) => x.Nombre_Cuenta;

  buscandoCuenta: boolean = false;
  busquedaCuentaFallida: boolean = false;
  formatter = (x: { Nombre_Niif: string , Codigo_Niif: string }) => x.Nombre_Niif;
  search_cuenta_niif = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => (this.buscandoCuenta = true)),
    switchMap(term =>
      //this.http.get(`${environment.ruta}php/tipoactivo/get_lista_tipo_activo.php?`+{search: term}).pipe(
      this.http.get(`${environment.ruta}php/plancuentas/filtrar_cuentas.php?`+{search: term}).pipe(
      tap((res) => {
        console.log(typeof(res))
        if(res){
          /* res.filter((ele)=>{
            ele.Codigo_Niif == term
          }) */
          this.buscandoCuenta = false
        } else {
          this.cuentas = res
        }
          console.log(res)
          this.busquedaCuentaFallida = false
        }),
        catchError(() => {
          this.busquedaCuentaFallida = true;
          return of([]);
        })
      )
    ),
    tap(() => (this.buscandoCuenta = false))
  );

  actualizar(event, percentage) {
    let params = {
      percentage: percentage
    }
    this._nominaService.updateIncapacidades(event.id, params).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: res.data,
        showCancel: false,
        text: '',
        timer: 1000
      })
    })
  }

}
