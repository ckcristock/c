import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { CorteLaserMaterialService } from './corte-laser-material.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatAccordion } from '@angular/material/expansion';
import { MaterialesService } from '../materiales/materiales.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-corte-laser-material',
  templateUrl: './corte-laser-material.component.html',
  styleUrls: ['./corte-laser-material.component.scss']
})
export class CorteLaserMaterialComponent implements OnInit {
  @ViewChild('modal') modal: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  loading: boolean = false;
  form: FormGroup;
  masksMoney = consts;
  title: any = 'Nuevo material';
  materials: any[] = [];
  materialsIndex: any[] = [];
  allMaterialsIndex: any[] = [];
  thicknesses: any[] = [];
  material: any = {};
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
  variables = [
    { label: 'Espesor', var: 'thickness' },
    { label: 'Cantidad láminas', var: 'sheets_amount' },
    { label: 'Largo', var: 'long' },
    { label: 'Ancho', var: 'width' },
    { label: 'Longitud total', var: 'total_length' },
    { label: 'Cantidad agujeros', var: 'amount_holes' },
    { label: 'Diámetro', var: 'diameter' },
    { label: 'Perimetro total agujero', var: 'total_hole_perimeter' },
    { label: 'Tiempo', var: 'time' },
    { label: 'Valor unitario', var: 'unit_value' },
    { label: 'Velocidad real', var: 'actual_speed' },
    { label: 'Segundos percing', var: 'seconds_percing' }
  ]


  constructor(
    private fb: FormBuilder,
    private _validators: ValidatorsService,
    private _cutLaserM: CorteLaserMaterialService,
    private _swal: SwalService,
    private _materials: MaterialesService,
    private modalService: NgbModal,
    private _modal: ModalService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.createForm();
    await this.getMaterials();
    this.getMaterialsIndex();
  }

  openConfirm(confirm, titulo) {
    this.title = titulo;
    this.materialsList.clear();
    this._modal.open(confirm, 'xl')
    if (titulo != 'Editar material') {
      this.form.reset();
      this.getMaterialsIndex();
    }
  }
  openConfirm2(confirm) {
    this._modal.open(confirm, 'md')
  }
  /* this.form.reset();
  this.materialsList.clear(); */

  async getMaterialsIndex() {
    await this._materials.getMaterialsIndex().toPromise().then((res: any) => {
      this.allMaterialsIndex = res.data;
      this.materialsIndex = res.data.filter(material => {
        const exists = this.materials.some(m => m.material_id === material.id);
        return !exists;
      });
    })
  }


  closeModalVer() {
    this.modalService.dismissAll();
    this.materialsList.clear();
    this.form.reset();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.material.id],
      material_id: ['', this._validators.required],
      formula: ['', this._validators.required],
      materials: this.fb.array([]),
    });
  }

  async getMaterial(material) {
    this.material = material;
    //this.title = 'Editar Material';
    await this.getMaterialsIndex();
    let temp = this.allMaterialsIndex.filter(mat => mat.id == material.material_id);
    this.materialsIndex.push(temp[0])
    this.form.patchValue({
      id: this.material.id,
      material_id: this.material.material_id,
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

  async getMaterials(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    await this._cutLaserM.getMaterials(params).toPromise().then((r: any) => {
      this.materials = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
  }

  save() {
    if (this.form.valid) {

      if (this.form.get('id').value) {
        this._cutLaserM.update(this.form.value, this.material.id).subscribe(async (r: any) => {
          this.form.reset();
          this.modalService.dismissAll();
          this.materialsList.clear();
          await this.getMaterials();
          this.getMaterialsIndex();
          this._swal.show({
            icon: 'success',
            title: 'Material actualizado con éxito',
            text: '',
            showCancel: false,
            timer: 1000,
          })
        })
      } else {
        this._cutLaserM.save(this.form.value).subscribe(async (r: any) => {
          this.form.reset();
          this.modalService.dismissAll();
          this.materialsList.clear();
          await this.getMaterials();
          this.getMaterialsIndex();
          this._swal.show({
            icon: 'success',
            title: 'Material creado con éxito',
            text: '',
            showCancel: false,
            timer: 1000,
          })
        })
      }
    }
  }
}
