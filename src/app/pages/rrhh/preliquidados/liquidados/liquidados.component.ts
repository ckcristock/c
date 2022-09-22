import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Router, ActivatedRoute } from '@angular/router';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import Swal from 'sweetalert2';
import { LiquidadosService } from './liquidados.service';

@Component({
  selector: 'app-liquidados',
  templateUrl: './liquidados.component.html',
  styleUrls: ['./liquidados.component.scss']
})
export class LiquidadosComponent implements OnInit {
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
  liquidado: any = []
  loading: boolean = false;
  classList = 'list-group-item d-flex list-group-item-action justify-content-between align-items-center'
  form: FormGroup;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private liquidadosService: LiquidadosService,
    private _swal: SwalService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getLiquidado();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      motivo: ['', Validators.required],
      justacausa: ['', Validators.required],
      fechacontratacion: ['', Validators.required],
      fechaterminacion: ['', Validators.required],
      diasliquidar: ['', Validators.required],
      diasvacaciones: ['', Validators.required],
      vacacionesacumuladas: ['', Validators.required],
      salariobase: ['', Validators.required],
      vacaciones: ['', Validators.required],
      cesantias: ['', Validators.required],
      dominicalesincluidas: ['', Validators.required],
      cesantiasanterior: ['', Validators.required],
      interesescesantias: ['', Validators.required],
      otrosingresos: ['', Validators.required],
      prestamos: ['', Validators.required],
      otrasdeducciones: ['', Validators.required],
      notas: ['', Validators.required],
    })
  }

  getLiquidado() {
    this.loading = true
    this.liquidadosService.getLiquidado(this.id)
      .subscribe((res: any) => {
        this.liquidado = res.data
        let f1 = new Date(this.liquidado.work_contract.date_of_admission)
        let f2 = new Date(this.liquidado.work_contract.date_end ? this.liquidado.work_contract.date_end : '2022-09-22')
        let dias = f2.getTime() - f1.getTime()
        console.log(f1, f2)
        this.loading = false;
        this.form.patchValue({
          fechacontratacion: this.liquidado.work_contract.date_of_admission,
          fechaterminacion: this.liquidado.work_contract.date_end ? this.liquidado.work_contract.date_end : '2022-09-22',
          salariobase: this.liquidado.work_contract.salary,
          diasliquidar: Math.round(dias/ (1000*60*60*24))
        })
      })
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
