import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { MaquinasHerramientasService } from './maquinas-herramientas.service';
import { UnidadesMedidasService } from '../unidades-medidas/unidades-medidas.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-maquinas-herramientas',
  templateUrl: './maquinas-herramientas.component.html',
  styleUrls: ['./maquinas-herramientas.component.scss']
})
export class MaquinasHerramientasComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  loading: boolean = false;
  form: FormGroup;
  title: string = 'Nueva maquina';
  units: any[] = [];
  machines: any[] = [];
  machine: any = {};
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
    private _machine: MaquinasHerramientasService,
    private _swal: SwalService,
    private _units: UnidadesMedidasService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getUnits();
    this.getMachines();
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

  createForm() {
    this.form = this.fb.group({
      id: [this.machine.id],
      name: ['', this._validators.required],
      unit_id: ['', this._validators.required],
      unit_cost: ['', this._validators.required],
      type_id: ['', this._validators.required]
    })
  }

  getUnits() {
    this._units.selectUnits().subscribe((r: any) => {
      this.units = r.data;
    })
  }

  getMaquine(machine) {
    this.machine = { ...machine };
    //this.title = 'Actualizar maquina';
    this.form.patchValue({
      id: this.machine.id,
      name: this.machine.name,
      unit_id: this.machine.unit_id,
      unit_cost: this.machine.unit_cost,
      type_id: this.machine.type_id
    })
  }

  getMachines(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._machine.getMachines(params).subscribe((r: any) => {
      this.machines = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  save() {
    this._machine.save(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      this.form.reset();
      this.getMachines();
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
