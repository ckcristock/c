import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { EspesoresService } from './espesores.service';

@Component({
  selector: 'app-espesores',
  templateUrl: './espesores.component.html',
  styleUrls: ['./espesores.component.scss']
})
export class EspesoresComponent implements OnInit {
  @ViewChild('modal') modal: any;
  form: FormGroup;
  loading: boolean = false;
  title: any = '';
  espesores: any[] = [];
  espesor: any = {};
  constructor(
    private fb: FormBuilder,
    private _espesores: EspesoresService,
    private _swal: SwalService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.createform();
    this.getThicknesses();
  }
  closeResult = '';
  public openConfirm(confirm,titulo) {
    this.title = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'sm', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();
    
  }

  createform() {
    this.form = this.fb.group({
      id: [this.espesor.id],
      thickness: ['', Validators.required]
    })
  }

  openModal() {
    this.modal.show();

  }

  getThickness(espesor) {
    this.espesor = { ...espesor };
    this.form.patchValue({
      id: this.espesor.id,
      thickness: this.espesor.thickness
    })
  }

  getThicknesses() {
    this.loading = true;
    this._espesores.getMeasures().subscribe((r: any) => {
      this.espesores = r.data;
      this.loading = false;
    })
  }

  save() {
    this._espesores.save(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getThicknesses();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false
      })
    })
  }

}
