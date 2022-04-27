import { Component, OnInit } from '@angular/core';
import { NominaConfigService } from './nomina-config.service';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss'],
})
export class NominaComponent implements OnInit {
  
  renderizarNomina = false;
  extrasDatos: any[] = [];
  incapacidadesDatos: any[] = [];
  parafiscalesDatos: any[] = [];
  riesgosArlDatos: any[] = [];
  seguridadEmpresaDatos: any[] = [];
  seguridadFuncionarioDatos: any[] = [];

  constructor(private _nominaConfig:NominaConfigService) {}

  ngOnInit(): void {
    this.getExtras()
    this.getIncapacidades()
    this.getParafiscales()
    this.getRiesgos()
    this.getSeguridadEmpresa()
    this.getSeguridadFuncionario()
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
