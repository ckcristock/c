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

@Component({
  selector: 'app-datos-basicos',
  templateUrl: './datos-basicos.component.html',
  styleUrls: ['./datos-basicos.component.scss']
})
export class DatosBasicosComponent implements OnInit {
  @ViewChild('modal') modal:any;
  estados = consts.maritalStatus;
  degrees = consts.degree;
  $person: Subscription;
  form: FormGroup;
  id: any;
  file: any = '';
  funcionario:any = {
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
    degree: ''
  }
  data:any;
  fileString: any =
  'https://ui-avatars.com/api/?background=0D8ABC&color=fff&size=100';
  constructor( private fb:FormBuilder, 
                private basicDataService: DatosBasicosService,
                private activatedRoute: ActivatedRoute,
                private _person: PersonDataService,
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
  
  openModal(){
    this.modal.show();
  }
  
  getBasicsData(){
    this.basicDataService.getBasicsData(this.id)
    .subscribe( (res:any) => {
      this.funcionario = res.data; 
    })
  }

  createForm(){
    this.form = this.fb.group({
      image: ['', Validators.required],
      first_name: ['', Validators.required],
      second_name: ['', Validators.required],
      first_surname: ['', Validators.required],
      second_surname: ['', Validators.required],
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
      cell_phone: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(9)]]
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

  get second_name_valid() {
    return (
      this.form.get('second_name').invalid && this.form.get('second_name').touched
    );
  }

  get second_surname_valid() {
    return (
      this.form.get('second_surname').invalid && this.form.get('second_surname').touched
    );
  }

  get image_valid() {
    return (
      this.form.get('image').invalid && this.form.get('image').touched
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
    if (this.form.invalid) { return false;}
    this.basicDataService.updateBasicData(this.funcionario, this.id)
    .subscribe( res => {
      this.modal.hide();
      console.log(this.funcionario);
      this.getBasicsData();
      Swal.fire({
        icon: 'success',
        title: 'Editado con éxito',
        text: 'Se han actualizado los cambios correctamente'
      })
      this.basicDataService.datos$.emit()
    });
    this.person.image = this.file;
  }

}
