import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SalarioService } from './salario.service';
import { consts } from 'src/app/core/utils/consts';
import Swal from 'sweetalert2';
import { DatosBasicosService } from '../datos-basicos/datos-basicos.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../../../services/swal.service';
import { WorkContractTypesService } from '../../../../services/workContractTypes.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { PositionService } from '../../../../services/positions.service';
import { WorkContractService } from '../../../../services/work-contract.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { addDays } from '@fullcalendar/core';


@Component({
  selector: 'app-salario',
  templateUrl: './salario.component.html',
  styleUrls: ['./salario.component.scss']
})


export class SalarioComponent implements OnInit {
  @ViewChild('modal') modal: any;
  form: FormGroup;
  formHistoryContract: FormGroup;
  data: any;
  id: any;
  contract_types: any;
  salary_history: any[] = []
  contractTerms: any[] = [];
  workContractsTypesList: any[] = [];
  positions: any[] = [];
  loading: boolean;
  contracts: any[] = [];
  salary_info: any = {
    salary: '',
    contract_type: '',
    date_of_admission: '',
    date_end: '',
    contract_term_id: '',
    transport_assistance: ''
  };

  constructor(
    private fb: FormBuilder,
    private salaryService: SalarioService,
    private activateRoute: ActivatedRoute,
    private basicDataService: DatosBasicosService,
    private _workContractTypes: WorkContractTypesService,
    private modalService: NgbModal,
    private _modal: ModalService,
    private _swal: SwalService,
    private _position: PositionService,
    private _workContract: WorkContractService
  ) { }

  ngOnInit(): void {

    this.salaryService.getWorkContractType().subscribe((d: any) => {
      this.contract_types = d.data;
    }); // trae los tipos de contrato cloclude puede ser 0 o 1
    this.id = this.activateRoute.snapshot.params.id;
    this.getSalaryInfo();
    this.createForm();
    this.getSalaryHistory();
  }


  //Secccion Historial de contratos
  openModalContracts(content) {
    this.createFormHistoryContract()
    this._modal.open(content, 'lg')
    this._workContractTypes.getWorkContractTypeList().subscribe((r: any) => {
      this.workContractsTypesList = r.data
    })
    this._position.getPositions().subscribe((r: any) => {
      this.positions = r.data
    })
    this._workContract.getWorkContractList(this.id).subscribe((r: any) => {
      this.contracts = r.data
    })

  }



  printForm() {
  }


  dateFilter = (date: Date) => {

    for (const contract of this.contracts) {
      let date_end_aux = new Date(contract.date_end)
      let date_end = addDays(date_end_aux, 1)
      let date_of_admission = new Date(contract.date_of_admission)
      if (contract.date_end) {
        if (date >= date_of_admission && date <= date_end) {
          return false;
        }
      } else {
        if (date >= date_of_admission) {
          return false;
        }
      }
    }
    return true;
  }

  createFormHistoryContract() {
    this.formHistoryContract = this.fb.group({
      salary: ['', Validators.required],
      work_contract_type_id: ['', Validators.required],
      date_of_admission: ['', Validators.required],
      date_end: ['', Validators.required],
      position_id: ['', Validators.required],
      company_id: [1, Validators.required],
      liquidated: [1],
      person_id: [this.id],
    });

    this.formHistoryContract.get('date_end').valueChanges.subscribe(value => {
      if (value) {
        let date_of_admission = this.formHistoryContract.get('date_of_admission').value
        if (value && date_of_admission) {
          this.validateContractDates(date_of_admission, value)
        }
      }
    });
    this.formHistoryContract.get('date_of_admission').valueChanges.subscribe(value => {
      if (value) {
        let date_end = this.formHistoryContract.get('date_end').value
        if (value && date_end) {
          this.validateContractDates(value, date_end)
        }
      }
    });
  }

  validateContractDates(admission: Date, end: Date) {
    let start_ = new Date(admission).getTime()
    let end_ = new Date(end).getTime()
    if (start_ > end_) {
      this._swal.show({
        icon: 'error', title: "ERROR", text: "El rango de fechas es invalido", showCancel: false
      })
      this.formHistoryContract.patchValue({
        date_of_admission: null,
        date_end: null
      })
    }
    for (const contract of this.contracts) {
      let date_end = new Date(contract.date_end).getTime()
      let date_of_admission = new Date(contract.date_of_admission).getTime()
      if (contract.date_end != null && contract.date_end != undefined && contract.date != '') {
        if (date_of_admission >= start_ && date_end <= end_) {
          this._swal.show({
            icon: 'error', title: "ERROR", text: "El rango de fechas es invalido", showCancel: false
          })
          this.formHistoryContract.patchValue({
            date_of_admission: null,
            date_end: null
          })
        }
      }
    }
  }

  addHistoryContract() {
    if (this.formHistoryContract.valid) {
      this._swal.show({
        title: '¿Estás seguro(a)?',
        text: 'Vamos a guardar el contrato',
        icon: 'question',
      }).then(r => {
        if (r.isConfirmed) {
          this._workContract.addContract(this.formHistoryContract.value).subscribe((response: any) => {
            this._modal.close();
            this.getSalaryHistory();
            this._swal.show({
              title: response.data,
              icon: 'success',
              text: '',
              timer: 1000,
              showCancel: false
            })
          })
        }
      })
      //peticion
    } else {
      this._swal.show({
        title: "ERROR", icon: 'error', text: "Porfavor llena todos los campos del formulario"
      })
    }
  }

  closeResult = '';

  //Fin secccion Historial de contratos
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
      contract_term_id: ['', Validators.required],
      date_of_admission: ['', Validators.required],
      date_end: ['', Validators.required],
      transport_assistance: ['']
    });
    this.form.get('work_contract_type_id').valueChanges.subscribe(r => {
      this.getContractTerms(r);
    })
  }


  getContractTerms(value) {
    this._workContractTypes.getContractTerms().subscribe((r: any) => {
      this.contractTerms = []
      r.data.forEach(
        (contract_term: any) => contract_term.work_contract_types.forEach(
          (work_contract_type: any) => {
            if (work_contract_type.id == value) {
              this.contractTerms.push(contract_term)
            }
          }))
    });

  }

  getSalaryInfo() {

    this.loading = true;
    this.salaryService.getSalaryInfo(this.id)
      .subscribe((res: any) => {
        this.loading = false;
        this.salary_info = res.data;
        this.form.patchValue({
          id: this.salary_info?.id,
          salary: this.salary_info?.salary,
          work_contract_type_id: this.salary_info?.work_contract_type_id,
          contract_term_id: this.salary_info?.contract_term_id,
          date_of_admission: this.salary_info?.date_of_admission,
          date_end: this.salary_info?.date_end,
          transport_assistance: this.salary_info?.transport_assistance
        })
        if (this.salary_info?.work_contract_type_id !== 2) {
          this.form.get('date_end').disable();
        }
        this.getContractTerms(this.salary_info?.work_contract_type_id)
      });
  }


  loadingHistory: boolean;
  getSalaryHistory() {
    this.loadingHistory = true
    this.salaryService.getSalaryHistory(this.id).subscribe((res: any) => {
      this.salary_history = res.data
      this.loadingHistory = false
    })
  }

  conludeContract = false;
  changeType(conclude) {
    if (conclude) {
      this.form.get('date_end').enable();
      this.conludeContract = true;
    } else {
      this.form.get('date_end').disable();
      this.conludeContract = false;
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
