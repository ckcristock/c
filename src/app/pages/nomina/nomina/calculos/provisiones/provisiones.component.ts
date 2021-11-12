import { Component, Input, OnInit } from '@angular/core';
import { PayRollProvisionsService } from './pay-roll-privisions.service';

@Component({
  selector: 'app-provisiones',
  templateUrl: './provisiones.component.html',
  styleUrls: ['./provisiones.component.scss']
})
export class ProvisionesComponent implements OnInit {

  @Input('funcionarioProp') funcionarioProp
  @Input('datosEmpresaProp') datosEmpresaProp
  @Input('fechaInicio') fechaInicio
  @Input('fechaFin') fechaFin

  funcionario: any = {}
  datosEmpresa: any = {}
  mostrarCalculo = false
  provisionesDatos: any

  constructor( private _payrollProv : PayRollProvisionsService) { }

  ngOnInit(): void {

    this.funcionario = this.funcionarioProp;
    this.datosEmpresa = this.datosEmpresaProp;
    this.getProvisionesDatos();
   
  }

   getProvisionesDatos() {
    this._payrollProv.getProvisions({
      pid:this.funcionario.id,
      inicio:this.fechaInicio,
      fin:this.fechaFin,
      }).subscribe( r=> {
        console.log(r,'asdasd');
        this.provisionesDatos = r;
      this.mostrarCalculo = true;
        
      })
  }

}
