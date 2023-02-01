import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { DetalleService } from './detalle.service';
import { DatosBasicosService } from './ver-funcionario/datos-basicos/datos-basicos.service';
import { SwalService } from '../../services/swal.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ModalService } from 'src/app/core/services/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

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
  form: FormGroup;
  datePipe = new DatePipe('es-CO');
  date = moment().format('YYYY-MM-DD');
  public ruta = environment.url_assets
  public url: string;

  constructor(
    private detalleService: DetalleService,
    private activateRoute: ActivatedRoute,
    private basicDataService: DatosBasicosService,
    private location: Location,
    private _swal: SwalService,
    private _modal: ModalService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.getBasicData();
    this.data$ = this.basicDataService.datos$.subscribe(data => {
      this.getBasicData();
    });
    this.getUser();
    this.createForm();
  }

  openConfirm(content) {
    this._modal.open(content)
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      date_from: [''],
      date_to: [''],
    })
  }
  selectedDate(fecha) {
    //console.log(fecha);
    this.form.patchValue({
      date_from: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
      date_to: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
    })
    console.log(this.form);
  }

  regresar(): void {
    this.location.back();
  }

  verComponent(componente: string) {
    this.components = componente;
  }

  liquidar(status) {
    let data = {
      status
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      text: 'Vamos a liquidar a '+ this.funcionario.first_name
    }).then((result) => {
      console.log(result);

      Swal.fire({
        title: '<strong>HTML <u>example</u></strong>',
        icon: 'info',
        html:
          '<input type="date" id="start" name="trip-start"'+
          'value="2018-07-22"'+
          'min="2018-01-01" max="2018-12-31">',

        showCloseButton: false,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
          '<i class="fa fa-thumbs-up"></i> Great!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText:
          '<i class="fa fa-thumbs-down"></i>',
        cancelButtonAriaLabel: 'Thumbs down'
      })
      /* if (result.isConfirmed) {
        this.detalleService.liquidar(data, this.id).subscribe((r: any) => {
          this._swal.show({
            icon: 'success',
            title: 'Proceso finalizado',
            text: 'El funcionario ha sido preliquidado con éxito.',
            showCancel: false,
            timer: 1000
          });
        });
      } */
    });
  }

  getUser() {
    this.detalleService.getUser(this.id).subscribe((r: any) => {
      this.user = r.data;
    })
  }

  bloquear(state) {
    let data = {
      state
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: (data.state == 'Inactivo' ? 'Vamos a bloquear a' + this.funcionario.first_name + '.' : 'Vamos a activar a ' + this.funcionario.first_name + '.')
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
