import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { UnidadesMedidasService } from './unidades-medidas.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-unidades-medidas',
  templateUrl: './unidades-medidas.component.html',
  styleUrls: ['./unidades-medidas.component.scss']
})
export class UnidadesMedidasComponent implements OnInit {
  @ViewChild('modal') modal: any;
  loading: boolean = false;
  form: FormGroup;
  title: string = 'Nueva unidad de medida';
  units: any[] = [];
  unit: any = {};

  constructor(
    private fb: FormBuilder,
    private _validators: ValidatorsService,
    private _units: UnidadesMedidasService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getUnits();
  }

  openModal() {
    this.modal.show();
    this.title = 'Nueva unidad de medida';
  }
  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'sm' }).result.then((result) => {
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
      id: [this.unit.id],
      name: ['', this._validators.required]
    })
  }

  getUnit(unit) {
    this.unit = { ...unit };
    //this.title = 'Actualizar unidad de medida';
    this.form.patchValue({
      id: this.unit.id,
      name: this.unit.name
    })
  }

  getUnits() {
    this.loading = true;
    this._units.getUnits().subscribe((r: any) => {
      this.units = r.data;
      this.loading = false;
    })
  }

  save() {
    if (this.unit.id) {
      this._units.update(this.form.value, this.unit.id).subscribe((r: any) => {
        this.modalService.dismissAll();
        this.form.reset();
        this.getUnits();
        console.log(r)
        this._swal.show({
          icon: 'success',
          title: r.data.title,
          text: r.data.text,
          showCancel: false
        })
      })
    }
    this._units.save(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getUnits();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false
      })
    })
  }

}
