import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';
import { consts } from 'src/app/core/utils/consts';
import Swal from 'sweetalert2';
import { SwalService } from '../../../../services/swal.service';
import { BonoService } from './bono.service';

@Component({
  selector: 'app-bono',
  templateUrl: './bono.component.html',
  styleUrls: ['./bono.component.scss']
})
export class BonoComponent implements OnInit {
  form: FormGroup;
  @ViewChild('modal') modal: any;
  @ViewChild('add') add: any;
  @Input('id') id: any;
  bonusTypes: any = consts.bonusType;
  loading: boolean;
  bonus: any;
  bonu: any = [
    {
      concept: '',
      value: ''
    }
  ];
  constructor(
    private fb: FormBuilder,
    private bonusService: BonoService,
    private _swal: SwalService,
    private _modal: ModalService,
  ) { }

  ngOnInit(): void {
    this.createFormBonus();
    this.getBonusData();
  }

  openModal() {
    this._modal.open(this.add);
    this.form.patchValue({
      countable_income_id: '',
      value: '',
      work_contract_id: this.id
    });
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
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: 'El bono se inhabilitará',
      icon: 'question',
      showCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.bonusService.addBonus(data)
          .subscribe(res => {
            this.getBonusData();
            this._swal.show({
              title: 'Bono inhabilitado',
              text: 'El bono ha sido inhabilitado con éxito',
              icon: 'success',
              showCancel: false,
              timer: 1000
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
        this._modal.close();
        this.getBonusData();
        this._swal.show({
          title: 'Creado con éxito',
          icon: 'success',
          text: '',
          timer: 1000,
          showCancel: false
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
