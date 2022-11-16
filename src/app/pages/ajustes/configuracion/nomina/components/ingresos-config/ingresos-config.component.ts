import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { NominaConfigService } from '../../nomina-config.service';

@Component({
  selector: 'app-ingresos-config',
  templateUrl: './ingresos-config.component.html',
  styleUrls: ['./ingresos-config.component.scss']
})
export class IngresosConfigComponent implements OnInit {
  @ViewChild('modalIngreso') modalIngreso: any;
  @Input() open: Observable<any> = new Observable();
  @Output() refresh: EventEmitter<any> = new EventEmitter;
  @Input('datos') datos: any;
  @Output('notificacion') notificacion = new EventEmitter<any>();
  private _suscription: any;

  form: FormGroup;

  constructor(
    private _nominaService: NominaConfigService,
    private _swal: SwalService,
    private _modal: ModalService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this._suscription = this.open.subscribe(()=>{
      this._modal.open(this.modalIngreso, 'md', false)
    });
    this.createForm();
  }

  createForm() {
    this.form = this._fb.group({
      cuenta: ['', Validators.required],
      name: ['', Validators.required],
      concept: ['', Validators.required],
    })
  }

  actualizar(event, variable, id) {
    let params = {
      id: id,
      [variable]: event
    }
    this._nominaService.updateCreateIngresos(params).subscribe((res: any) => {
      this._swal.show({
        icon: 'success',
        title: 'Ingresos',
        text: res.data,
        showCancel: false,
        timer: 1000
      })
    })
  }

  save(){
    console.log(this.form.value)
  }

}
