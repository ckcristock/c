import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorsService } from '../../../services/reactive-validation/validators.service';

@Component({
  selector: 'app-create-turno-rotativo',
  templateUrl: './create-turno-rotativo.component.html',
  styleUrls: ['./create-turno-rotativo.component.scss'],
})
export class CreateTurnoRotativoComponent implements OnInit {
  turnosRotativo: any = [];
  loading = false;
  forma: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _valReactive: ValidatorsService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.crearListeners();
  }
  createForm() {
    this.forma = this.fb.group({
      name: ['', [this._valReactive.required, this._valReactive.minLength(5)]],
      entry_tolerance: ['', this._valReactive.required],
      leave_tolerance: ['', this._valReactive.required],
      extra_hours: ['', this._valReactive.required],
      entry_time: ['', this._valReactive.required],
      leave_time: ['', this._valReactive.required],
      launch: ['', this._valReactive.required],
      launch_time: ['', this._valReactive.required],
      breack: ['', this._valReactive.required],
      breack_time: ['', this._valReactive.required],
    });
    this.forma.get('launch_time').disable();
    this.forma.get('breack_time').disable();
  }
  crearListeners() {
    this.forma.get('launch').valueChanges.subscribe((valor) => {
      let control = this.forma.get('launch_time');
      valor == false ? control.disable() : control.enable();
    });
    this.forma.get('breack').valueChanges.subscribe((valor) => {
      let control = this.forma.get('breack_time');
      valor == false ? control.disable() : control.enable();
    });
  }
  save() {
    this.forma.markAllAsTouched();
  }

  get invalid_name() {
    return this.forma.get('name').invalid && this.forma.get('name').touched;
  }
  get invalid_entry_tolerance() {
    return (
      this.forma.get('entry_tolerance').invalid &&
      this.forma.get('entry_tolerance').touched
    );
  }
  get invalid_leave_tolerance() {
    return (
      this.forma.get('leave_tolerance').invalid &&
      this.forma.get('leave_tolerance').touched
    );
  }
  get invalid_extra_hours() {
    return (
      this.forma.get('extra_hours').invalid &&
      this.forma.get('extra_hours').touched
    );
  }
  get invalid_entry_time() {
    return (
      this.forma.get('entry_time').invalid &&
      this.forma.get('entry_time').touched
    );
  }
  get invalid_leave_time() {
    return (
      this.forma.get('leave_time').invalid &&
      this.forma.get('leave_time').touched
    );
  }
}
