import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NominaConfigService } from './nomina-config.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss'],
})
export class NominaComponent implements OnInit {

  public openIngreso: Subject<any> = new Subject;
  public openEgreso: Subject<any> = new Subject;
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
  loading:any = {
    extras: false,
    incapacidades: false,
    novedades: false,
    parafiscales: false,
    riesgos: false,
    segEmpresa: false,
    segFuncionario: false,
    ingresos: false,
    egresos: false,
    liquidacion: false,
    salariosSubsidios: false,
  };

  form: FormGroup;

  constructor(
    private _nominaConfig:NominaConfigService,
    private fb: FormBuilder
    ) {}

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
    this.renderizarNomina = true;
  }

  openModal(open){
    open.next();
  }

  getExtras() {
    this.loading.extras = true
    this._nominaConfig.getExtras().subscribe((r:any)=>{
      this.extrasDatos = r;
      this.loading.extras = false
    })
  }
  getIncapacidades() {
    this.loading.incapacidades = true
    this._nominaConfig.getIncapacidades().subscribe((r:any)=>{
      this.incapacidadesDatos = r
      this.loading.incapacidades = false
    })
  }
  getNovedades = () =>{
    this.loading.novedades = true
    this._nominaConfig.getNovedades().subscribe((r:any)=>{
      this.novedadesList = r.data
      this.loading.novedades = false
    })
  }
  getParafiscales() {
    this.loading.parafiscales = true
    this._nominaConfig.getParafiscales().subscribe((r:any)=>{
      this.parafiscalesDatos = r
      this.loading.parafiscales = false
    })
  }
  getRiesgos() {
    this.loading.riesgos = true
    this._nominaConfig.getRiesgos().subscribe((r:any)=>{
      this.riesgosArlDatos = r
      this.loading.riesgos = false
    })
  }
  getSeguridadEmpresa() {
    this.loading.segEmpresa = true
    this._nominaConfig.getSeguridadEmpresa().subscribe((r:any)=>{
      this.seguridadEmpresaDatos = r
      this.loading.segEmpresa = false
    })
  }
  getSeguridadFuncionario() {
    this.loading.segFuncionario = true
    this._nominaConfig.getSeguridadFuncionario().subscribe((r:any)=>{
      this.seguridadFuncionarioDatos = r
      this.loading.segFuncionario = false
      
    })
  }
  getIncomeDatos = () => {
    this.loading.ingresos = true;
    this._nominaConfig.getCountableIncome().subscribe((r:any)=>{
      this.incomeDatos = r
      this.loading.ingresos = false;
    })
  }
  getDeductionDatos = () => {
    this.loading.deductionsDatos = true
    this._nominaConfig.getCountableDeductions().subscribe((r:any)=>{
      this.deductionsDatos = r
      this.loading.deductionsDatos = false
    })
  }
  
  getLiquidationDatos = () => {
    this.loading.liquidacion = true
    this._nominaConfig.getLiquidation().subscribe((r:any)=>{
      this.liquidationsDatos = r
      this.loading.liquidacion = false
    })
  }
  
  getsalariosSubsidiosDatos(){
    this.loading.salariosSubsidios = true
    this._nominaConfig.getSalariosSubsidios().subscribe((r:any)=>{
      this.salariosSubsidiosDatos = r
      this.loading.salariosSubsidios = false
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
