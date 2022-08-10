import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TipoActividadesService } from './tipo-actividades.service';
import { ValidatorsService } from '../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-tipos-actividades',
  templateUrl: './tipos-actividades.component.html',
  styleUrls: ['./tipos-actividades.component.scss']
})
export class TiposActividadesComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  form: FormGroup;
  title: any = '';
  activityTypes: any[] = [];
  activity: any = {};
  loading: boolean = false;
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }

  constructor(
    private fb: FormBuilder,
    private _tipoAct: TipoActividadesService,
    private _validators: ValidatorsService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getActivityTypes();
  }

  openModal() {
    this.modal.show();
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
    this.form.reset()
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
      id: [this.activity.id],
      name: ['', this._validators.required],
      color: ['', this._validators.required]
    })
  }

  getActivity(activity) {
    this.activity = { ...activity };
    this.form.patchValue({
      id: this.activity.id,
      name: this.activity.name,
      color: this.activity.color
    })
  }

  getActivityTypes(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this._tipoAct.getActivityTypes(this.pagination).subscribe((r: any) => {
      this.activityTypes = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  save() {
    this._tipoAct.saveActivityType(this.form.value).subscribe((r: any) => {
      console.log(r);
      this.getActivityTypes();
      this.modalService.dismissAll();
      this.form.reset();
      this._swal.show({
        icon: 'success',
        title: r.data,
        text: '',
        showCancel: false
      })
    })
  }

}
