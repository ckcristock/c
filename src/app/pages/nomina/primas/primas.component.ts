import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PrimasService } from './primas.service';

@Component({
  selector: 'app-primas',
  templateUrl: './primas.component.html',
  styleUrls: ['./primas.component.scss']
})
export class PrimasComponent implements OnInit {
  form: FormGroup;
  loading:boolean;
  @ViewChild('modal') modal:any;
  @ViewChild('modalFuncionario') modalFuncionario:any;
  years:any[] = [];
  premiums:any[] = [];
  premiumsPeople:any[] = [];
  constructor( 
                private fb: FormBuilder,
                private router: Router,
                private _primas: PrimasService
              ) { }

  ngOnInit(): void {
    this.createForm();
    // this.getPrimasList();
    let year = new Date().getFullYear();
    for (let index = year-1; index < year+5; index++) {
      this.years.push(index);
    }
  }

  openModal(){
    this.modal.show();
  }

  createForm(){
    this.form = this.fb.group({
      year: ['', Validators.required],
      periodo: ['', Validators.required]
    })
  }

  openModalFuncionario(){
    this.modalFuncionario.show();
  }

  irAPago(){
    let periodo = this.form.get('periodo').value;
    let yearSelected = this.form.get('year').value;
    this.router.navigate(['/nomina/prima', yearSelected, periodo])
  }

  getPrimasList(){
    this._primas.getPremiumList().subscribe((r:any) => {
      this.premiums = r.data;
    })
  }

  VerPrimaFuncionarios(id_prima){
    this._primas.getPremiumPeople(id_prima).subscribe((r:any) => {
      this.premiumsPeople = r.data;
      this.modalFuncionario.show();
    })
  }

}
