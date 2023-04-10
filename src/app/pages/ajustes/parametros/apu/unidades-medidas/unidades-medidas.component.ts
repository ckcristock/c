import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { UnidadesMedidasService } from './unidades-medidas.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-unidades-medidas',
  templateUrl: './unidades-medidas.component.html',
  styleUrls: ['./unidades-medidas.component.scss']
})
export class UnidadesMedidasComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  loading: boolean = false;
  form: FormGroup;
  title: string = 'Nueva UM';
  units: any[] = [];
  unit: any = {};
  pagination = {
    page: 1,
    pageSize: 50,
    collectionSize: 0
  }
  filtro: any = {
    name: ''
  }

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }

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
    this.title = 'Nueva UM';
  }
  closeResult = '';
  public openConfirm(confirm, titulo) {
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
  createForm() {
    this.form = this.fb.group({
      id: [''],
      name: ['', this._validators.required],
      unit: ['', this._validators.required],
    })
  }

  getUnit(unit) {
    this.unit = { ...unit };
    //this.title = 'Actualizar unidad de medida';
    this.form.patchValue({
      id: this.unit.id,
      name: this.unit.name,
      unit: this.unit.unit,
    })
  }

  getUnits(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._units.getUnits(params).subscribe((r: any) => {
      this.units = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  save() {
    this._units.save(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getUnits();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false,
        timer: 1000,
      })
    })
  }

}
