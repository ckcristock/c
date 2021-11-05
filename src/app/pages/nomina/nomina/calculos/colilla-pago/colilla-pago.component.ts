import { Component, Input, OnInit } from '@angular/core';
import { PayRollDetailService } from './pay-roll-detail.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-colilla-pago',
  templateUrl: './colilla-pago.component.html',
  styleUrls: ['./colilla-pago.component.scss'],
})
export class ColillaPagoComponent implements OnInit {
  @Input('datosEmpresa') datosEmpresa;
  @Input('funcionario') funcionario;
  @Input('fechaInicio') fechaInicio;
  @Input('fechaFin') fechaFin;
  params: any = {};
  horasExtrasDatos: any = {};
  porcentajesExtrasDatos: any = {};
  salarioDatos: any = {};
  novedadesDatos: any = {};
  ingresosDatos: any = {};
  retencionesDatos: any = {};
  deduccionesDatos: any = {};
  netoApagar: any = {};
  nominaSeguridadFuncionario: any = {};
  loading = true;
  brand = false;
  constructor(
    private _payrollDetail: PayRollDetailService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.params = this.route.snapshot.params;
    this.getNominaSeguridadFuncionario();

    this.getHorasExtrasDatos();
    this.getHorasExtrasPorcentajes();
    this.getNovedadesDatos();
    this.getSalarioDiasTrabajados();
    this.getIngresosDatos();
    this.getRetencionesDatos();
    this.getDeduccionesDatos();
    this.getPagoNeto();

    this.brand = this.getPeriodo();
  }

  getPeriodo() {
    
    return moment().get('date') > 15;
  }

  get hasNovedad(){
    
    return Object.keys(this.novedadesDatos.novedades).length > 0
  }

  async getNominaSeguridadFuncionario() {
    
    this._payrollDetail.getSocialSecurity().subscribe( (r:any ) =>{
      this.nominaSeguridadFuncionario = r;
    })

  }
  getHorasExtrasDatos() {
    this._payrollDetail.getOvertimes(this.params).subscribe((r: any) => {
      this.horasExtrasDatos = r;
    });
  }

  getHorasExtrasPorcentajes() {
    this._payrollDetail.getOvertimesPercentages().subscribe((r: any) => {
      this.porcentajesExtrasDatos = r;
    });
  }
  getSalarioDiasTrabajados() {
    this._payrollDetail.getSalary(this.params).subscribe((r: any) => {
      this.salarioDatos = r;
    });
  }

  getNovedadesDatos() {
    this._payrollDetail.getFactors(this.params).subscribe((r: any) => {
      this.novedadesDatos = r;
    });
  }

  getIngresosDatos() {
    this._payrollDetail.getIncomes(this.params).subscribe((r: any) => {
      this.ingresosDatos = r;
    });
  }
  getRetencionesDatos() {
    this._payrollDetail.getRetentions(this.params).subscribe((r: any) => {
      this.retencionesDatos = r;
    });
  }
  getDeduccionesDatos() {
    this._payrollDetail.getDeductions(this.params).subscribe((r: any) => {
      this.deduccionesDatos = r;
    });
  }

  async getPagoNeto() {
    await this._payrollDetail
      .getNetPay(this.params)
      .toPromise()
      .then((r: any) => {
        this.netoApagar = r.total_valor_neto;
        this.loading = false;
      });
      
  }

  /**
   * ,
   
   ,
   ,

    async getNominaSeguridadFuncionario() {
      const resp = await axios.get(
        `/api/${localStorage.getItem(
          "tenant"
        )}/get-nomina-seguridad-funcionario`
      );
      this.nominaSeguridadFuncionario = resp.data;
    },

    getPeriodo() {
      return moment().get("date") > 15;
    }
   */
}
