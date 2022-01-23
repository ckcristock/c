import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { ValidatorsService } from 'src/app/pages/ajustes/informacion-base/services/reactive-validation/validators.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import Swal from 'sweetalert2';
import { DescargoService } from './descargo.service';

@Component({
  selector: 'app-descargo',
  templateUrl: './descargo.component.html',
  styleUrls: ['./descargo.component.scss']
})
export class DescargoComponent implements OnInit {

  pagination = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtros: any = {
    person: '',
    status: '',
    code: ''
  }
  loading = false;

  processSelected: any;
  process: any;
  formSeguimiento: FormGroup;
  anotaciones: any[] = [];
  fullNameSelected: string = '';
  file: any;

  fileAnotacion: any;
  fileString: any;
  type: any;


  anotacion: {
    person_id: string,
    description: string,
    disciplinary_process_id: any,
    date: any,
    id?: number,
    file?: any,
  }


  constructor(
    private fb: FormBuilder,
    private _descargo: DescargoService,
    private rutaActiva: ActivatedRoute,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {

    this.filtros.code = this.rutaActiva.snapshot.params.id;
    this.getDisciplinaryProcess();
    this.createFormSeguimiento();
  }




  createFormSeguimiento() {
    this.formSeguimiento = this.fb.group({
      anotacion: ['', Validators.required]
    });    
  }

  getDisciplinaryProcess(page = 1) {

    let params = {
      ...this.pagination, ...this.filtros
    }

    this.loading = true;
    this.pagination.page = page;
    this._descargo.getDisciplinaryProcess(params)
      .subscribe((res: any) => {
        this.process = res.data.data;
        this.pagination.collectionSize = res.data.total;
      }, () => { }, () => {
        this.processSelected = this.process[0];
        console.log(this.processSelected);
        
        this.anotaciones = JSON.parse(this.processSelected.anotaciones ? this.processSelected.anotaciones : null) || [];
        this.file = this.processSelected.file;
        this.fullNameSelected = `${this.processSelected.first_name} ${this.processSelected.first_surname}`
        this.loading = false;
      });
  }


  onFileChanged(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      const types = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg']
      if (!types.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'Error de archivo',
          text: 'El tipo de archivo no es válido'
        });
        return null
      }

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        this.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.fileAnotacion = base64;
      });


    }
  }

  agregarAnotacion() {

    this._swal.show({
      title: '¿Estas seguro?',
      text: 'Se dispone a guardar la anotación',
      icon: 'question'
    }).then(r => {
      if (r.isConfirmed) {
        this.anotacion = {
          person_id: 'Yo', //persona logueada
          date: new Date(),
          disciplinary_process_id: this.filtros.code,
          description: this.formSeguimiento.value.anotacion,
          file: this.fileAnotacion
        }
        this.anotaciones.push(this.anotacion)
        this.formSeguimiento.reset();
        this.fileAnotacion = null;
        this._descargo.createAnotacion(this.anotacion)

      }
    })


  }


  modifyProcess() {

    this.processSelected.anotaciones = JSON.stringify(this.anotaciones)
    // this.descargoService.modifyProcess(this.processSelected)

  }

  download(file) {
    this._descargo.download(file)
      .subscribe((response: BlobPart) => {
        let blob = new Blob([response], { type: "application/pdf" });
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = file;
        link.click();
        this.loading = false
      }),
      error => { console.log('Error downloading the file'); this.loading = false },
      () => { console.info('File downloaded successfully'); this.loading = false };
  }

}
