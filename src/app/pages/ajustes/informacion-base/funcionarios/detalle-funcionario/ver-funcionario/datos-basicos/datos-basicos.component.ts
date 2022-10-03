import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { consts } from 'src/app/core/utils/consts';
import { DatosBasicosService } from './datos-basicos.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { Subscription } from 'rxjs';
import { PersonDataService } from '../../../create/personData.service';
import { Person } from 'src/app/core/models/person.model';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../../../services/swal.service';

@Component({
  selector: 'app-datos-basicos',
  templateUrl: './datos-basicos.component.html',
  styleUrls: ['./datos-basicos.component.scss']
})
export class DatosBasicosComponent implements OnInit {
  @ViewChild('modal') modal: any;
  estados = consts.maritalStatus;
  degrees = consts.degree;
  $person: Subscription;
  form: FormGroup;
  id: any;
  file: any = '';
  funcionario = {
    cell_phone: '',
    date_of_birth: '',
    address: '',
    email: '',
    first_name: '',
    first_surname: '',
    second_name: '',
    second_surname: '',
    gener: '',
    identifier: '',
    marital_status: '',
    degree: '',
    image: ''
  }
  data: any;
  fileString: any = '';
  constructor(private fb: FormBuilder,
    private basicDataService: DatosBasicosService,
    private activatedRoute: ActivatedRoute,
    private _person: PersonDataService,
    private modalService: NgbModal,
    private _swal: SwalService,
  ) { }
  person: Person
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getBasicsData();
    this.createForm();
    this.$person = this._person.person.subscribe((r) => {
      this.person = r;
    });
  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'xl', scrollable: true }).result.then((result) => {
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

  hideModal() {
    this.getBasicsData();
  }

  getBasicsData() {
    this.basicDataService.getBasicsData(this.id)
      .subscribe((res: any) => {
        this.funcionario = res.data;
        this.form.patchValue({
          address: this.funcionario.address,
          cell_phone: this.funcionario.cell_phone,
          date_of_birth: this.funcionario.date_of_birth,
          degree: this.funcionario.degree,
          email: this.funcionario.email,
          first_name: this.funcionario.first_name,
          second_name: this.funcionario.second_name,
          first_surname: this.funcionario.first_surname,
          second_surname: this.funcionario.second_surname,
          identifier: this.funcionario.identifier,
          marital_status: this.funcionario.marital_status,
          gener: this.funcionario.gener
        })
        this.file = this.funcionario.image
        this.fileString = this.funcionario.image
      })
  }

  createForm() {
    this.form = this.fb.group({
      image: [''],
      first_name: ['', Validators.required],
      second_name: [''],
      first_surname: ['', Validators.required],
      second_surname: [''],
      identifier: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      address: ['', Validators.required],
      degree: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      gener: ['', Validators.required],
      marital_status: ['', Validators.required],
      cell_phone: ['', Validators.required]
    });
  }

  get first_name_valid() {
    return (
      this.form.get('first_name').invalid && this.form.get('first_name').touched
    );
  }

  get first_surname_valid() {
    return (
      this.form.get('first_surname').invalid && this.form.get('first_surname').touched
    );
  }

  get image_valid() {
    return (
      this.form.get('image').touched && !this.fileString
    );
  }
  get identifier_valid() {
    return (
      this.form.get('identifier').invalid && this.form.get('identifier').touched
    );
  }
  get names_valid() {
    return (
      this.form.get('names').invalid && this.form.get('names').touched
    );
  }
  get subnames_valid() {
    return (
      this.form.get('subnames').invalid && this.form.get('subnames').touched
    );
  }
  get email_valid() {
    return this.form.get('email').invalid && this.form.get('email').touched;
  }
  get date_of_birth_valid() {
    return (
      this.form.get('date_of_birth').invalid &&
      this.form.get('date_of_birth').touched
    );
  }
  get address_valid() {
    return (
      this.form.get('address').invalid && this.form.get('address').touched
    );
  }
  get gener_valid() {
    return this.form.get('gener').invalid && this.form.get('gener').touched;
  }
  get cell_phone_valid() {
    return (
      this.form.get('cell_phone').invalid && this.form.get('cell_phone').touched
    );
  }
  get marital_status_valid() {
    return (
      this.form.get('marital_status').invalid &&
      this.form.get('marital_status').touched
    );
  }
  get degree_valid() {
    return this.form.get('degree').invalid && this.form.get('degree').touched;
  }

  onFileChanged(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
      });
    }
  }

  guardar() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.image_valid) { return false; }
    this.form.patchValue({
      image: this.file
    })
    this.basicDataService.updateBasicData(this.form.value, this.id)
      .subscribe(res => {
        this.modalService.dismissAll();
        this.getBasicsData();
        this._swal.show({
          title: 'Proceso finalizado',
          text: 'Se han actualizado los cambios correctamente.',
          icon: 'success',
          showCancel: false,
          timer: 1000
        }) 
        this.basicDataService.datos$.emit()
      });
    this.person.image = this.file;
  }

}
