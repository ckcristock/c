import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-accommodations',
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.scss']
})
export class AccommodationsComponent implements OnInit {
  @Input('data') values: any;
  @Input('pagination') pagination: any;
  @Input('loading') loading: any;
  @Output() saveEvent = new EventEmitter<any>();
  @Output() paginationEvent = new EventEmitter<any>();
  @Output() anularOActivarEvent = new EventEmitter<any>();

  filtro: any = {
    value: ''
  }
  value: any = {}
  form: FormGroup
  title: string = 'Agregar';

  constructor(
    private fb: FormBuilder,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.value.id],
      name: ['']
    })
  }

  getValue(value: any) {
    this.title = 'Editar'
    this.value = { ...value }
    this.form.patchValue({
      id: value.id,
      name: value.name
    })
  }

  getValues($event) {
    this.paginationEvent.emit($event);
  }

  save() {
    if (this.form.get('name').value) {
      this.saveEvent.emit(this.form)
    } else {
      this._swal.incompleteError()
    }
  }

  anularOActivar(value: any, action: any) {
    let params = { value, action }
    this.anularOActivarEvent.emit(params)
  }
}
