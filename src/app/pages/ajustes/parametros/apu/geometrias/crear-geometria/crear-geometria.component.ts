import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { GeometriasService } from '../geometrias.service';
import { functionsUtils } from '../../../../../../core/utils/functionsUtils';
import { ValidatorsService } from '../../../../informacion-base/services/reactive-validation/validators.service';
import { SwalService } from '../../../../informacion-base/services/swal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-crear-geometria',
  templateUrl: './crear-geometria.component.html',
  styleUrls: ['./crear-geometria.component.scss'],
})
export class CrearGeometriaComponent implements OnInit {
  form: FormGroup;
  @ViewChild('modal') modal: any;
  imageString: any = '';
  typeImage: any = '';
  image: any = '';
  measures: any[] = [];
  id: any;
  message: any = '';
  geometry: any = {};
  measu: any;
  previsualizacion: any;
  loading: boolean;
  constructor(
    private _geometrias: GeometriasService,
    private fb: FormBuilder,
    private _validators: ValidatorsService,
    private _swal: SwalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.id ? this.loading = true : this.loading = false
    this.createForm();
    this.getMeasures();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', this._validators.required],
      image: [''],
      weight_formula: ['', this._validators.required],
      measures: [''],
    });
  }

  getGeometry() {
    this.loading = true
    this._geometrias.getGeometry(this.id).subscribe((r: any) => {
      this.geometry = r.data;
      this.form.patchValue({
        name: this.geometry.text,
        image: this.geometry.image,
        weight_formula: this.geometry.weight_formula,
        measures: this.geometry.measures
      });
      this.previsualizacion = this.geometry.image
      this.imageString = this.geometry.image
      this.checkedMeasures();
      this.loading = false;
    })
  }

  checkedMeasures(){
    for(let i in this.measures){
      for(let j in this.geometry.measures){
        if (this.measures[i].value == this.geometry.measures[j].id){
          this.measures[i].checked = true
        }
      }
    }
  }

  getMeasures() {
    this._geometrias.getMesuare().subscribe((r: any) => {
      this.measures = r.data;
      if (this.id) {
        this.getGeometry();
      }
    });
  }

  get fill() {
    return this.measures.filter((r) => r.checked);
  }
  
  onFileChanged(event) {
    if (event.target.files[0]) {
      this.previsualizacion = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(event.target.files[0])
      );
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.imageString = (<FileReader>event.target).result;
        const type = { ext: this.imageString };
        this.typeImage = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.image = base64;
      });
    }
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid) { return false; }
    let image = this.imageString;
    let measures = this.measures.reduce((acc, el) => {
      return el.checked ? [...acc, el.value] : acc;
    }, []);
    this.form.patchValue({
      image,
      measures,
    });
    if (measures != '') {
      if (this.id) {
        this._geometrias.update(this.form.value, this.id).subscribe((r: any) => {
          this._swal.show({
            icon: 'success',
            title: 'Actualizado correctamente',
            text: 'Se ha actualizado la geometria correctamente',
            showCancel: false,
            timer: 1000,
          })
          this.router.navigate(['/ajustes/parametros/apu/geometrias']);
        })
      } else {
        this._geometrias.save(this.form.value).subscribe((r: any) => {
          this._swal.show({
            icon: 'success',
            title: 'Creación exitosa',
            text: 'Se ha creado la geometria correctamente',
            showCancel: false,
            timer: 1000,
          })
          this.router.navigate(['/ajustes/parametros/apu/geometrias']);
        })
      }
    } else { return this.message = 'Por favor, seleccione'; }
  }

  get name_valid() {
    return this.form.get('name').invalid && this.form.get('name').touched;
  }

  /* get image_valid() {
    return (
      this.form.get('image').touched && !this.imageString
    );
  } */

  get weight_formula_valid() {
    return this.form.get('weight_formula').invalid && this.form.get('weight_formula').touched;
  }
}
