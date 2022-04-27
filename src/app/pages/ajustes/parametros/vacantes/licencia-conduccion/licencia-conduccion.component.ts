import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LicenciaConduccionService } from './licencia-conduccion.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-licencia-conduccion',
  templateUrl: './licencia-conduccion.component.html',
  styleUrls: ['./licencia-conduccion.component.scss']
})
export class LicenciaConduccionComponent implements OnInit {
  @ViewChild('modal') modal: any;
  loading: boolean = false;
  form: FormGroup;
  licenses: any[] = [];
  license: any = {};
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  constructor(
    private fb: FormBuilder,
    private _licencia: LicenciaConduccionService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getDrivingLicenses();
  }

  openModal() {
    this.modal.show();
  }

  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo;
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

  createForm() {
    this.form = this.fb.group({
      id: [this.license.id],
      type: ['', Validators.required],
      description: ['']
    })
  }

  getDrivingLicense(license) {
    this.license = { ...license };
    this.form.patchValue({
      id: this.license.id,
      type: this.license.type,
      description: this.license.description
    })
  }

  getDrivingLicenses(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this._licencia.getDrivingLicenses(this.pagination).subscribe((r: any) => {
      this.licenses = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  activateOrInactivate(license, state) {
    let data = {
      id: license.id,
      state
    }
    this._swal.show({
      title: '¿Estas Seguro?',
      text: (data.state == 'Inactivo' ? '¡La licencia será desactivada!' : 'La licencia será Activada'),
      icon: 'question',
      showCancel: true
    })
      .then((result) => {
        if (result.isConfirmed) {
          this._licencia.save(data).subscribe((r: any) => {
            this.getDrivingLicenses();
          })
          this._swal.show({
            icon: 'success',
            title: '¡Activado!',
            text: (data.state == 'Activo' ? 'La licencia ha sido Activada con éxito.' : 'La licencia ha sido desactivada con éxito.'),
            timer: 2500,
            showCancel: false
          })
        }
      })
  }

  save() {
    this._licencia.save(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll(); 
      this.getDrivingLicenses();
      this.form.reset();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false
      })
    })
  }

}
