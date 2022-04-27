import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfiguracionEmpresaService } from '../configuracion-empresa.service';
import { configEmpresa } from '../configuracion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-datos-pila',
  templateUrl: './datos-pila.component.html',
  styleUrls: ['./datos-pila.component.scss']
})
export class DatosPilaComponent implements OnInit {
  @ViewChild('modal') modal: any;
  form: FormGroup;
  arls: any = [];
  pilas: any = [];
  pay_operators = configEmpresa.pay_operator;
  arl: any;
  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getPilaData();
    this.getArl();
  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openModal() {
    this.modal.show();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.pilas.id],
      paid_operator: [''],
      law_1429: [''],
      law_590: [''],
      law_1607: [''],
      arl_id: ['']
    });
  }

  getArl() {
    this._configuracionEmpresaService.getArl()
      .subscribe((res: any) => {
        this.arls = res.data;
      })
  }

  getPilaData() {
    this._configuracionEmpresaService.getCompanyData()
      .subscribe((res: any) => {
        this.pilas = res.data;
        this.arl = res.data.arl.name;
        this.form.patchValue({
          id: this.pilas.id,
          paid_operator: this.pilas.paid_operator,
          law_1429: this.pilas.law_1429,
          law_590: this.pilas.law_590,
          law_1607: this.pilas.law_1607,
          arl_id: this.pilas.arl_id
        });
      })
  }

  savePilaData() {
    this._configuracionEmpresaService.saveCompanyData(this.form.value)
      .subscribe((res: any) => {
        this.getPilaData();
        this.modalService.dismissAll(); 
        Swal.fire({
          icon: 'success',
          title: 'Actualizado Correctamente'
        })
      })
  }

}
