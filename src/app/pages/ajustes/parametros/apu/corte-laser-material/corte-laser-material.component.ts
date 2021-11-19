import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { CorteLaserMaterialService } from './corte-laser-material.service';
import { SwalService } from '../../../informacion-base/services/swal.service';

@Component({
  selector: 'app-corte-laser-material',
  templateUrl: './corte-laser-material.component.html',
  styleUrls: ['./corte-laser-material.component.scss']
})
export class CorteLaserMaterialComponent implements OnInit {
  @ViewChild('modal') modal:any;
  loading:boolean = false;
  form: FormGroup;
  title:any = '';
  materials:any[] = [];
  thicknesses:any[] = [];
  material:any = {};
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  constructor( 
    private fb: FormBuilder,
    private _validators: ValidatorsService,
    private _cutLaserM: CorteLaserMaterialService,
    private _swal: SwalService
  ) { } 

    ngOnInit(): void {
      this.createForm();
      this.getMaterials();
    }
    
    openModal(){
      this.modal.show();
      this.title = 'Nuevo Material';
    }
    
    closeModalVer(){
      this.modal.hide();
      this.materialsList.clear();
      this.form.reset();
    }
    
    createForm(){
    this.form = this.fb.group({
      id: [this.material.id],
      name: ['', this._validators.required],
      materials: this.fb.array([]),
    });
    }
    
    getMaterial(material){
      this.material = material;
      this.title = 'Editar Material';
      this.form.patchValue({
        id: this.material.id,
        name: this.material.name
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
  
    
    materialControl(){
      let material = this.fb.group({
        thickness: [0],
        unit_value: [0],
        actual_speed: [0],
        seconds_percing: [0]
      });
      return material;
    }
    
    get materialsList(){
      return this.form.get('materials') as FormArray;
    }
    
    newMaterial(){
      let material = this.materialsList;
      material.push(this.materialControl());
    }
    
    deleteMaterial(i){
      this.materialsList.removeAt(i);
    }
    
    getMaterials( page = 1 ){
      this.pagination.page = page;
      this.loading = true;
      this._cutLaserM.getMaterials(this.pagination).subscribe((r:any) => {
      this.materials = r.data.data;
      this.loading = false;
      this.pagination.collectionSize = r.data.total;
    })
    }
    
    save(){
      if (this.form.get('id').value) {
        this._cutLaserM.update(this.form.value, this.material.id).subscribe((r:any) => {
        this.form.reset();
        this.modal.hide();
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
        this._cutLaserM.save(this.form.value).subscribe((r:any) =>{
        this.form.reset();
        this.modal.hide();
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
