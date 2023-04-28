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
  public ruta = environment.url_assets
  public url: string;

  constructor(
    private detalleService: DetalleService,
    private activateRoute: ActivatedRoute,
    private basicDataService: DatosBasicosService,
    private _user: UserService,
    private location: Location,
    private _swal: SwalService,
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
    this.responsable = this._user.user;
  }

  regresar(): void {
    this.location.back();
  }

  verComponent(componente: string) {
    this.components = componente;
  }



  recargarDatos() {
    this.getUser();
    this.getBasicData();
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
