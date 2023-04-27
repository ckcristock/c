import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Router, ActivatedRoute } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import Swal from 'sweetalert2';
import { LiquidadosService } from './liquidados.service';
import { consts } from 'src/app/core/utils/consts';


@Component({
  selector: 'app-liquidados',
  templateUrl: './liquidados.component.html',
  styleUrls: ['./liquidados.component.scss']
})
export class LiquidadosComponent implements OnInit {
  mask = consts
  @ViewChild('stepper') stepper: MatHorizontalStepper;
  /* ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  } */
  goBack() {
    this.stepper.previous();
  }

  goForward() {
    this.stepper.next();
  }
  public datosCabecera: any = {
    Titulo: 'Liquidación del funcionario',
    Fecha: new Date()
  }
  id: any;
  diasTrabajados: any;
  liquidado: any = [];
  info: any = [];
  date = new Date().toISOString().split('T')[0];
  loading: boolean = false;
  classList = 'list-group-item d-flex list-group-item-action justify-content-between align-items-center'
  form: FormGroup;
  indemnizacion: boolean;

  valorDiasTrabajados: any[] = [];

  totalLiquidacion: number = 0;
  total: number = 0;
  salarioPendiente: number = 0;


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private liquidadosService: LiquidadosService,
    private _swal: SwalService,
    private fb: FormBuilder,
    private currencyPipe: CurrencyPipe,
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.diasTrabajados = this.activatedRoute.snapshot.params.value;
    this.getLiquidado();
    this.createForm();
  }


  liquidar() {
    this.liquidadosService.liquidar(this.form.value).subscribe((res: any) => {
      this.router.navigate(['/rrhh/liquidados'])
      this._swal.show({
        icon: 'success',
        title: res.data,
        showCancel: false,
        text: '',
        timer: 1000
      })
    })
  }

  createForm() {
    this.form = this.fb.group({
      person_id: [this.id, Validators.required],
      motivo: ['', Validators.required],
      justa_causa: ['', Validators.required],
      fecha_contratacion: ['', Validators.required],
      fecha_terminacion: ['', Validators.required],
      dias_liquidados: ['', Validators.required],
      dias_vacaciones: ['', Validators.required],
      /* vacacionesacumuladas: ['', Validators.required], */
      salario_base: ['', Validators.required],
      vacaciones_base: ['', Validators.required],
      cesantias_base: ['', Validators.required],
      dominicales_incluidas: ['', Validators.required],
      cesantias_anterior: ['', Validators.required],
      intereses_cesantias: ['', Validators.required],
      otros_ingresos: ['', Validators.required],
      prestamos: ['', Validators.required],
      otras_deducciones: ['', Validators.required], //ya verás como solucionas
      notas: ['', Validators.required],
      ingresos_adicionales: [0],
      deducciones_adicionales: [0],
      valor_dias_vacaciones: ['', Validators.required],
      valor_cesantias: ['', Validators.required],
      valor_prima: ['', Validators.required],
      sueldo_pendiente: [''],
      auxilio_pendiente: [''],
      otros: [''],
      salud: [''],
      pension: [''],
      total: [''],

    })

  }

  getLiquidado() {
    this.loading = true
    this.liquidadosService.getLiquidado(this.id)
      .subscribe((res: any) => {
        this.liquidado = res.data
        this.loading = false;
        let fechaFin = this.liquidado.work_contract.date_end ? this.liquidado.work_contract.date_end : this.date
        this.form.patchValue({
          fecha_terminacion: fechaFin,
        })
        this.changeParams(fechaFin)
        if (this.diasTrabajados == 'si') {
          this.getDiasTrabajados(fechaFin);
        }
      })
  }



  changeParams(fechaFin) {
    this.liquidadosService.mostrar(this.id, fechaFin).subscribe((res: any) => {
      this.info = res
      this.totalLiquidacion = this.info.total_liquidacion


      this.form.get('ingresos_adicionales').valueChanges.subscribe(value => {
        this.calcularTotalLiquidacion();
        // this.form.patchValue({
        //   total: this.form.get('total').value + value
        //})
      })

      this.form.get('deducciones_adicionales').valueChanges.subscribe(value => {
        this.calcularTotalLiquidacion();
      })

      this.form.patchValue({
        fecha_contratacion: res.fecha_ingreso,
        dias_vacaciones: res.vacaciones_actuales,
        vacaciones_base: res.base_vacaciones,
        cesantias_base: res.base_cesantias,
        dias_liquidados: res.dias_liquidacion,
        salario_base: res.salario,
        fecha_terminacion: res.fecha_retiro,
        prestamos: res.prestamos,
        otros_ingresos: res.total_ingresos,
        otras_deducciones: res.total_egresos,
        valor_cesantias: res.total_cesantias,
        valor_prima: res.total_prima,

      })


    })
  }

  getDiasTrabajados(fechaFin) {
    this.liquidadosService.getDiasTrabajados(this.id, fechaFin).subscribe((res: any) => {
      this.valorDiasTrabajados = res.data

      this.salarioPendiente = res.data.salario_neto
      this.total = this.salarioPendiente + this.totalLiquidacion


      this.form.patchValue({
        sueldo_pendiente: res.data.salario_neto,
        salud: res.data.seguridad_social,
        total: this.total
      })
    })
  }



  calcularTotalLiquidacion() {
    let IngresosAdicionales = this.form.get('ingresos_adicionales').value || 0;
    let DeduccionesAdicionales = this.form.get('deducciones_adicionales').value || 0;
    this.totalLiquidacion = this.info.total_liquidacion + IngresosAdicionales - DeduccionesAdicionales;
    this.total = this.totalLiquidacion + this.salarioPendiente

  }



  justaCausaValidate(event) {
    if (event.value == 'si') {
      this.indemnizacion = false;

      this.total = this.totalLiquidacion + this.salarioPendiente

    } else if (event.value == 'no') {
      this.indemnizacion = true;
      this.total = this.info.total_indemnizacion + this.totalLiquidacion + this.salarioPendiente
    }

  }




  cancelButton() {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: 'Se cancelará la liquidación.',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/rrhh/liquidados']);
      }
    })
  }



}
