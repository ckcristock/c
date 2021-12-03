import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { MaquinasHerramientasService } from './maquinas-herramientas.service';
import { UnidadesMedidasService } from '../unidades-medidas/unidades-medidas.service';

@Component({
  selector: 'app-maquinas-herramientas',
  templateUrl: './maquinas-herramientas.component.html',
  styleUrls: ['./maquinas-herramientas.component.scss']
})
export class MaquinasHerramientasComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  form: FormGroup;
  title:string = '';
  units:any[] = [];
  machines:any[] = [];
  machine:any = {};
  constructor(
              private fb: FormBuilder,
              private _validators: ValidatorsService,
              private _machine: MaquinasHerramientasService,
              private _swal: SwalService,
              private _units: UnidadesMedidasService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getUnits();
    this.getMachines();
  }

  openModal(){
    this.modal.show();
    this.title = 'Nueva maquina';
  }

  createForm(){
    this.form = this.fb.group({
      id: [this.machine.id],
      name: ['', this._validators.required],
      unit_id: ['', this._validators.required],
      unit_cost: ['', this._validators.required],
      type_id: ['', this._validators.required]
    })
  }

  getUnits(){
    this._units.getUnits().subscribe((r:any) => {
      this.units = r.data;
    })
  }

  getMaquine(machine){
    this.machine = {...machine};
    this.title = 'Actualizar maquina';
    let type_id = parseInt(this.machine.type_id);
    this.form.patchValue({
      id: this.machine.id,
      name: this.machine.name,
      unit_id: this.machine.unit_id,
      unit_cost: this.machine.unit_cost,
      type_id: type_id
    })
  }

  getMachines(){
    this.loading = true;
    this._machine.getMachines().subscribe((r:any) => {
      this.machines = r.data.data;
      this.loading = false;
    })
  }

  save(){
    this._machine.save(this.form.value).subscribe((r:any) => {
      this.modal.hide();
      this.form.reset();
      this.getMachines();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false
      })
    })
  }

}
