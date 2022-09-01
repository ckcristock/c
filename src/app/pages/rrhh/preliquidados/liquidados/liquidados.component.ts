import { Component, OnInit, ViewChild } from '@angular/core';
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
  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }
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
  liquidado: any = {
    first_name: '',
    second_name: '',
    first_surname: '',
    second_surname: ''
  };
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private liquidadosService: LiquidadosService,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getLiquidado();
  }

  getLiquidado() {
    this.liquidadosService.getLiquidado(this.id)
      .subscribe((res: any) => {
        this.liquidado = res.data
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
