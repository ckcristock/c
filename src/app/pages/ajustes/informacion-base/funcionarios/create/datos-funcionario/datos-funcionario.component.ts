import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonDataService } from '../personData.service';
import { Subscription } from 'rxjs';
import { consts } from '../../../../../../core/utils/consts';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { Person } from '../../../../../../core/models/person.model';
import { ValidatorsService } from '../../../services/reactive-validation/validators.service';
import { DocumentTypeService } from '../../../services/document-type.service';
import { PersonService } from '../../../persons/person.service';
import { SwalService } from '../../../services/swal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-datos-funcionario',
  templateUrl: './datos-funcionario.component.html',
  styleUrls: ['./datos-funcionario.component.scss'],
})
export class DatosFuncionarioComponent implements OnInit {
  @Output('siguiente') siguiente = new EventEmitter();

  tipoSangre = consts.bloodType;
  estados = consts.maritalStatus;
  instruccion = consts.degree;
  titleFile = 'Selecciona imagen'
  $person: Subscription;
  documenttypes: any[];
  form: FormGroup;
  file: any = '';
  fileString: any =
    'https://ui-avatars.com/api/?background=505D69&color=fff&size=1000&name=F';
  reload: boolean;

  constructor(
    private _person: PersonDataService,
    private fb: FormBuilder,
    private _valid: ValidatorsService,
    private _people: PersonService,
    private _documenttypes: DocumentTypeService,
    private _swal: SwalService,
  ) { }
  person: Person
  ngOnInit(): void {
    this.getDocumentType()
    this.crearForm();
    this.$person = this._person.person.subscribe((r) => {
      this.person = r
    });
  }

  async reloadData() {
    this.reload = true;
    await this.getDocumentType();
    this.reload = false;
  }

  async getDocumentType() {
    await this._documenttypes.getDocumentTypes().toPromise().then((r: any) => {
      this.documenttypes = r.data;
    })
  }

  validarCedula(cedula) {
    let envio_cedula = cedula.target.value;
    this._people.validarCedula(envio_cedula).subscribe((r: any) => {
      if (r.data == true) {
        Swal.fire({
          icon: 'error',
          title: 'Funcionario existente',
          html: r.code.first_name + ' ' + r.code.second_name + ' ' + r.code.first_surname + ' ' + r.code.second_surname +
            '<br/>' + envio_cedula,
        })
        this.form.get('identifier').reset();
      }
    });
  }

  crearForm() {
    this.form = this.fb.group({
      image: ['', this._valid.required],
      type_document_id: ['', this._valid.required],
      identifier: ['', this._valid.required],
      first_name: ['', this._valid.required],
      second_name: ['',],
      first_surname: ['', this._valid.required],
      second_surname: ['',],
      email: [
        '',
        [
          this._valid.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
        ],
      ],
      birth_date: ['', this._valid.required],
      place_of_birth: ['', this._valid.required],
      address: ['', this._valid.required],
      phone: ['', [this._valid.required, this._valid.minLength(7), this._valid.maxLength(10)]],
      gener: ['', this._valid.required],
      blood_type: ['', this._valid.required],
      cell_phone: ['', [this._valid.required, this._valid.minLength(10), this._valid.maxLength(10)]],
      marital_status: ['', this._valid.required],
      number_of_children: ['', this._valid.required],
      degree: ['', this._valid.required],
      title: ['', this._valid.required],
      passport_number: [''],
      visa: [''],
      signature: [''],
    });
  }

  get image_valid() {
    return (
      this.form.get('image').invalid && this.form.get('image').touched
    );
  }
  get document_type_valid() {
    return (
      this.form.get('type_document_id').invalid && this.form.get('type_document_id').touched
    );
  }
  get identifier_valid() {
    return (
      this.form.get('identifier').invalid && this.form.get('identifier').touched
    );
  }
  get first_name_valid() {
    return (
      this.form.get('first_name').invalid && this.form.get('first_name').touched
    );
  }
  get second_name_valid() {
    return (
      this.form.get('second_name').invalid && this.form.get('second_name').touched
    );
  }
  get first_surname_valid() {
    return (
      this.form.get('first_surname').invalid && this.form.get('first_surname').touched
    );
  }
  get second_surname_valid() {
    return (
      this.form.get('second_surname').invalid && this.form.get('second_surname').touched
    );
  }
  get email_valid() {
    return this.form.get('email').invalid && this.form.get('email').touched;
  }
  get birth_date_valid() {
    return (
      this.form.get('birth_date').invalid &&
      this.form.get('birth_date').touched
    );
  }
  get place_of_birth_valid() {
    return (
      this.form.get('place_of_birth').invalid &&
      this.form.get('place_of_birth').touched
    );
  }
  get direction_valid() {
    return (
      this.form.get('address').invalid && this.form.get('address').touched
    );
  }
  get phone_valid() {
    return this.form.get('phone').invalid && this.form.get('phone').touched;
  }
  get gener_valid() {
    return this.form.get('gener').invalid && this.form.get('gener').touched;
  }
  get blood_type_valid() {
    return (
      this.form.get('blood_type').invalid && this.form.get('blood_type').touched
    );
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
  get number_of_children_valid() {
    return (
      this.form.get('number_of_children').invalid &&
      this.form.get('number_of_children').touched
    );
  }
  get degree_valid() {
    return this.form.get('degree').invalid && this.form.get('degree').touched;
  }
  get title_valid() {
    return this.form.get('title').invalid && this.form.get('title').touched;
  }

  save() {
    //this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._swal.incompleteError();
      return false;
    }
    this.person = { ...this.person, ...this.form.value };
    //this.person.image = this.file;
    this._person.person.next(this.person);
    this.siguiente.emit({});
  }

  onFileChanged(event) {
    if (event.target.files.length == 1) {
      let file = event.target.files[0];
      let maxWidth = 800;
      let maxHeight = 800;
      this.validarDimensionesImagen(file, maxWidth, maxHeight)
        .then(() => {
          console.log('llego aqui?')
          const types = ['image/png', 'image/jpeg', 'image/jpg']
          if (!types.includes(file.type)) {
            this._swal.show({
              icon: 'error',
              title: 'Error de archivo',
              showCancel: false,
              text: 'El tipo de archivo no es válido'
            });
            return null
          }
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (event) => {
            this.fileString = (<FileReader>event.target).result;
          };
          functionsUtils.fileToBase64(file).subscribe((base64) => {
            this.form.patchValue({
              image: base64
            })
            this.file = base64
          });
        })
        .catch((error: string) => {
          console.error(error);
          this._swal.show({
            icon: 'error',
            title: 'Error de archivo',
            showCancel: false,
            text: 'La imagen no tiene las dimensiones solicitadas (800px de ancho por 800px de alto)'
          });
        });
    }
  }

  onFileChangedSignature(event) {
    if (event.target.files.length == 1) {
      let file = event.target.files[0];
      const maxWidth = 800;
      let maxHeight = 450;
      this.validarDimensionesImagen(file, maxWidth, maxHeight)
        .then(() => {
          const types = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
          if (!types.includes(file.type)) {
            this._swal.show({
              icon: 'error',
              title: 'Error de archivo',
              showCancel: false,
              text: 'El tipo de archivo no es válido'
            });
            return null
          }
          this.titleFile = event.target.files[0].name
          functionsUtils.fileToBase64(file).subscribe((base64) => {
            this.form.patchValue({
              signature: base64
            })
          });
        })
        .catch((error: string) => {
          console.error(error);
          this._swal.show({
            icon: 'error',
            title: 'Error de archivo',
            showCancel: false,
            text: 'La imagen no tiene las dimensiones solicitadas (800px de ancho por 450px de alto)'
          });
        });

    }
  }

  validarDimensionesImagen(file: File, maxWidth: number, maxHeight: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          if (width == maxWidth && height == maxHeight) {
            resolve();
          } else if (file.type == 'image/svg+xml') {
            resolve();
          } else {
            reject(`Las dimensiones de la imagen deben ser iguales a ${maxWidth}x${maxHeight}`);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  ngOnDestroy(): void {
    this.$person.unsubscribe();
  }
}
