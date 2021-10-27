import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { ProcesosExternosService } from './procesos-externos.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { UnidadesMedidasService } from '../unidades-medidas/unidades-medidas.service';

@Component({
  selector: 'app-procesos-externos',
  templateUrl: './procesos-externos.component.html',
  styleUrls: ['./procesos-externos.component.scss']
})
export class ProcesosExternosComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  form: FormGroup;
  title:string = '';
  units:any[] = [];
  processes:any[] = [];
  process:any = {};
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtro = {
    name: ''
  }
  constructor(
                private fb: FormBuilder,
                private _validators: ValidatorsService,
                private _ext_processes: ProcesosExternosService,
                private _swal: SwalService,
                private _units: UnidadesMedidasService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getUnits();
    this.getExternalProcesses();
  }

  openModal(){
    this.modal.show();
    this.title = 'Nuevo Proceso externo';
  }

  createForm(){
    this.form = this.fb.group({
      id: [this.process.id],
      name: ['', this._validators.required],
      unit_id: ['', this._validators.required],
      unit_cost: ['', this._validators.required]
    })
  }

  getUnits(){
    this._units.getUnits().subscribe((r:any) => {
      this.units = r.data;
    })
  }

  getProcess(process){
    this.process = {...process};
    this.title = 'Actualizar proceso externo';
    this.form.patchValue({
      id: this.process.id,
      name: this.process.name,
      unit_id: this.process.unit_id,
      unit_cost: this.process.unit_cost
    })
  }

  getExternalProcesses( page = 1 ){
    this.loading = true;
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this._ext_processes.getExternalProcesses(params).subscribe((r:any) => {
      this.processes = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  save(){
    this._ext_processes.save(this.form.value).subscribe((r:any) => {
      this.modal.hide();
      this.form.reset();
      this.getExternalProcesses();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false
      })
    })
  }

}
