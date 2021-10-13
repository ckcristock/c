import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HotelesService } from '../hoteles/hoteles.service';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  styleUrls: ['./taxis.component.scss']
})
export class TaxisComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form: FormGroup;
  cities:any[] = [];
  constructor( 
                private fb: FormBuilder,
                private _cities: HotelesService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getCities();
  }

  openModal(){
    this.modal.show();
  }

  createForm(){
    this.form = this.fb.group({
      route: [''],
      type: [''],
      city_id: [''],
      value: [''] 
    })
  }

  getCities(){
    this._cities.getCities().subscribe((r:any) => {
      this.cities = r.data;
    })
  }

}
