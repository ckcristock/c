import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { DetalleService } from './detalle.service';
import { DatosBasicosService } from './ver-funcionario/datos-basicos/datos-basicos.service';
import { SwalService } from '../../services/swal.service';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/core/services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DateAdapter } from 'saturn-datepicker';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-detalle-funcionario',
  templateUrl: './detalle-funcionario.component.html',
  styleUrls: ['./detalle-funcionario.component.scss']
})
export class DetalleFuncionarioComponent implements OnInit {
  habilitado = true;
  components = 'informacion';
  id: any;
  active = 1;
  data$: any;
  funcionario: any = {
    salary: '',
    work_contract: '',
    first_name: '',
    first_surname: '',
    image: '',
    second_name: '',
    second_surname: '',
    signature: '',
    title: ''
  };
  user: any = {};
  responsable: any = {};
  form: FormGroup;
  datePipe = new DatePipe('es-CO');
  date = moment().format('YYYY-MM-DD');
  maxDate = moment().format('YYYY-MM-DD');
  public ruta = environment.url_assets
  public url: string;

  constructor(
    private detalleService: DetalleService,
    private activateRoute: ActivatedRoute,
    private basicDataService: DatosBasicosService,
    private _user: UserService,
    private location: Location,
    private _swal: SwalService,
    private _modal: ModalService,
    private fb: FormBuilder,
    private router: Router,
    private dateAdapter: DateAdapter<any>
  ) {
    dateAdapter.setLocale('es')
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.getBasicData();
    this.data$ = this.basicDataService.datos$.subscribe(data => {
      this.getBasicData();
    });
    this.getUser();
    this.createForm();
    this.responsable = this._user.user;
  }

  openConfirm(content) {
    this._modal.open(content)
  }

  createForm() {
    this.form = this.fb.group({
      date_from: [moment().format('YYYY-MM-DD'), Validators.required],
    })
  }
  selectedDate(fecha:any) {
    if (fecha.valor > moment()){
      this._swal.show({
        icon: 'error',
        title: 'Fecha incorrecta',
        text: 'No puede escoger una fecha luego de hoy',
        showCancel: false,
        timer: 2000
      });
    }else {
      this.form.patchValue({
        date_from: this.datePipe.transform(fecha.value, 'yyyy-MM-dd')
      })
    }
  }

  regresar(): void {
    this.location.back();
  }

  verComponent(componente: string) {
    this.components = componente;
  }

  liquidar(status: any) {
    console.log(this.funcionario);
    let dataForm = {
      status,
    }
    let info = {
      id: this.funcionario.id,
      identifier: this.funcionario.identifier,
      full_name: this.funcionario.first_name+' '+this.funcionario.first_surname,
      contract_work: this.funcionario.work_contract_id ?? 0,
      liquidated_at: this.form.controls.date_from.value,
      reponsible: {
          person_id: this.responsable.id,
          usuario: this.responsable.usuario
      },
      status: "PreLiquidado"
    }
    let data = {
      state: 'Inactivo',
    }
    console.log(dataForm);
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      text: 'El funcionario '+ this.funcionario.first_name+' no tendrá más acceso al sistema'
    }).then((result) => {
      if (result.isConfirmed) {
        this.detalleService.setPreliquidadoLog(info).subscribe((r:any)=>{
          if (r.status) {
            this.detalleService.blockUser(data, this.id).subscribe((r: any) => {
              console.log(r.status);
            })
            this.detalleService.liquidar(dataForm, this.id).subscribe((r: any) => {
              this._swal.show({
                icon: 'success',
                title: 'Proceso finalizado',
                text: r.data,
                showCancel: false,
                timer: 1000
              });
              this.getUser();
              this.getBasicData();
            });
          } else {
            this._swal.show({
              icon: 'error',
              title: 'Ha ocurrido un error inesperado',
              //text: 'El funcionario ha sido preliquidado con éxito.',
              //text: r.err.data,
              text: r.err.message,
              showCancel: false,
              timer: 2000
            });
          }
        })

      }
    });
  }

  getUser() {
    this.detalleService.getUser(this.id).subscribe((r: any) => {
      this.user = r.data;
    })
  }

  bloquear(state: any) {
    let data = {
      state,
      responsible: this.responsable
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: (data.state == 'Inactivo' ? 'Vamos a bloquear a ' + this.funcionario.first_name + '.' : 'Vamos a activar a ' + this.funcionario.first_name + '.')
    }).then((result) => {
      if (result.isConfirmed) {
        this.detalleService.blockUser(data, this.id).subscribe((r: any) => {
          this.getUser();
          this._swal.show({
            icon: 'success',
            title: 'Proceso finalizado',
            text: (data.state == 'Inactivo' ? this.funcionario.first_name + ' ha sido bloqueado con éxito.' : this.funcionario.first_name + ' ha sido activado con éxito.'),
            showCancel: false,
            timer: 1000
          });
        })
      }
    });
  }

  getBasicData() {
    this.detalleService.getBasicData(this.id)
      .subscribe((res: any) => {
        this.funcionario = res.data;
        this.url = this.ruta + '/filemanager/filemanager/dialog.php?type=0&car=rrhh%2Ffuncionarios%2F' + this.funcionario.identifier
      });
  }

  ngOnDestroy(): void {
    this.data$.unsubscribe();
  }

}
