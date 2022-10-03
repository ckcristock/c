import { Component, OnInit } from '@angular/core';
import { ConfiguracionEmpresaService } from '../../configuracion/configuracion-empresa/configuracion-empresa.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {
  pagination = {
    pageSize: 20,
    page: 1,
    collectionSize: 20,
  }
  
  searching = false;
  searchFailed = false;

  enterprises:any[] = [];

  constructor(private _company: ConfiguracionEmpresaService,) { }

  ngOnInit(): void {
    this.getCompany();
  }

  getCompany(){
    this._company.getCompanyAll().subscribe((res: any) =>{
      this.enterprises = res.data;
      console.log(this.enterprises)
    })
  }
  filters: any = {

    date: '',
    institution: '',
    patient: '',
    speciality: '',

  }



}
