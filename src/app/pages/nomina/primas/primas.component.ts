import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { PrimasService } from './primas.service';

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
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openConfirm2(){

    //chequear que no exista prima en ese periodo
    let mes = new Date().getMonth();
    let semestre = 1;
    let lapso: string ;
    if (mes<=6) {
      semestre = 1;
      lapso = ' enero - junio ';
    } else {
      semestre = 2;
      lapso = ' julio - diciembre ';

    }
    let params = {
      periodo: semestre,
      yearSelected: this.year,
      fecha_inicio: new Date("07/01/2022"),
      fecha_fin: new Date("12/31/2022")
    }
    this._primas.checkBonuses(this.year+'-'+semestre).subscribe(res=>{
      console.log(res)
      if (res['data'] == null) {
        console.log('es nulo');
      } else {
        this._swal.show({
          title: 'Prima',
          text: `Ya se ha generado un listado ¿Desea regenerar las primas del ${semestre} semestre? (periodo: ${lapso})`,
          icon: 'warning',
          showCancel: true
        }, (res: any) =>{
          if (res) {
            if (res) {
              this.router.navigate(['/nomina/prima', params.yearSelected, params.periodo])
            }
          }
        })
      }
    });
    /* this._swal.show({
      title: 'Prima',
      text: `¿Desea pagar primas del ${semestre} semestre? (periodo: ${lapso})`,
      icon: 'warning',
      showCancel: true
    }, ((res)=>{
      if (res) {
        this.router.navigate(['/nomina/prima', params.yearSelected, params.periodo])
      }
    })) */
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

  irAPago() {
    this.modalService.dismissAll();
    let params = {
      periodo: this.form.get('periodo').value,
      yearSelected: this.form.get('year').value,
      fecha_inicio: new Date("07/01/2022"),
      fecha_fin: new Date("12/31/2022")
    }

    this.router.navigate(['/nomina/prima', params.yearSelected, params.periodo])
  }

  getPrimasList() {
    this.loading = true
    this._primas.getBonusList().subscribe((r: any) => {
      this.loading = false
      this.premiums = r.data;
      console.log(r)
    })
  }

  VerPrimaFuncionarios(id_prima) {
    this._primas.getPremiumPeople(id_prima)
      .subscribe((r: any) => {
        this.premiumsPeople = r.data;
        this.modalFuncionario.show();
    })
  }

}
