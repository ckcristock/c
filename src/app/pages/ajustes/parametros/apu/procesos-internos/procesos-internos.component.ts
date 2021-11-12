import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { UnidadesMedidasService } from '../unidades-medidas/unidades-medidas.service';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { ProcesosInternosService } from './procesos-internos.service';

@Component({
  selector: 'app-procesos-internos',
  templateUrl: './procesos-internos.component.html',
  styleUrls: ['./procesos-internos.component.scss']
})
export class ProcesosInternosComponent implements OnInit {
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
                private _int_processes: ProcesosInternosService,
                private _swal: SwalService,
                private _units: UnidadesMedidasService
              ) { }

  ngOnInit(): void {
    this.getUnits();
    this.createForm();
    this.getInternalProcesses();
  }

  openModal(){
    this.modal.show();
    this.title = 'Nuevo Proceso interno';
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
    this.title = 'Actualizar proceso interno';
    this.form.patchValue({
      id: this.process.id,
      name: this.process.name,
      unit_id: this.process.unit_id,
      unit_cost: this.process.unit_cost
    })
  }

  getInternalProcesses( page = 1 ){
    this.loading = true;
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this._int_processes.getinternalProcesses(params).subscribe((r:any) => {
      this.processes = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  save(){
    this._int_processes.save(this.form.value).subscribe((r:any) => {
      this.modal.hide();
      this.form.reset();
      this.getInternalProcesses();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false
      })
    })
  }

}
