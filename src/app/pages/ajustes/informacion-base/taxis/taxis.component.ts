import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-taxis',
  templateUrl: './taxis.component.html',
  styleUrls: ['./taxis.component.scss']
})
export class TaxisComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form: FormGroup;
  constructor( private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.createForm();
  }

  openModal(){
    this.modal.show();
  }

  createForm(){
    this.form = this.fb.group({
      route: ['']
    })
  }

}
