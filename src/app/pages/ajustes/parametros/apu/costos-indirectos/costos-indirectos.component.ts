import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { CostosIndirectosService } from './costos-indirectos.service';

@Component({
  selector: 'app-costos-indirectos',
  templateUrl: './costos-indirectos.component.html',
  styleUrls: ['./costos-indirectos.component.scss']
})
export class CostosIndirectosComponent implements OnInit {
  @ViewChild('modal') modal: any;
  form: FormGroup;
  loading: boolean = false;
  title: string = 'Nuevo costo indirecto';
  indirects: any[] = [];
  indirect: any = {};
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
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
    this.loading = true;
    this._indirects.getIndirectCosts(this.pagination).subscribe((r: any) => {
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
        showCancel: false
      })
    })
  }

  activateOrInactivate(indirectCost, state) {
    let data = {
      id: indirectCost.id,
      state
    }
    this._swal.show({
      title: '¿Estas Seguro?',
      text: (data.state == 'Inactivo' ? '¡El costo directo será desactivada!' : 'el costo directo será Activada'),
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
            text: (data.state == 'Activo' ? 'El costo directo ha sido Activada con éxito.' : 'El costo directo ha sido desactivada con éxito.'),
            timer: 2500,
            showCancel: false
          })
        }
      })
  }

}
