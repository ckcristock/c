import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonDataService } from '../personData.service';

@Component({
  selector: 'app-prestaciones-sociales',
  templateUrl: './prestaciones-sociales.component.html',
  styleUrls: ['./prestaciones-sociales.component.scss']
})
export class PrestacionesSocialesComponent implements OnInit {
  @Output('siguiente') siguiente = new EventEmitter();
  dependencies = [{ name: 'test', id: 1 }]
  $person: Subscription;
  form: FormGroup
  constructor(
    private _person: PersonDataService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.$person = this._person.person.subscribe(r => {
      console.log(r);
      /*  this.person=r */
    })
  }


  crearForm() {
    this.form = this.fb.group({
      eps_id: ['', Validators.required],
      compensation_id: ['', Validators.required],
      cesantias_id: ['', Validators.required],
      pensiones_id: ['', Validators.required],
   
    })
  }
  save() {
    this.form.markAllAsTouched()
    if (this.form.valid) {
      this.siguiente.emit({})
    }
    this._person.person.next(this.form.value)
    this.siguiente.emit({})
  }
}
