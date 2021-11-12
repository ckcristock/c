import { Component, Input, OnInit } from '@angular/core';
import { PayRollDetailService } from '../colilla-pago/pay-roll-detail.service';
import { PayRollSocialSecurityService } from './pay-roll-social-security.service';

@Component({
  selector: 'app-seguridad-parafiscales',
  templateUrl: './seguridad-parafiscales.component.html',
  styleUrls: ['./seguridad-parafiscales.component.scss']
})
export class SeguridadParafiscalesComponent implements OnInit {

  @Input('funcionarioProp') funcionarioProp
  @Input('datosEmpresaProp') datosEmpresaProp
  @Input('fechaInicio') fechaInicio
  @Input('fechaFin') fechaFin

  funcionario: any = {}
  datosEmpresa: any = {}
  mostrarCalculo = false
  retencionesDatos: any = {}
  seguridadDatos: any = {}
  porcentajesDatos: any = {}

  constructor(private _payRolSocial: PayRollSocialSecurityService,
    private _payRollDetail: PayRollDetailService) { }

  ngOnInit(): void {
    this.datosEmpresa = this.datosEmpresaProp
    this.funcionario = this.funcionarioProp
    this.getRetencionesDatos()
    this.getSeguridadDatos()
    this.getPorcentajesDatos()
    setTimeout(() => {
      this.mostrarCalculo = true
    }, 1500)
  }

  getRetencionesDatos() {
    this._payRollDetail.getRetentions({
      pid: this.funcionario.id,
      inicio: this.fechaInicio,
      fin: this.fechaInicio
    }).subscribe(r => {
      this.retencionesDatos = r
  
      
    })
  }

  getSeguridadDatos() {
    this._payRolSocial.getScurity({
      pid: this.funcionario.id,
      inicio: this.fechaInicio,
      fin: this.fechaInicio
    }).subscribe(r => {
      this.seguridadDatos = r
      console.log(r);
      
      
    })
  }
  
  async getPorcentajesDatos() {
    this._payRolSocial.getScurityPercentages({
      pid: this.funcionario.id
    }).subscribe(r => {
      console.log(r);
      this.porcentajesDatos = r
  
    })
  }
}
