import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';

@Component({
  selector: 'app-accommodations',
  templateUrl: './accommodations.component.html',
  styleUrls: ['./accommodations.component.scss']
})
export class AccommodationsComponent implements OnInit {
  @Input('data') values : any;
  loading: boolean = false;
  pagination = {
    pageSize: 10,
    page: 1,
    collectionSize: 0
  }
  filtro: any = {
    value: ''
  }
  value: any = {}
  form: FormGroup
  title: string = 'Agregar';

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.value.id],
      name: ['', Validators.required]
    })
  }

  getValues(){
    console.log('getValues');
  }

  save(){
    console.log('guardando')
  }
}
