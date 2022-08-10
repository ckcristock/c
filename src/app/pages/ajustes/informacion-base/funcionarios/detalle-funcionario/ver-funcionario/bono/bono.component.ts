import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { consts } from 'src/app/core/utils/consts';
import Swal from 'sweetalert2';
import { BonoService } from './bono.service';

@Component({
  selector: 'app-bono',
  templateUrl: './bono.component.html',
  styleUrls: ['./bono.component.scss']
})
export class BonoComponent implements OnInit {
  form: FormGroup;
  @ViewChild('modal') modal: any;
  @Input('id') id: any;
  bonusTypes: any = consts.bonusType;
  bonus: any;
  loading: boolean = false;
  bonu: any = [
    {
      concept: '',
      value: ''
    }
  ];
  constructor(
    private fb: FormBuilder,
    private bonusService: BonoService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createFormBonus();
    this.getBonusData();
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.form.patchValue({
      countable_income_id: '',
      value: '',
      work_contract_id: this.id
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

  createFormBonus() {
    this.form = this.fb.group({
      countable_income_id: ['', Validators.required],
      value: ['', Validators.required],
      work_contract_id: [this.id]
    });
  }

  anular(bonus, status) {
    let data: any = {
      id: bonus.id,
      status
    }
    Swal.fire({
      title: '¿Estas seguro?',
      text: 'El bono se inhabilitará',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Inhabilitar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bonusService.addBonus(data)
          .subscribe(res => {
            this.getBonusData();
            Swal.fire({
              title: 'Bono inhabilitado',
              text: 'El bono ha sido inhabilitado con éxito',
              icon: 'success'
            })
          })
      }
    })
  }

  getBonusList(bonusType) {
    this.bonusService.getBonusList({ bonusType })
      .subscribe((res: any) => {
        this.bonus = res.data;
      });
  }

  getBonusData() {
    this.loading = true;
    this.bonusService.getBonusData({ id: this.id })
      .subscribe((res: any) => {
        this.bonu = res.data;
        this.loading = false;
      });
  }

  addBonus() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { return false; }
    this.bonusService.addBonus(this.form.value)
      .subscribe(res => {
        this.modalService.dismissAll(); 
        this.getBonusData();
        Swal.fire({
          icon: 'success',
          title: 'Creado con éxito',
          text: 'Se han actualizado los cambios correctamente'
        })
      })
  }

  /* get bonus_valid(){
    return (
      this.form.get('bonusType').invalid && this.form.get('bonusType').touched
    );
  } */

  get bonus_type_valid() {
    return (
      this.form.get('countable_income_id').invalid && this.form.get('countable_income_id').touched
    );
  }

  get value_valid() {
    return (
      this.form.get('value').invalid && this.form.get('value').touched
    );
  }

}
