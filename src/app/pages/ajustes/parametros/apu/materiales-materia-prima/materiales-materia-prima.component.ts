import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material';
import { ModalService } from 'src/app/core/services/modal.service';
import { UserService } from 'src/app/core/services/user.service';
import { consts } from 'src/app/core/utils/consts';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { MaterialesService } from '../materiales/materiales.service';
import { MaterialesMateriaPrimaService } from './materiales-materia-prima.service';

@Component({
  selector: 'app-materiales-materia-prima',
  templateUrl: './materiales-materia-prima.component.html',
  styleUrls: ['./materiales-materia-prima.component.scss']
})
export class MaterialesMateriaPrimaComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  loading: boolean = false;
  form: FormGroup;
  masksMoney = consts
  material: any = {};
  materials: any[] = [];
  materialsIndex: any[] = [];
  allMaterialsIndex: any[] = [];
  paginacion: any
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  filtro = {
    name: ''
  }
  constructor(
    private _modal: ModalService,
    private _swal: SwalService,
    private fb: FormBuilder,
    private _user: UserService,
    private _rawMaterialMaterials: MaterialesMateriaPrimaService,
    private _materials: MaterialesService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.createForm();
    await this.getMaterials();
    this.getMaterialsIndex();
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.material.id],
      material_id: ['', Validators.required],
      density: ['', Validators.required],
      kg_value: ['', Validators.required],
    });
  }

  async getMaterials(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination,
      ...this.filtro,
      company_id: this._user.user.person.company_worked.id
    }
    this.loading = true;
    await this._rawMaterialMaterials.getRawMaterialMaterials(params).toPromise().then((r: any) => {
      this.materials = r.data.data;
      this.loading = false;
      this.paginacion = r.data
      this.pagination.collectionSize = r.data.total;
    })
  }

  async getMaterialsIndex() {
    await this._materials.getMaterialsIndex().toPromise().then((res: any) => {
      this.allMaterialsIndex = res.data;
      this.materialsIndex = res.data.filter(material => {
        const exists = this.materials.some(m => m.material_id === material.id);
        return !exists;
      });
    })
  }

  async getMaterial(material) {
    this.material = { ...material };
    await this.getMaterialsIndex();
    let temp = this.allMaterialsIndex.filter(mat => mat.id == material.material_id);
    this.materialsIndex.push(temp[0])
    this.form.patchValue({
      id: this.material.id,
      material_id: this.material.material_id,
      density: this.material.density,
      kg_value: this.material.kg_value
    });
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

  openConfirm(confirm, titulo) {
    this.title = titulo;
    this._modal.open(confirm, 'lg')
    if (titulo != 'Editar material') {
      this.form.reset();
      this.getMaterialsIndex();
    }
  }

  save() {
    if (this.form.valid) {
      if (this.form.get('id').value) {
        this._rawMaterialMaterials.update(this.form.value, this.material.id).subscribe(async (r: any) => {
          this.form.reset();
          this._modal.close();
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
        this._rawMaterialMaterials.save(this.form.value).subscribe(async (r: any) => {
          this.form.reset();
          this._modal.close();
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
    } else {
      this._swal.show({
        icon: 'error',
        title: 'Campos incompletos',
        text: '',
        showCancel: false,
      })
    }
  }

}
