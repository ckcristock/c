import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { PlanCuentasService } from '../plan-cuentas.service';

@Component({
  selector: 'app-import-puc',
  templateUrl: './import-puc.component.html',
  styleUrls: ['./import-puc.component.scss']
})
export class ImportPucComponent implements OnInit {

  @ViewChild('modal') modal;
  view: boolean;
  fileString: any;
  file: any;
  type: any;
  constructor(
    private _modal: ModalService,
    private _swal: SwalService,
    private _planCuentas: PlanCuentasService
  ) { }

  ngOnInit(): void {
  }

  open() {
    this._modal.open(this.modal, 'lg')
  }

  save() {

  }

  onFileSelected(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      const types = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido'
        });
        return null
      }

      var reader = new FileReader();
      let data: any = {}
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        data.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        data.file = base64;
        this.validateImport(data)
      });

    }
  }

  validateImport(data) {
    this._planCuentas.validateImport(data).subscribe((res: any) => {

    })
  }

}
