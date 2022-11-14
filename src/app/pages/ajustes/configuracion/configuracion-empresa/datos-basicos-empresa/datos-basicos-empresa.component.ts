import { Component, DoCheck, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfiguracionEmpresaService } from '../configuracion-empresa.service';
import { functionsUtils } from '../../../../../core/utils/functionsUtils';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-datos-basicos-empresa',
  templateUrl: './datos-basicos-empresa.component.html',
  styleUrls: ['./datos-basicos-empresa.component.scss']
})
export class DatosBasicosEmpresaComponent implements OnInit, DoCheck  {
  @ViewChild('modal') modal: any;
  company: any = [];
  form: FormGroup;
  imageString: any = '';
  typeImage: any = '';
  loading: boolean = true;
  differ: any;
  image: any = '';
  documents_types: any = []
  fileString: string | ArrayBuffer = "";
  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _validators: ValidatorsService,
    private _modal: ModalService,
    private _swal: SwalService,
    private _data: ConfiguracionEmpresaService
  ) { }

  ngOnInit(): void {
    this.getBasicData();
    this.createForm();
    this.getDocumentsTypes();
  }
  ngDoCheck() {
    if (this.company.id) {
      this.loading = false
    }
  }

  getDocumentsTypes() {
    this._data.getTypeDocuments().subscribe((res:any) => {
      this.documents_types = res.data
    })
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
      id: [this.company.id],
      logo: [''],
      social_reason: ['', this._validators.required],
      document_type: [''],
      document_number: ['', this._validators.required],
      verification_digit: ['', this._validators.required],
      constitution_date: ['', this._validators.required],
      email_contact: ['', this._validators.required],
      phone: ['', this._validators.required],
      typeImage: ['']
    });

  }

  getBasicData() {
    this._configuracionEmpresaService.getCompanyData()
      .subscribe((res: any) => {
        this.company = res.data;
        console.log(this.company)
        this.form.patchValue({
          id: this.company.id,
          social_reason: this.company.social_reason,
          document_type: this.company.document_type,
          document_number: this.company.document_number,
          verification_digit: this.company.verification_digit,
          constitution_date: this.company.constitution_date,
          email_contact: this.company.email_contact,
          phone: this.company.phone
        })
      })
      this.fileString = this.company.logo
  }

  onImageChanged(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.imageString = (<FileReader>event.target).result;
        const type = { ext: this.imageString };
        this.typeImage = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
        this.fileString = (<FileReader>event.target).result;
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.image = base64;
      });
    }
  }

  saveBasicData() {
    let logo = this.imageString;
    let typeImage = this.typeImage;
    this.form.patchValue({ logo, typeImage })
    this._configuracionEmpresaService.saveCompanyData(this.form.value)
      .subscribe((res: any) => {
        this.modalService.dismissAll(); 
        this.getBasicData();
        Swal.fire({
          icon: 'success',
          title: 'Actualizado Correctamente'
        });
      });
  }

}
