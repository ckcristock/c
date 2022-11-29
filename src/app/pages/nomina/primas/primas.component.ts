import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { PrimasService } from './primas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-primas',
  templateUrl: './primas.component.html',
  styleUrls: ['./primas.component.scss']
})
export class PrimasComponent implements OnInit {
  form: FormGroup;
  loading: boolean = false;
  @ViewChild('modal') modal: any;
  @ViewChild('modalFuncionario') modalFuncionario: any;
  @Input('empleados') empleados;
  years: any[] = [];
  premiums: any[] = [];
  premiumsPeople: any[] = [];
  year = new Date().getFullYear();
  pagination = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal,
    private _primas: PrimasService,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.getPrimasList();
    this.createForm();
    // this.getPrimasList();
    let year = new Date().getFullYear();
    for (let index = year - 5; index <= year; index++) {
      this.years.push(index);
    }
  }

  closeResult = '';
  public openConfirmOld(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openConfirm() {
    //chequear que no exista prima en ese periodo
    let mes = new Date().getMonth();
    let semestre = 1;
    let lapso: string;
    if (mes <= 6) {
      semestre = 1;
      lapso = ' enero - junio ';
    } else {
      semestre = 2;
      lapso = ' julio - diciembre ';

    }
    let params = {
      periodo: semestre,
      yearSelected: this.year,
     /*  fecha_inicio: new Date("01/01/2022"),
      fecha_fin: new Date("06/30/2022") */
    }
    /* let params = {
      periodo: 1,
      yearSelected: 2022,
      fecha_inicio: new Date("01/01/2022"),
      fecha_fin: new Date("06/30/2022")
    } */
    //console.log(params)

    this._primas.checkBonuses(params.yearSelected + '-' + params.periodo).subscribe(res => {
      //chequea en la DB si existe prima de este periodo
      if (res['data'] == null) {
        this.router.navigate(['/nomina/prima', params.yearSelected, params.periodo])
      } else {
        //si existe, si está paga o no
        if (res['data']['status'] == 'pagado') {
          Swal.fire({
            title: 'Prima',
            html: 'Ya se ha pagado las primas del ' + semestre + ' semestre (periodo: ' + lapso + ' ' + this.year + ').' + '<br>' + 'Solo podrá visualizar',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: '#A3BD30',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            confirmButtonText: 'Sí, confirmar'
          })
        } else {

          this._swal.show({
            title: 'Prima',
            text: `Ya se ha generado un listado ¿Desea regenerar las primas del ${semestre} semestre ${params.yearSelected}?(periodo: ${lapso})`,
            icon: 'warning',
            showCancel: true
          }, (res: any) => {
            if (res) {
              if (res) {
                this.router.navigate(['/nomina/prima', params.yearSelected, params.periodo])
              }
            }
          })
        }
      }
    });
  }

  private getDismissReason(reason: any) {
  }

  openModal() {
    this.modal.show();
  }

  createForm() {
    this.form = this.fb.group({
      year: ['', Validators.required],
      periodo: ['', Validators.required]
    })
  }

  openModalFuncionario() {
    this.modalFuncionario.show();
  }

  getPrimasList(page = 1) {
    this.loading = true
    this.pagination.page = page;
    let params = {
      ...this.pagination
    }
    this._primas.getPrimasPaginated(params)
      .subscribe((r: any) => {
        this.loading = false
        this.premiums = r.data.data;
        this.pagination.collectionSize = r.data.total
      })
  }

  VerPrimaFuncionarios(period) {
    let params = {
      period: period,
      yearSelected: period.split('-')[0],
      periodo: period.split('-')[1],
    }
    this._primas.setBonus(params)
      .subscribe((r: any) => {
        if (r.data != null) {
          this.router.navigate(['/nomina/prima', params.yearSelected, params.periodo])
        }
      })
  }

}
