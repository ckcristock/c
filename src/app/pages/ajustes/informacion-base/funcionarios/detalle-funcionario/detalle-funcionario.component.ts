import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { DetalleService } from './detalle.service';

@Component({
  selector: 'app-detalle-funcionario',
  templateUrl: './detalle-funcionario.component.html',
  styleUrls: ['./detalle-funcionario.component.scss']
})
export class DetalleFuncionarioComponent implements OnInit {
  habilitado = true;
  components = 'informacion';
  id: any;
  fun:any;
  funcionario: any = {
    salary: '',
    work_contract: '',
    first_name: '',
    first_surname: '',
    image: '',
    second_name: '',
    second_surname: '',
    signature: '',
    title: ''
  };
  constructor( private router: Router, private detalleService: DetalleService, private activateRoute: ActivatedRoute ) { }



  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.getBasicData();
  }

  regresar(){
    this.router.navigate(['/ajustes/informacion-base/funcionarios']);
  }

  verComponent( componente:string ){
    this.components = componente;
  }

  getBasicData(){
    this.detalleService.getBasicData(this.id)
    .subscribe( (res:any) => {
        this.funcionario = res.data;
    });
  }
  
}
