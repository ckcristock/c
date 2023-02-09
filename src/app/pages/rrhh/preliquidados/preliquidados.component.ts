import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PreliquidadosService } from './preliquidados.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import * as moment from 'moment';
import { MatAccordion } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { DetalleService } from '../../ajustes/informacion-base/funcionarios/detalle-funcionario/detalle.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-preliquidados',
  templateUrl: './preliquidados.component.html',
  styleUrls: ['./preliquidados.component.scss']
})
export class PreliquidadosComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  preliquidados: any = [];
  responsable: any = {};
  formFilters: FormGroup;
  loading: boolean = false;
  matPanel: boolean;
  people: any[] = [];
  diffDays: any;
  pagination: any = {
    page: 1,
    pageSize: 4,
    collectionSize: 0
  }


  listPreliquidados: any = []; //countries: [];
  page = 1;
	pageSize = 4;
	collectionSize = 0;


  constructor(
    private router: Router,
    private _preliquidadosService: PreliquidadosService,
    private _swal: SwalService,
    private fb: FormBuilder,
    private _user: UserService,
    private _detalle: DetalleService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getPreliquidados();
    console.log(this.preliquidados);
    this.responsable = this._user.user;
  }

  createForm(){
    this.formFilters = this.fb.group({
      person_id: ''
    })
    console.log(this.formFilters.controls.value);

    this.formFilters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r=>{
      this.getPreliquidados();
    })
  }

  openModal() {
    this.modal.show();
  }

  openClose() {
    this.matPanel = !this.matPanel;
    this.matPanel ? this.accordion.openAll() : this.accordion.closeAll();
  }

  getPreliquidados() {
    this.loading = true;
    let params = {
      ...this.formFilters.value
    }
    this._preliquidadosService.getPreliquidados(params)
      .subscribe((res: any) => {
        this.preliquidados = res.data;
        this.listPreliquidados = res.data;
        this.collectionSize = res.data.length;
        this.loading = false;
        /* for (let index = 0; index < this.preliquidados.length; index++) {
          let fecha = this.preliquidados[index].log_created_at;
          let InfoH = fecha;
          this.preliquidados[index].log_created_at = InfoH;
        } */
      })
  }

  refreshCountries() {
    console.log(this.preliquidados);
		 this.listPreliquidados = this.preliquidados.map((preliq, i) => ({ id: i + 1, ...preliq })).slice(
			(this.page - 1) * this.pageSize,
			(this.page - 1) * this.pageSize + this.pageSize,
		);
	}

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
          full_name: preliquidado.first_name+' '+preliquidado.first_surname,
          contract_work: preliquidado.work_contract_id ?? 0,
          liquidated_at: moment().format('YYYY-MM-DD'),
          reponsible: {
              person_id: this.responsable.id,
              usuario: this.responsable.usuario
          },
          status: "Reincorporado"
        }

        this._detalle.setPreliquidadoLog(info).subscribe((res:any)=>{
          if (res.status) {
            this._detalle.blockUser({ status: 'Activo' }, preliquidado.id).subscribe((r: any) => {
              console.log(r.status);
            })
            this._preliquidadosService.activate({ status: 'Activo' }, preliquidado.id).subscribe((r: any) => {
              console.log(r);
              this.getPreliquidados();
              this._swal.show({
                icon: 'success',
                title: 'Proceso finalizado',
                text: 'El funcionario ha sido activado con éxito.',
                showCancel: false,
                timer: 1000
              });
            });
          }
        })
      }
    });
  }

}
