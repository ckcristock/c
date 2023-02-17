import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { MatAccordion } from '@angular/material/expansion';
import { CesantiasService } from './cesantias.service';
import { DateAdapter } from 'saturn-datepicker';
import { debounceTime } from 'rxjs/operators';
import { PageEvent } from '@angular/material';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-cesantias',
  templateUrl: './cesantias.component.html',
  styleUrls: ['./cesantias.component.scss']
})
export class CesantiasComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  datePipe = new DatePipe('es-CO');
  matPanel: boolean;
  permission: Permissions = {
    menu: 'Cesatía',
    permissions: {
      show: true,
      add: true
    }
  };
  year = new Date().getFullYear();
  habilitarPagar: boolean = false;
  pagination = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }
  loading: boolean = false;
  estadoFiltros: boolean = false;
  formFilters: FormGroup;
  activeFilters: boolean = false;
  orderObj: any;
  cesantiasList: any = [];

/*   @ViewChild('modal') modal: any;
  @ViewChild('modalFuncionario') modalFuncionario: any;
  @Input('empleados') empleados;
  form: FormGroup;
  years: any[] = []; */



  /**Cambiar los servicios a cesantías */

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dateAdapter: DateAdapter<any>,
    private _permission: PermissionService,
    private _modal: ModalService,
    private _swal: SwalService,

    private _cesantias: CesantiasService,
  ) {
    this.dateAdapter.setLocale('es');
    this.permission = this._permission.validatePermissions(this.permission);
  }

  ngOnInit(): void {
    if (this.permission.permissions.show) {
      this.createFormFilters();
      this.route.queryParamMap.subscribe((params: any) =>{
        if (params.params.pageSize) {
          this.pagination.pageSize = params.params.pageSize
        } else {
          this.pagination.pageSize = 10
        }
        if (params.params.pag) {
          this.pagination.page = params.params.pag
        } else {
          this.pagination.page = 1
        }
        this.orderObj = { ...params.keys, ...params }

        if (Object.keys(this.orderObj).length > 4) {
          this.activeFilters = true
          const formValues = {};
          for (const param in params) {
            formValues[param] = params[param];
          }
          this.formFilters.patchValue(formValues['params']);
        }
      });
      /**acá van los get de las cesantías */

      //this.createForm();
      this.habilitarBotonPagar();
    } else { //sino, no está autorizado
      this.router.navigate(['/notautorized']);
    }
  }

    /***
     * La primera consulta es el historial de las cesantías
     * la segunda es el individual,
     * y el generar el actual
     */

  openClose(){ //para los filtros
    this.matPanel = !this.matPanel;
    this.matPanel ? this.accordion.openAll() : this.accordion.closeAll();
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.pageSize = event.pageSize
    this.pagination.page = event.pageIndex + 1
    this.getCesantiasList()
  }

  resetFiltros() {
    for (const controlName in this.formFilters.controls) {
      this.formFilters.get(controlName).setValue('');
    }
    this.activeFilters = false
  }

  SetFiltros(paginacion) {
    let params = new HttpParams;
    params = params.set('pag', paginacion)
    //params = params.set('pageSize', this.pagination.pageSize)  //ojo
    for (const controlName in this.formFilters.controls) {
      const control = this.formFilters.get(controlName);
      if (control.value) {
        params = params.set(controlName, control.value);
      }
    }
    return params;
  }

  createFormFilters() {
    this.formFilters = this.fb.group({
      people_id: [''],
      date_from: [''],
      date_to: [''],
    })
    this.formFilters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getCesantiasList();
    })
    //Falta chequear la relación entre los filtros para establecer las peticiones al cambiar la seleccion
   /*  this.formFilters.get('group_id').valueChanges.subscribe((valor) => {
      if (valor) {
        this.formFilters.get('dependency_id').enable();
        //this.getDependencies(valor);
      } else {
        this.formFilters.patchValue({ dependency_id: 0 });
        this.formFilters.get('dependency_id').disable();
      }
    }); */
  }


  /***
   * para el fitro por fecha, pero poner el combo por año puesto
   * que las cesantías se pagan anual
   */
  selectedDate(fecha) {
    if (fecha.value) {
      this.formFilters.patchValue({
        date_from: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
        date_to: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
      })
    } else {
      this.formFilters.patchValue({
        date_from: '',
        date_to: ''
      });
    }
    this.getCesantiasList()
  }

  getCesantiasList(page = 1){
    this.loading = true
    this.pagination.page = page;
    let params = {
      ...this.pagination
    }
    this._cesantias.getLayoffsListPaginated(params)
      .subscribe((r: any) => {
        this.cesantiasList = r.data.data;
        this.pagination.collectionSize = r.data.total
        this.loading = false
      })
  }

  openConfirm() {
    //chequear que no exista cesantía paga en ese añó
    let params = {
      yearSelected: this.year,
    }
    //console.log(params)
     this._cesantias.getCheckLayoffs(params.yearSelected).subscribe(res => {
      //chequea en la DB si existe prima de este periodo
      console.log(res);
      console.log(this.router.navigate(['/nomina/cesantias/', params.yearSelected, 0]));

      if (res['data'] == null) {
        this.router.navigate(['/nomina/cesantias/', params.yearSelected, 0])//modificar esta ruta
      } else {
        //si existe, si está paga o no
        if (res['data']['status'] == 'pagado') {
          Swal.fire({
            title: 'Prima',
            html: 'Ya se han pagado las cesantías del año: ' + this.year + ').' + '<br>' + 'Solo podrá visualizar',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#A3BD30',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            confirmButtonText: 'Sí, confirmar'
          }).then((res)=>{
            if(res.isConfirmed){
              console.log('redirigir a la cesantía del anio mencionado');
              this.router.navigate(['/nomina/cesantia/', params.yearSelected, false]) //modificar esta ruta
            }
          })
        } else {
          this._swal.show({
            title: 'Prima',
            text: `Ya se ha generado un listado ¿Desea regenerar la lista de cesantías del año ${params.yearSelected}?`,
            icon: 'warning',
            showCancel: true
          }, (res: any) => {
            if (res) {
              if (res) {
                console.log(res);
                console.log('REDIRIJIR A OTRA PARTE');
                this.router.navigate(['/nomina/cesantia/', params.yearSelected, true]) //cambiar esta ruta
              }
            }
          })
        }
      }
    });
  }

////////////////////////////////
/*
  openModal() {
    this.modal.show();
  }

  createForm() {
    this.form = this.fb.group({
      year: ['', Validators.required],
      periodo: ['', Validators.required]
    })
  }

  openModalFuncionario() {
    this.modalFuncionario.show();
  } */

  //////////


  habilitarBotonPagar (){
    const hoy = new Date;
    //const hoy = new Date(2022,11,10);
    const hoyMes = hoy.getMonth();
    // 0: Enero, 1: Febrere, 2: Marzo, 3: Abril,
    // 4: Mayo, 5: Junio, 6: Julio, 7: Agosto,
    // 8: Septiembre, 9: Octubre, 10: Noviembre, 11: Diciembre
    if (hoyMes == 0 || hoyMes == 1 )  {
      this.habilitarPagar = true;
    } else {
      this.habilitarPagar = false;
    }
  }

  VerPrimaFuncionarios(period) {
    /***consulta al servicio que trae los calculos,
    requiero suledo base,
    los días trabajados y
    el fondo de pensión al que está afiliado*/
    let params = {
      period: period,
      yearSelected: period.split('-')[0],
      periodo: period.split('-')[1],
    }
    /* this._primas.setBonus(params)
      .subscribe((r: any) => {
        if (r.data != null) {
          this.router.navigate(['/nomina/cesantia', params.yearSelected, true])
        }
      }) */
  }

}
