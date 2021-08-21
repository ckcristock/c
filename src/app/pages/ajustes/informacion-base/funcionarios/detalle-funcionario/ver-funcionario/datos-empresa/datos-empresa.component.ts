import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatosEmpresaService } from './datos-empresa.service';

@Component({
  selector: 'app-datos-empresa',
  templateUrl: './datos-empresa.component.html',
  styleUrls: ['./datos-empresa.component.scss']
})
export class DatosEmpresaComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form: FormGroup;
  id:any;
  data:any;
  empresa: any = {
    turn_type: '',
    position_name: '',
    dependency_name: '',
    group_name: '',
    fixed_turn_name: '',
    company_name: ''
  };
  constructor( private fb:FormBuilder, 
                private enterpriseData: DatosEmpresaService,
                private activatedRoute: ActivatedRoute
            ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getEnterpriseData();
    this.createForm();
  }

  openModal(){
    this.modal.show();
  }

  getEnterpriseData(){
    this.enterpriseData.getEnterpriseData(this.id)
    .subscribe( (res:any) =>{
      this.data = res.data
      for (const dm of this.data) {
        this.empresa = dm;
      }
    })
  }

  createForm(){
    this.form = this.fb.group({
      dependency: ['', Validators.required],
      risks: ['', Validators.required],
      assigned_turn: ['', Validators.required],
      position: ['', Validators.required],
      turn: ['', Validators.required],
    }); 
  }

  get dependency_valid(){
    return (
      this.form.get('dependency') && this.form.get('dependency').touched
    );
  }

  get risks_valid(){
    return (
      this.form.get('risks') && this.form.get('risks').touched
    );
  }

  get assigned_turn_valid(){
    return (
      this.form.get('assigned_turn') && this.form.get('assigned_turn').touched
    );
  }

  get position_valid(){
    return (
      this.form.get('position') && this.form.get('position').touched
    );
  }

  get turn_valid(){
    return (
      this.form.get('turn') && this.form.get('turn').touched
    );
  }

}
