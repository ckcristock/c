import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ConfiguracionEmpresaService } from '../configuracion-empresa.service';
import { functionsUtils } from '../../../../../core/utils/functionsUtils';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';

@Component({
  selector: 'app-datos-basicos-empresa',
  templateUrl: './datos-basicos-empresa.component.html',
  styleUrls: ['./datos-basicos-empresa.component.scss']
})
export class DatosBasicosEmpresaComponent implements OnInit {
  @ViewChild('modal') modal: any;
  company: any = [];
  form: FormGroup;
  imageString: any = '';
  typeImage: any = '';
  image: any = '';
  constructor(
    private _configuracionEmpresaService: ConfiguracionEmpresaService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _validators: ValidatorsService,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
    this.getBasicData();
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
