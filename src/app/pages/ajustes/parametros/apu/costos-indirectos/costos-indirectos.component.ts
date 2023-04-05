import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { CostosIndirectosService } from './costos-indirectos.service';
import { MatAccordion } from '@angular/material/expansion';
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-costos-indirectos',
  templateUrl: './costos-indirectos.component.html',
  styleUrls: ['./costos-indirectos.component.scss']
})
export class CostosIndirectosComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  form: FormGroup;
  loading: boolean = false;
  title: string = 'Nuevo costo indirecto';
  indirects: any[] = [];
  indirect: any = {};
  pagination = {
    page: 1,
    pageSize: 50,
    collectionSize: 0
  }
  filtro: any = {
    name: ''
  }

  masksMoney = consts

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
    private _swal: SwalService,
    private _indirects: CostosIndirectosService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getIndirectCosts();
    this.createForm();
  }
  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.form.reset();

  }

  openModal() {
    this.modal.show();

  }

  createForm() {
    this.form = this.fb.group({
      id: [this.indirect.id],
      name: ['', this._validators.required],
      percentage: ['', this._validators.required]
    })
  }

  getIndirect(indirect) {
    this.indirect = { ...indirect };
    this.form.patchValue({
      id: this.indirect.id,
      name: this.indirect.name,
      percentage: this.indirect.percentage
    })
  }

  getIndirectCosts(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._indirects.getIndirectCosts(params).subscribe((r: any) => {
      this.indirects = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  save() {
    this._indirects.save(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getIndirectCosts();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false,
        timer: 1000,
      })
    })
  }

  activateOrInactivate(indirectCost, state) {
    let data = {
      id: indirectCost.id,
      state
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (data.state == 'Inactivo' ? '¡El costo directo será desactivado!' : '¡El costo directo será activado!'),
      icon: 'question',
      showCancel: true
    })
      .then((result) => {
        if (result.isConfirmed) {
          this._indirects.save(data).subscribe((r: any) => {
            this.getIndirectCosts();
          })
          this._swal.show({
            icon: 'success',
            title: '¡Activado!',
            text: (data.state == 'Activo' ? 'El costo directo ha sido activado con éxito.' : 'El costo directo ha sido desactivado con éxito.'),
            timer: 1000,
            showCancel: false
          })
        }
      })
  }

}
