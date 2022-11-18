import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NominaConfigService } from './nomina-config.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss'],
})
export class NominaComponent implements OnInit {

  public openResponsable: Subject<any> = new Subject;
  public openIngreso: Subject<any> = new Subject;
  public openEgreso: Subject<any> = new Subject;

  responsableNominaDatos: any[] = [];
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
    responsables: true,
    extras: true,
    incapacidades: true,
    novedades: true,
    parafiscales: true,
    riesgos: true,
    segEmpresa: true,
    segFuncionario: true,
    ingresos: true,
    egresos: true,
    liquidacion: true,
    salariosSubsidios: true,
  };

  form: FormGroup;
  renderNomina: boolean;
  data: any;

  constructor(
    private _nominaConfig:NominaConfigService,
    ) {}

  ngOnInit(): void {
    this.getParametrosAll()
/*     this.getResponsablesNomina()
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
    this.getsalariosSubsidiosDatos() */
  }

  getParametrosAll(){
    this.renderNomina = true
    this._nominaConfig.getAllParams()
    .subscribe((res:any)=>{
      this.data = res.data

      this.responsableNominaDatos = res.data.responsables
      this.loading.responsables = false

      this.extrasDatos = res.data.extras
      this.loading.extras = false

      this.incapacidadesDatos = res.data.incapacidades
      this.loading.incapacidades = false

      this.novedadesList = res.data.novedades
      this.loading.novedades = false

      this.parafiscalesDatos = res.data.parafiscales
      this.loading.parafiscales = false

      this.riesgosArlDatos = res.data.riesgos
      this.loading.riesgos = false

      this.seguridadEmpresaDatos = res.data.segSocEmp
      this.loading.segEmpresa = false

      this.seguridadFuncionarioDatos = res.data.segSocFunc
      this.loading.segFuncionario = false

      this.incomeDatos = res.data.ingresos
      this.loading.ingresos = false

      this.deductionsDatos = res.data.egresos
      this.loading.egresos = false

      this.liquidationsDatos = res.data.liquidacion
      this.loading.liquidacion = false

      this.salariosSubsidiosDatos = res.data.salarios
      this.loading.salariosSubsidios = false

      this.renderNomina = false
    })
  }

  openModal(open){
    open.next();
  }

  getResponsablesNomina = () => {
    this.loading.responsables = true
    this._nominaConfig.getResponsablesNomina()
    .subscribe((res:any)=>{
      this.responsableNominaDatos = res.data
      this.loading.responsables = false;
    })
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
    this.loading.egresos = true
    this._nominaConfig.getCountableDeductions().subscribe((r:any)=>{
      this.deductionsDatos = r
      this.loading.egresos = false
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
