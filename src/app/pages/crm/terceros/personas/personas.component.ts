import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { TercerosService } from '../terceros.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss']
})
export class PersonasComponent implements OnInit {
  checkPersona: boolean = true
  checkTercero: boolean = true
  checkTelefono: boolean = true
  checkEmail: boolean = true
  checkCargo: boolean = true
  checkObservacion: boolean = true
  @ViewChild('firstAccordion') firstAccordion: MatAccordion;
  @ViewChild('secondAccordion') secondAccordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.firstAccordion.openAll();
      this.matPanel = true;
    } else {
      this.firstAccordion.closeAll();
      this.matPanel = false;
    }
  }
  matPanel2 = false;
  openClose2() {
    if (this.matPanel2 == false) {
      this.secondAccordion.openAll();
      this.matPanel2 = true;
    } else {
      this.secondAccordion.closeAll();
      this.matPanel2 = false;
    }
  }


  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    this.form.reset();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  form: FormGroup;
  people: any[] = [];
  loading: boolean = false;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtros = {
    name: '',
    third: '',
    phone: '',
    email: '',
    cargo: '',
    observacion: '',
    documento: ''
  }
  constructor(
    private _terceros: TercerosService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private _validators: ValidatorsService,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getPerson();
  }

  estadoFiltros = false;

  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', this._validators.required],
      n_document: ['', this._validators.required],
      landline: [''],
      cell_phone: [''],
      email: ['', Validators.email],
      position: [''],
      observation: [''],
    });
  }

  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }
  getPerson(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._terceros.getThirdPartyPerson(params).subscribe((r: any) => {
      this.people = r.data.data;
      console.log(this.people)
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  addPerson() {
    this._terceros.addThirdPartyPerson(this.form.value)
      .subscribe((res: any) => {
        swal.fire({
          icon: 'success',
          title: res.data,
          text: 'Se ha agregado la persona con éxito.'
        });
        this.getPerson();
        this.modalService.dismissAll();
      });
  }

  get name_valid() {
    return this.form.get('name').invalid && this.form.get('name').touched
  }
  get n_document_valid() {
    return this.form.get('n_document').invalid && this.form.get('n_document').touched
  }
  get email_valid() {
    return this.form.get('email').invalid && this.form.get('email').touched
  }
}
