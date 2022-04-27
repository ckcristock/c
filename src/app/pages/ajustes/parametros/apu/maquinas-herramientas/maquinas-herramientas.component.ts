import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { MaquinasHerramientasService } from './maquinas-herramientas.service';
import { UnidadesMedidasService } from '../unidades-medidas/unidades-medidas.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-maquinas-herramientas',
  templateUrl: './maquinas-herramientas.component.html',
  styleUrls: ['./maquinas-herramientas.component.scss']
})
export class MaquinasHerramientasComponent implements OnInit {
  @ViewChild('modal') modal: any;
  loading: boolean = false;
  form: FormGroup;
  title: string = 'Nueva maquina';
  units: any[] = [];
  machines: any[] = [];
  machine: any = {};
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
  openModal() {
    this.modal.show();

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
    this._units.getUnits().subscribe((r: any) => {
      this.units = r.data;
    })
  }

  getMaquine(machine) {
    this.machine = { ...machine };
    //this.title = 'Actualizar maquina';
    let type_id = parseInt(this.machine.type_id);
    this.form.patchValue({
      id: this.machine.id,
      name: this.machine.name,
      unit_id: this.machine.unit_id,
      unit_cost: this.machine.unit_cost,
      type_id: type_id
    })
  }

  getMachines() {
    this.loading = true;
    this._machine.getMachines().subscribe((r: any) => {
      this.machines = r.data.data;
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
        showCancel: false
      })
    })
  }

}
