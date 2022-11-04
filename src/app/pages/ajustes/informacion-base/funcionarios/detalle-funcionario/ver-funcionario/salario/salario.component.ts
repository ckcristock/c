import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SalarioService } from './salario.service';
import { consts } from 'src/app/core/utils/consts';
import Swal from 'sweetalert2';
import { DatosBasicosService } from '../datos-basicos/datos-basicos.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../../../services/swal.service';

@Component({
  selector: 'app-salario',
  templateUrl: './salario.component.html',
  styleUrls: ['./salario.component.scss']
})
export class SalarioComponent implements OnInit {
  @ViewChild('modal') modal: any;
  form: FormGroup;
  data: any;
  id: any;
  contract_types: any;
  salary_history: any [] = []
  loading: boolean;
  salary_info: any = {
    salary: '',
    contract_type: '',
    date_of_admission: '',
    date_end: ''
  };
  constructor(
    private fb: FormBuilder,
    private salaryService: SalarioService,
    private activateRoute: ActivatedRoute,
    private basicDataService: DatosBasicosService,
    private modalService: NgbModal,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
    this.salaryService.getWorkContractType().subscribe((d: any) => {
      this.contract_types = d.data;
    });
    this.id = this.activateRoute.snapshot.params.id;
    this.getSalaryInfo();
    this.createForm();
    this.getSalaryHistory();
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {

  }

  openModal() {
    this.modal.show();
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      salary: ['', Validators.required],
      work_contract_type_id: ['', Validators.required],
      date_of_admission: ['', Validators.required],
      date_end: ['', Validators.required]
    });
  }

  


  getSalaryInfo() {
    this.loading = true;
    this.salaryService.getSalaryInfo(this.id)
      .subscribe((res: any) => {
        this.loading = false;
        this.salary_info = res.data;
        this.form.patchValue({
          id: this.salary_info.id,
          salary: this.salary_info.salary,
          work_contract_type_id: this.salary_info.work_contract_type_id,
          date_of_admission: this.salary_info.date_of_admission,
          date_end: this.salary_info.date_end
        })
        if (this.form.get('work_contract_type_id').value != 2) {
          this.form.patchValue({ date_end: null });
          this.form.get('date_end').clearValidators();
        }
      });
  }

  getSalaryHistory() {
    this.salaryService.getSalaryHistory(this.id).subscribe((res:any) => {
      this.salary_history = res.data
    })
  }

  changeType() {
    if (this.form.get('work_contract_type_id').value == 2) {
      this.form.get('date_end').enable();
      this.form.get('date_end').setValidators(Validators.required);
    } else {
      this.form.get('date_end').clearValidators();
      this.form.patchValue({ date_end: null });
    }
  }
  updateSalaryInfo() {
    /*  this.form.markAllAsTouched();
     if (this.form.invalid) { return false;} */

    this.salaryService.updateSalaryInfo(this.form.value)
      .subscribe(res => {
        this.modalService.dismissAll();
        this.getSalaryInfo();
        this._swal.show({
          title: 'Actualizado correctamente',
          icon: 'success',
          text: '',
          timer: 1000,
          showCancel: false
        })
        this.basicDataService.datos$.emit()
      });
  }
  get work_contract_type_id_valid() {
    return (
      this.form.get('work_contract_type_id').invalid && this.form.get('work_contract_type_id').touched
    );
  }

  get salary_valid() {
    return (
      this.form.get('salary').invalid && this.form.get('salary').touched
    );
  }

  get date_of_admission_valid() {
    return (
      this.form.get('date_of_admission').invalid && this.form.get('date_of_admission').touched
    );
  }

  get retirement_date_valid() {
    return (
      this.form.get('date_end').invalid && this.form.get('date_end').touched
    );
  }
}
