import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PreliquidadosService } from './preliquidados.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import * as moment from 'moment';
import { MatAccordion, PageEvent } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { DetalleService } from '../../ajustes/informacion-base/funcionarios/detalle-funcionario/detalle.service';
import { debounceTime, map, reduce, toArray } from 'rxjs/operators';
import { PaginatorService } from 'src/app/core/services/paginator.service';
import { Location } from '@angular/common';
import { from, of } from 'rxjs';

@Component({
  selector: 'app-preliquidados',
  templateUrl: './preliquidados.component.html',
  styleUrls: ['./preliquidados.component.scss']
})
export class PreliquidadosComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  preliquidados: any = [];
  preliquidadosSelect: any = [];
  responsable: any = {};
  matPanel: boolean;
  people: any[] = [];
  diffDays: any;

  loading: boolean = false;
  formFilters: FormGroup;
  active_filters: boolean = false
  orderObj: any
  paginationMaterial: any;
  pagination: any = {
    page: 1,
    pageSize: 10,
    //collectionSize: 0
  }


  listPreliquidados: any = []; //countries: [];
  //page = 1;
  //pageSize = 10;
  //collectionSize = 0;


  constructor(
    private router: Router,
    private _preliquidadosService: PreliquidadosService,
    private _swal: SwalService,
    private fb: FormBuilder,
    private _user: UserService,
    private _detalle: DetalleService,
    private route: ActivatedRoute,
    private _paginator: PaginatorService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.route.queryParamMap.subscribe((params: any) => {
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
      if (Object.keys(this.orderObj).length > 3) {
        this.active_filters = true
        const formValues = {};
        for (const param in params) {
          formValues[param] = params[param];
        }
        this.formFilters.patchValue(formValues['params']);
      }
      this.getPreliquidados();
      this.getPreliquidadosList();
      this.responsable = this._user.user;
    })

  }

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination)
    this.getPreliquidados();
  }

  resetFiltros() {
    this._paginator.resetFiltros(this.formFilters)
    this.active_filters = false
  }

  SetFiltros(paginacion) {
    return this._paginator.SetFiltros(paginacion, this.pagination, this.formFilters)
  }
  //ok
  createForm() {
    this.formFilters = this.fb.group({
      person_id: ''
    })
    this.formFilters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getPreliquidados();
    })
  }

  openModal() {
    this.modal.show();
  }
  //ok
  openClose() {
    this.matPanel = !this.matPanel;
    this.matPanel ? this.accordion.openAll() : this.accordion.closeAll();
  }

  getPreliquidadosList() {
    this._preliquidadosService.getPreliquidados().subscribe((res: any) => {
      this.preliquidadosSelect = res.data.data;
      this.preliquidadosSelect.unshift({ full_names: 'Todos', id: '' });
    })
  }

  getPreliquidados() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.formFilters.value
    }
    var paramsurl = this.SetFiltros(this.pagination.page);
    this.location.replaceState('rrhh/liquidados', paramsurl.toString());
    this._preliquidadosService.getPreliquidados(params)
      .subscribe((res: any) => {
        this.preliquidados = res.data.data;
        this.listPreliquidados = res.data.data;
        of(...this.listPreliquidados).pipe(
          map(({ one_preliquidated_log, ...rest }) => ({
            ...rest,
            one_preliquidated_log: {
              ...one_preliquidated_log,
              created_at_timestamp: new Date(one_preliquidated_log.created_at).getTime()
            }
          })),
          toArray(),
          map(arr => arr.sort((a, b) => b.one_preliquidated_log.created_at_timestamp - a.one_preliquidated_log.created_at_timestamp)),
          map(arr => arr.map(({ one_preliquidated_log: { created_at_timestamp, ...log }, ...rest }) => ({
            ...rest,
            one_preliquidated_log: {
              ...log,
              created_at: new Date(created_at_timestamp).toISOString()
            }
          }))),
        ).subscribe(sortedData => this.listPreliquidados = sortedData);

        this.loading = false;
        this.paginationMaterial = res.data
        if (this.paginationMaterial.last_page < this.pagination.page) {
          this.paginationMaterial.current_page = 1
          this.pagination.page = 1
          this.getPreliquidados();
        }
        /* for (let index = 0; index < this.preliquidados.length; index++) {
          let fecha = this.preliquidados[index].log_created_at;
          let InfoH = fecha;
          this.preliquidados[index].log_created_at = InfoH;
        } */
      })
  }

  // refreshPreLiquidated() {
  //   this.listPreliquidados = this.preliquidados.map((preliq, i) => ({ id: i + 1, ...preliq })).slice(
  //     (this.page - 1) * this.pageSize,
  //     (this.page - 1) * this.pageSize + this.pageSize,
  //   );
  // }

  cantidadDate(fecha) {
    let now = moment(fecha).startOf('D').fromNow();
    let hoy = new Date();
    let fecha1 = moment(hoy, "YYYY-MM-DD HH:mm:ss");
    let fecha2 = moment(fecha, "YYYY-MM-DD HH:mm:ss");
    let horas = Math.abs(fecha2.diff(fecha1, 'h'));
    let tiempo = '';
    if (horas > 24) {
      let dias = horas / 24
      dias = Math.trunc(dias);
      tiempo = 'Hace ' + dias + ' Dias';
      if (dias > 30) {
        let meses = dias / 30;
        meses = Math.trunc(meses);
        tiempo = 'Hace ' + meses + ' Meses';
        if (meses > 12) {
          let años = meses / 12;
          años = Math.trunc(años);
          tiempo = 'Hace ' + años + ' Años';
        }
      }
    } else if (horas == 0) {
      tiempo = 'Hace un momento ';
    } else {
      tiempo = 'Hace ' + horas + ' Horas';
    }
    return {
      'tiempo': tiempo,
      'horas': horas
    };
  }

  alert(id) {
    Swal.fire({
      icon: 'question',
      title: '¿Desea incluir los dias trabajados en la liquidación?',
      input: 'select',
      inputOptions: {
        si: 'Sí',
        no: 'No'
      },
      showCancelButton: true,
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: 'Liquidar',
      confirmButtonColor: '#A3BD30',
      reverseButtons: true,
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['rrhh/liquidado/', id, result.value]);
      }
    })
  }

  activate(preliquidado: any) {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      text: 'Vamos a activar a este empleado'
    }).then((result) => {
      if (result.isConfirmed) {
        let info = {
          id: preliquidado.id,
          identifier: preliquidado.identifier,
          full_name: preliquidado.first_name + ' ' + preliquidado.first_surname,
          contract_work: preliquidado.work_contract_id ?? 0,
          liquidated_at: moment().format('YYYY-MM-DD'),
          reponsible: {
            person_id: this.responsable.id,
            usuario: this.responsable.usuario
          },
          status: "Reincorporado"
        }

        this._detalle.setPreliquidadoLog(info).subscribe((res: any) => {
          if (res.status) {
            this._detalle.blockUser({ status: 'Activo' }, preliquidado.id).subscribe((r: any) => {
            })
            this._preliquidadosService.activate({ status: 'Activo' }, preliquidado.id).subscribe((r: any) => {
              this.getPreliquidados();
              this._swal.show({
                icon: 'success',
                title: 'Proceso finalizado',
                text: 'El funcionario ha sido activado con éxito.',
                showCancel: false,
                timer: 1000
              });
            });
          } else {
            this._swal.hardError();
          }
        })
      }
    });
  }

}
