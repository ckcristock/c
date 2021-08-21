import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonDataService } from '../personData.service';
import { consts } from 'src/app/core/utils/consts';
import { SeveranceFundsService } from '../../../services/severanceFounds.service';
import { PensionFundsService } from '../../../services/pensionFunds.service';
import { CompensationFundsService } from '../../../services/compensationFunds.service';
import { EpssService } from '../../../services/epss.service';

@Component({
  selector: 'app-prestaciones-sociales',
  templateUrl: './prestaciones-sociales.component.html',
  styleUrls: ['./prestaciones-sociales.component.scss']
})
export class PrestacionesSocialesComponent implements OnInit {
  @Output('siguiente') siguiente = new EventEmitter();
  @Output('anterior') anterior = new EventEmitter();

  compensationFunds: any[]
  severanceFunds: any[]
  pensionFunds: any[]
  epss: any[]

  person: any;
  $person: Subscription;
  formPrestation: FormGroup
  constructor(
    private _person: PersonDataService,
    private fb: FormBuilder,
    private _severanceFund: SeveranceFundsService,
    private _pensionFund: PensionFundsService,
    private _compensationFund: CompensationFundsService,
    private _epss: EpssService,
  ) { }

  ngOnInit(): void {
    this.crearForm()
    this.$person = this._person.person.subscribe(r => {
      this.person = r
    })
    this.getEpss();
    this.getCompensationFounds();
    this.getPensionFounds();
    this.getSeveranceFounds();
  }

  getCompensationFounds() {
    this._compensationFund.getCompensationFunds().subscribe((r: any) => {
      this.compensationFunds = r.data
      this.compensationFunds.unshift({ text: 'Seleccione', value: '' })
    })
  }
  getPensionFounds() {
    this._pensionFund.getPensionFounds().subscribe((r: any) => {
      this.pensionFunds = r.data
      this.pensionFunds.unshift({ text: 'Seleccione', value: '' })

    })
  }
  getSeveranceFounds() {
    this._severanceFund.getSeveranceFounds().subscribe((r: any) => {
      this.severanceFunds = r.data
      this.severanceFunds.unshift({ text: 'Seleccione', value: '' })

    })
  }
  getEpss() {
    this._epss.getEpss().subscribe((r: any) => {
      this.epss = r.data
      this.epss.unshift({ text: 'Seleccione', value: '' })
    })
  }
  save() {
    this.formPrestation.markAllAsTouched()
    if (this.formPrestation.invalid) {return false;}
    this.person = { ...this.person, ...this.formPrestation.value }
    this._person.person.next(this.person)
    this.siguiente.emit({})
  }



  crearForm() {
    this.formPrestation = this.fb.group({
      eps_id: ['', Validators.required],
      compensation_fund_id: ['', Validators.required],
      severance_fund_id: ['', Validators.required],
      pension_fund_id: ['', Validators.required],

    })
  }

  get eps_id_invalid() {
    return (
      this.formPrestation.get('eps_id').invalid && this.formPrestation.get('eps_id').touched
    );
  }
  get compensation_fund_id_invalid() {
    return (
      this.formPrestation.get('compensation_fund_id').invalid && this.formPrestation.get('compensation_fund_id').touched
    );
  }
  get severance_fund_id_invalid() {
    return (
      this.formPrestation.get('severance_fund_id').invalid && this.formPrestation.get('severance_fund_id').touched
    );
  }
  get pension_fund_id_invalid() {
    return (
      this.formPrestation.get('pension_fund_id').invalid && this.formPrestation.get('pension_fund_id').touched
    );
  }

  previus(){
    this.anterior.emit()
  }
  ngOnDestroy(): void {
    this.$person.unsubscribe();
  }
}
