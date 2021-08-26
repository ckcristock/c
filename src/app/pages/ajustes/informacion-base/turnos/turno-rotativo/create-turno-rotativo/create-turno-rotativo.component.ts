import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorsService } from '../../../services/reactive-validation/validators.service';

@Component({
  selector: 'app-create-turno-rotativo',
  templateUrl: './create-turno-rotativo.component.html',
  styleUrls: ['./create-turno-rotativo.component.scss'],
})
export class CreateTurnoRotativoComponent implements OnInit {
  turnosRotativo : any = []
  loading = false;
  forma: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _valReactive: ValidatorsService
  ) {}
  
  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    this.forma = this.fb.group({
      name: ['', this._valReactive.required],
      entry_tolerance: ['', this._valReactive.required],
      leave_tolerance: ['', this._valReactive.required ],
      extra_hours: ['', this._valReactive.required ],
      entry_time: ['' , this._valReactive.required ],
      leave_time: ['' , this._valReactive.required ],
    });
  }
  save() {}

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
