import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @ViewChild('modal') modal:any;
  @Input('id') id:any;
  bonusTypes:any = consts.bonusType;
  bonus: any;
  bonu:any = [
    {
    concept: '',
    value: ''
  }
];
  constructor( 
              private fb: FormBuilder,
              private bonusService: BonoService,
              ) { }

  ngOnInit(): void {
    this.createFormBonus();
    this.getBonusData();
  }

  openModal(){
    this.modal.show();
    this.form.patchValue({
      countable_income_id: '',
      value: '',
      work_contract_id: ''
    });
  }

  createFormBonus(){
    this.form = this.fb.group({
      countable_income_id: ['', Validators.required],
      value: ['', Validators.required],
      work_contract_id:[this.id]
    });
  }

  anular(bonus, status){
    let data:any = {
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
        .subscribe( res =>{
          this.getBonusData();
          Swal.fire({
            title: 'Bono inhabilitado' ,
            text: 'El bono ha sido inhabilitado con éxito',
            icon: 'success'
          })
        })
      }
    }) 
  }

  getBonusList(bonusType){
    this.bonusService.getBonusList({bonusType})
      .subscribe( (res:any) => {
        this.bonus = res.data;
      });
  }

  getBonusData(){
    this.bonusService.getBonusData({id: this.id})
    .subscribe( (res:any) => {
      this.bonu = res.data;
    });
  }

  addBonus(){
    this.form.markAllAsTouched();
    if (this.form.invalid) { return false;}
    this.bonusService.addBonus(this.form.value)
    .subscribe( res => {
      this.modal.hide();
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
      
get bonus_type_valid(){
  return (
  this.form.get('countable_income_id').invalid && this.form.get('countable_income_id').touched
  );
}

get value_valid(){
  return (
    this.form.get('value').invalid && this.form.get('value').touched
  );
}

}
