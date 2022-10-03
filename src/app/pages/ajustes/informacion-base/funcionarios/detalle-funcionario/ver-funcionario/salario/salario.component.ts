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
  contract_types:any;
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
    });;
    console.log(this.contract_types)
    this.id = this.activateRoute.snapshot.params.id;
    this.getSalaryInfo();
    this.createForm();
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
      type_contract: ['', Validators.required],
      salary: ['', Validators.required],
      date_of_admission: ['', Validators.required],
      date_end: ['', Validators.required]
    });
  }

  get type_contract_valid() {
    return (
      this.form.get('type_contract').invalid && this.form.get('type_contract').touched
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


  getSalaryInfo() {
    this.salaryService.getSalaryInfo(this.id)
      .subscribe((res: any) => {
        this.salary_info = res.data;
        console.log(this.salary_info)
      });
  }

  updateSalaryInfo() {
    /*  this.form.markAllAsTouched();
     if (this.form.invalid) { return false;} */

    this.salaryService.updateSalaryInfo(this.salary_info)
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

}
