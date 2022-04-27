import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { CorteLaserMaterialService } from './corte-laser-material.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-corte-laser-material',
  templateUrl: './corte-laser-material.component.html',
  styleUrls: ['./corte-laser-material.component.scss']
})
export class CorteLaserMaterialComponent implements OnInit {
  @ViewChild('modal') modal: any;
  loading: boolean = false;
  form: FormGroup;
  title: any = 'Nuevo Material';
  materials: any[] = [];
  thicknesses: any[] = [];
  material: any = {};
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  variables = [
    { label: 'Espesor', var: 'thickness' },
    { label: 'Cantidad Laminas', var: 'sheets_amount' },
    { label: 'Largo', var: 'long' },
    { label: 'Ancho', var: 'width' },
    { label: 'Longitud total', var: 'total_length' },
    { label: 'Cant. Agujeros', var: 'amount_holes' },
    { label: 'Diametro', var: 'diameter' },
    { label: 'Perim. Total Agujero', var: 'total_hole_perimeter' },
    { label: 'Tiempo', var: 'time' },
    { label: 'Valor Unitario', var: 'unit_value' },
    { label: 'Velocidad Real', var: 'actual_speed' },
    { label: 'Seg. Percing', var: 'seconds_percing' }
  ]


  constructor(
    private fb: FormBuilder,
    private _validators: ValidatorsService,
    private _cutLaserM: CorteLaserMaterialService,
    private _swal: SwalService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getMaterials();
  }
  closeResult = '';
  
  public openConfirm(confirm, titulo) {
    this.title = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  public openConfirm2(confirm) {
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

  closeModalVer() {
    this.modalService.dismissAll(); 
    this.materialsList.clear();
    this.form.reset();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.material.id],
      name: ['', this._validators.required],
      formula: ['', this._validators.required],
      materials: this.fb.array([]),
    });
  }

  getMaterial(material) {
    this.material = material;
    //this.title = 'Editar Material';
    this.form.patchValue({
      id: this.material.id,
      name: this.material.name,
      formula: this.material.formula
    });
    this.materialsList.clear();
    this.material.cut_laser_material_value.forEach(r => {
      let group = this.fb.group({
        thickness: [r.thickness],
        unit_value: [r.unit_value],
        actual_speed: [r.actual_speed],
        seconds_percing: [r.seconds_percing]
      });
      this.materialsList.push(group);
    });
  }


  materialControl() {
    let material = this.fb.group({
      thickness: [0],
      unit_value: [0],
      actual_speed: [0],
      seconds_percing: [0]
    });
    return material;
  }

  get materialsList() {
    return this.form.get('materials') as FormArray;
  }

  newMaterial() {
    let material = this.materialsList;
    material.push(this.materialControl());
  }

  deleteMaterial(i) {
    this.materialsList.removeAt(i);
  }

  getMaterials(page = 1) {
    this.pagination.page = page;
    this.loading = true;
    this._cutLaserM.getMaterials(this.pagination).subscribe((r: any) => {
      this.materials = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  save() {
    if (this.form.get('id').value) {
      this._cutLaserM.update(this.form.value, this.material.id).subscribe((r: any) => {
        this.form.reset();
        this.modalService.dismissAll(); 
        this.materialsList.clear();
        this.getMaterials();
        this._swal.show({
          icon: 'success',
          title: 'Material actualizado con éxito',
          text: '',
          showCancel: false
        })
      })
    } else {
      this._cutLaserM.save(this.form.value).subscribe((r: any) => {
        this.form.reset();
        this.modalService.dismissAll(); 
        this.materialsList.clear();
        this.getMaterials();
        this._swal.show({
          icon: 'success',
          title: 'Material creado con éxito',
          text: '',
          showCancel: false
        })
      })
    }
  }
}
