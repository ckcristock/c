import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NominaConfigService } from './nomina-config.service';
import 'rxjs/add/observable/forkJoin';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss'],
})
export class NominaComponent implements OnInit {

  renderizarNomina = false;
  extrasDatos: any[] = [];
  incapacidadesDatos: any[] = [];
  novedadesList: any[] = [];
  parafiscalesDatos: any[] = [];
  riesgosArlDatos: any[] = [];
  seguridadEmpresaDatos: any[] = [];
  seguridadFuncionarioDatos: any[] = [];
  incomeDatos: any[] = [];
  deductionsDatos: any[] = [];
  liquidationsDatos: any[] = [];
  salariosSubsidiosDatos: any[] = [];

  constructor(private _nominaConfig:NominaConfigService) {}

  ngOnInit(): void {
    this.getExtras()
    this.getIncapacidades()
    this.getNovedades()
    this.getParafiscales()
    this.getRiesgos()
    this.getSeguridadEmpresa()
    this.getSeguridadFuncionario()
    this.getIncomeDatos()
    this.getDeductionDatos()
    this.getLiquidationDatos()
    this.getsalariosSubsidiosDatos()
    Observable.forkJoin().subscribe(r=>{

    })
  }

  getExtras() {
   this._nominaConfig.getExtras().subscribe((r:any)=>{
    this.extrasDatos = r;
   })
  }
  getIncapacidades() {
    this._nominaConfig.getIncapacidades().subscribe((r:any)=>{
      this.incapacidadesDatos = r
    })
  }
  getNovedades = () =>{
    this._nominaConfig.getNovedades().subscribe((r:any)=>{
      this.novedadesList = r.data
    })
  }
  getParafiscales() {
    this._nominaConfig.getParafiscales().subscribe((r:any)=>{
      this.parafiscalesDatos = r
    })
  }
  getRiesgos() {
    this._nominaConfig.getRiesgos().subscribe((r:any)=>{
      this.riesgosArlDatos = r
    })
  }
  getSeguridadEmpresa() {
    this._nominaConfig.getSeguridadEmpresa().subscribe((r:any)=>{
      this.seguridadEmpresaDatos = r
    })
  }
  getSeguridadFuncionario() {
    this._nominaConfig.getSeguridadFuncionario().subscribe((r:any)=>{
      this.seguridadFuncionarioDatos = r
      this.renderizarNomina = true;
    })
  }
  getIncomeDatos = () => {
    this._nominaConfig.getCountableIncome().subscribe((r:any)=>{
      this.incomeDatos = r
    })
  }
  getDeductionDatos = () => {
    this._nominaConfig.getCountableDeductions().subscribe((r:any)=>{
      this.deductionsDatos = r
    })
  }

  getLiquidationDatos = () => {
    this._nominaConfig.getLiquidation().subscribe((r:any)=>{
      this.liquidationsDatos = r
    })
  }

  getsalariosSubsidiosDatos(){
    this._nominaConfig.getSalariosSubsidios().subscribe((r:any)=>{
      this.salariosSubsidiosDatos = r
    })
  }

  mostrarMensaje(mensaje) {
   /*  setTimeout(() => {
      this.$notify({
        group: "notificacionesNomina",
        title: "Actualización correcta",
        text: mensaje,
      });
    }, 600); */

  }
}
