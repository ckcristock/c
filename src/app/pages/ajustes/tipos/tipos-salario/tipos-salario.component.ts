import { Component, OnInit, ViewChild } from '@angular/core';
import { TiposSalarioService } from './tipos-salario.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-tipos-salario',
  templateUrl: './tipos-salario.component.html',
  styleUrls: ['./tipos-salario.component.scss']
})
export class TiposSalarioComponent implements OnInit {
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
  selected: any;
  lists: any;
  salaries: any[] = [];
  form: FormGroup;
  pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro: any = {
    name: ''
  }
  salary: any = {};
  constructor(
    private _typesSalaryService: TiposSalarioService,
    private fb: FormBuilder,
    private _reactiveValid: ValidatorsService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.getSalaryTypes();
    this.createForm();
  }

  openModal() {
    this.modal.show();


  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.selected = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();
    
  }

  getData(data) {
    this.salary = { ...data };
    this.form.patchValue({
      id: this.salary.id,
      name: this.salary.name
    });
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.salary.id],
      name: ['', this._reactiveValid.required]
    })
  }

  getSalaryTypes(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._typesSalaryService.getSalaryTypes(params)
      .subscribe((res: any) => {
        this.loading = false;
        this.salaries = res.data.data;
        this.pagination.collectionSize = res.data.total;
      });
  }


  activateOrInactivate(contract, status) {
    let data = {
      id: contract.id,
      status
    }
    Swal.fire({
      title: '¿Estas seguro?',
      text: (status === 'Inactivo' ? 'El Salario se inactivará!' : 'El Salario se activará'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: (status === 'Inactivo' ? 'Si, Inhabilitar' : 'Si, activar')
    }).then((result) => {
      if (result.isConfirmed) {
        this._typesSalaryService.createSalaryType(data)
          .subscribe(res => {
            this.getSalaryTypes();
            Swal.fire({
              title: (status === 'Inactivo' ? 'Salario Inhabilitado!' : 'Salario activado'),
              text: (status === 'Inactivo' ? 'El Salario ha sido Inhabilitado con éxito.' : 'El Salario ha sido activado con éxito.'),
              icon: 'success'
            })
          })
      }
    })
  }

  createSalaryType() {
    this._typesSalaryService.createSalaryType(this.form.value)
      .subscribe((res: any) => {
        this.getSalaryTypes();
        this.modalService.dismissAll(); 
        Swal.fire({
          icon: 'success',
          title: res.data,
          text: 'Se ha agregado a los Salarios con éxito'
        })
      })
  }

}
