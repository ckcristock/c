import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfiguracionEmpresaService } from '../configuracion-empresa.service';

@Component({
  selector: 'app-datos-basicos-empresa',
  templateUrl: './datos-basicos-empresa.component.html',
  styleUrls: ['./datos-basicos-empresa.component.scss']
})
export class DatosBasicosEmpresaComponent implements OnInit {
  @ViewChild('modal') modal:any;
  company:any = [];
  form:FormGroup;
  constructor( 
                private _configuracionEmpresaService: ConfiguracionEmpresaService,
                private fb:FormBuilder  
              ) { }

  ngOnInit(): void {
    this.getBasicData();
    this.createForm();
  }

  openModal() {
    this.modal.show();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.company.id],
      social_reason: [''],
      document_type: [''],
      document_number: [''],
      verification_digit: [''],
      constitution_date: [''],
      email_contact: [''],
      phone: ['']
    });
    
  }

  getBasicData() {
    this._configuracionEmpresaService.getCompanyData()
    .subscribe( (res:any) =>{
        this.company = res.data;
        
        this.form.patchValue({
          id: this.company.id,
          social_reason: this.company.social_reason,
          document_type: this.company.document_type,
          document_number: this.company.document_number,
          verification_digit: this.company.verification_digit,
          constitution_date: this.company.constitution_date,
          email_contact: this.company.email_contact,
          phone: this.company.phone
        })
    })
  }

  saveBasicData() {
    this._configuracionEmpresaService.saveCompanyData(this.form.value)
    .subscribe( (res:any) => {
      this.modal.hide();
      this.getBasicData();
      Swal.fire({
        icon: 'success',
        title: 'Actualizado Correctamente'
      });
    });
  }

}
