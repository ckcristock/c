import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import Swal from 'sweetalert2';
import { SwalService } from '../../../../services/swal.service';
import { AfiliacionesService } from './afiliaciones.service';

@Component({
  selector: 'app-afiliaciones',
  templateUrl: './afiliaciones.component.html',
  styleUrls: ['./afiliaciones.component.scss']
})
export class AfiliacionesComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild('add') add: any;
  form: FormGroup;
  data: any;
  eps: any;
  loading: boolean;
  compensations: any;
  pensions: any;
  severances: any;
  arls: any;
  afiliations: any;
  id: any;
  constructor(
    private fb: FormBuilder,
    private afiliationService: AfiliacionesService,
    private activatedRoute: ActivatedRoute,
    private _swal: SwalService,
    private _modal: ModalService,
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getAfiliationInfo();
    this.createForm();
    this.getEpss();
    this.getCompensations_funds();
    this.getPension_funds();
    this.getSeverance_funds();
    this.getArls();
  }

  openModal() {
    this._modal.open(this.add)
  }

  createForm() {
    this.form = this.fb.group({
      eps_id: ['', Validators.required],
      pension_fund_id: ['', Validators.required],
      severance_fund_id: ['', Validators.required],
      compensation_fund_id: ['', Validators.required],
      arl_id: ['', Validators.required]
    });
  }

  getAfiliationInfo() {
    this.loading = true;
    this.afiliationService.getAfiliationInfo(this.id)
      .subscribe((res: any) => {
        this.loading = false;
        this.afiliations = res.data;
        this.form.patchValue({
          eps_id: this.afiliations.eps_id,
          pension_fund_id: this.afiliations.pension_fund_id,
          severance_fund_id: this.afiliations.severance_fund_id,
          compensation_fund_id: this.afiliations.compensation_fund_id,
          arl_id: this.afiliations.arl_id
        })
      });
  }

  updateAfiliation() {
    /* this.form.markAllAsTouched();
    if (this.form.invalid) { return false;} */
    this.afiliationService.updateAfiliation(this.form.value, this.id)
      .subscribe(res => {
        this.getAfiliationInfo();
        this._modal.close();
        this._swal.show({
          title: 'Actualizado correctamente',
          text: '',
          icon: 'success',
          showCancel: false,
          timer: 1000
        })
      });
  }

  getEpss() {
    this.afiliationService.getEpss()
      .subscribe((res: any) => {
        this.eps = res.data;
      });
  }

  getCompensations_funds() {
    this.afiliationService.getCompensationFund()
      .subscribe((res: any) => {
        this.compensations = res.data;
      });
  }

  getPension_funds() {
    this.afiliationService.getPension_funds()
      .subscribe((res: any) => {
        this.pensions = res.data;
      });
  }

  getSeverance_funds() {
    this.afiliationService.getSeverance_funds()
      .subscribe((res: any) => {
        this.severances = res.data;
      });
  }

  getArls() {
    this.afiliationService.getArls()
      .subscribe((res: any) => {
        this.arls = res.data;
      });
  }

  get eps_valid() {
    return (
      this.form.get('eps_id').invalid && this.form.get('eps_id').touched
    );
  }

  get arl_valid() {
    return (
      this.form.get('arl_id').invalid && this.form.get('arl_id').touched
    );
  }

  get pension_found_valid() {
    return (
      this.form.get('pension_fund_id').invalid && this.form.get('pension_fund_id').touched
    );
  }

  get severance_found_valid() {
    return (
      this.form.get('severance_fund_id').invalid && this.form.get('severance_fund_id').touched
    );
  }

  get compensation_valid() {
    return (
      this.form.get('compensation_fund_id').invalid && this.form.get('compensation_fund_id').touched
    );
  }


}
