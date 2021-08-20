import { Component, OnInit } from '@angular/core';
import { Router, Routes } from '@angular/router';

@Component({
  selector: 'app-detalle-funcionario',
  templateUrl: './detalle-funcionario.component.html',
  styleUrls: ['./detalle-funcionario.component.scss']
})
export class DetalleFuncionarioComponent implements OnInit {
  habilitado = true;
  components = 'informacion';
  constructor( private router: Router ) { }

  ngOnInit(): void {
  }

  regresar(){
    this.router.navigate(['/ajustes/informacion-base/funcionarios']);
  }

  verComponent( componente:string ){
    this.components = componente;
  }
  
}
