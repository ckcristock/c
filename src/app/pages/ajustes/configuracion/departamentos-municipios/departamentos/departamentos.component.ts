import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { DepartamentosService } from './departamentos.service';

@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.scss']
})
export class DepartamentosComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose(){
    if (this.matPanel == false){
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  loading: boolean = false;
  departamentos: any = [];
  department: any = {};
  form = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  pagination = {
    pageSize: 10,
    page: 1,
    collectionSize: 0
  }

  filtro: any = {
    name: ''
  }
  constructor(
    private depService: DepartamentosService,
    private modalService: NgbModal,
    private _swal: SwalService,
    ) { }

  ngOnInit(): void {
    this.getAllDepartment();
  }

  getAllDepartment(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this.depService.getDepartmentPaginate(params)
      .subscribe((res: any) => {
        this.loading = false;
        this.pagination.collectionSize = res.data.total;
        this.departamentos = res.data.data;
      });
  }

  openModal() {

    this.modal.show();

  }

  closeResult = '';
  public openConfirm(confirm) {
    this.department.name = '';
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();

  }

  getDepartment(department) {
    this.department = department;
  }

  createNewDepartment() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { return false; }
    this.depService.setDepartment(this.department)
      .subscribe((res: any) => {
        this._swal.show({
          title: 'Agregada correctamente',
          icon: 'success',
          text: '',
          timer: 1000,
          showCancel: false
        })
        this.getAllDepartment();
        this.modalService.dismissAll();
      });
  }

  get name_department() {
    return (
      this.form.get('name').invalid && this.form.get('name').touched
    )
  }



}
