import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TiposRetencionesService } from './tipos-retenciones.service';
import { SwalService } from '../../informacion-base/services/swal.service';
import { OperatorFunction, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tipos-retenciones',
  templateUrl: './tipos-retenciones.component.html',
  styleUrls: ['./tipos-retenciones.component.scss']
})
export class TiposRetencionesComponent implements OnInit {
  form: FormGroup;
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose(){
    if (this.matPanel == false){
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  loading: boolean = false;
  accountPlan: any[] = [];
  retentionTypes: any[] = [];
  retention: any = {};
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtros = {
    nombre: '',
    porcentaje: '',
    cuentaAsociada: '',
    estado: ''
  }
  constructor(
    private fb: FormBuilder,
    private _retentionType: TiposRetencionesService,
    private _swal: SwalService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getRetentionTypes();
    this.getAccountPlan();
  }

  openModal() {
    this.modal.show();

  }

  closeModal() {
    this.modalService.dismissAll();

  }

  closeResult = '';
public openConfirm(confirm, titulo){
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

  search: OperatorFunction<string, readonly { code }[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 3),
      map((term) =>
        this.accountPlan
          .filter((state) => new RegExp(term, 'mi').test(state.code))
          .slice(0, 10)
      )
    );

  inputFormatBandListValue(value: any) {
    if (value.code)
      return value.code
    return value;
  }

  resultFormatBandListValue(value: any) {
    return value.code;
  }

  getAccountPlan() {
    this._retentionType.getAccountPlan().subscribe((r: any) => {
      this.accountPlan = r.data;
    })
  }

  getTipo() {
    let data = this.form.get('account_plan_id').value;
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.retention.id],
      name: ['', Validators.required],
      account_plan_id: ['', Validators.required],
      account_plan: ['', Validators.required],
      percentage: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  AsignarCuenta(e: NgbTypeaheadSelectItemEvent) {
    this.form.get('account_plan_id').setValue(e.item.id);
    //let data = this.form.get('account_plan_id').value;
  }

  getRetentionTypes(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtros
    }
    this.loading = true;
    this._retentionType.getRetentionType(params).subscribe((r: any) => {
      this.retentionTypes = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    });
  }

  getRetention(retention) {
    this.retention = { ...retention };
    this.form.patchValue({
      id: this.retention.id,
      name: this.retention.name,
      account_plan_id: this.retention.account_plan_id,
      account_plan: this.retention.account_plan,
      percentage: this.retention.percentage,
      description: this.retention.description
    });
  }

  save() {
    this._retentionType.updateOrCreateRetentionType(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getRetentionTypes();
      this._swal.show({
        title: r.data,
        icon: 'success',
        text: '',
        timer: 1000,
        showCancel: false
      })
    })
  }

  activateOrInactivate(retention, state) {
    let data = {
      id: retention.id,
      state
    }
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      text: (data.state == 'Inactivo' ? '¡El tipo de retención de anulará!' : '¡El tipo de retención de activará!'),
      showCancel: true,
    }).then((r) => {
      if (r.isConfirmed) {
        this._retentionType.updateOrCreateRetentionType(data).subscribe((r) => {
          this.getRetentionTypes();
          this._swal.show({
            icon: 'success',
            title: (data.state == 'Inactivo' ? 'Tipo de retención inhabilitado!' : '¡Tipo de retención activado!'),
            text: (data.state == 'Inactivo' ? 'El tipo de retención ha sido anulado con éxito.' : 'El tipo de retención ha sido activado con éxito.'),
            showCancel: false,
            timer: 1000
          })
        })
      }
    });
  }

}
