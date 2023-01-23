import { Component, ContentChild, ContentChildren, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { OrdenesProduccionService } from '../../services/ordenes-produccion.service';
import { gantt } from 'dhtmlx-gantt';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
@Component({
  selector: 'app-ver-orden-produccion',
  templateUrl: './ver-orden-produccion.component.html',
  styleUrls: ['./ver-orden-produccion.component.scss']
})
export class VerOrdenProduccionComponent implements OnInit {
  @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;
  ruta;
  ruta2;
  fileString: any = '';
  fileAttr = 'Archivo PDF'
  file: any = '';
  file_name: any = '';
  type: any = '';
  datosCabecera = {
    Titulo: 'Orden de trabajo',
    Fecha: '',
    Codigo: '',
    CodigoFormato: ''
  }
  work_order_id;
  work_order;
  modal_title;
  blueprintForm: FormGroup;
  modal_content;
  loading: boolean;
  constructor(
    private route: ActivatedRoute,
    private _work_order: OrdenesProduccionService,
    private _modal: ModalService,
    private fb: FormBuilder,
    private _user: UserService,
    private _swal: SwalService,
  ) { }

  ngOnInit(): void {
    this.ganttRenderice();
    this.route.paramMap.subscribe(params => {
      this.work_order_id = params.get('id');
      this.ruta = environment.url_assets + '/filemanagerOT/filemanager/dialog.php?config=2&car=ordenes-produccion/op' + this.work_order_id;
      this.createBlueprintForm();
      this.getWorkOrder();
    })
  }

  createBlueprintForm() {
    this.blueprintForm = this.fb.group({
      general_set: ['', Validators.required],
      set_name: ['', Validators.required],
      file: ['', Validators.required],
      predetermined: [true],
      work_order_id: [this.work_order_id],
      person_id: [this._user.user.person.id]
    })
  }

  onFileSelected(event) {
    if (event.target.files[0]) {

      let file = event.target.files[0];
      const types = ['application/pdf']
      if (!types.includes(file.type)) {
        this._swal.show({
          icon: 'error',
          title: 'Error de archivo',
          showCancel: false,
          text: 'El tipo de archivo no es válido'
        });
        return null
      }
      this.file_name = event.target.files[0].name;
      this.fileAttr = 'Archivo cargado'
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        this.type = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
      });

    }
  }

  uploadBlueprint() {
    if (this.blueprintForm.invalid) {
      this._swal.show({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor revisa la información y vuelve a intentarlo',
        showCancel: false
      })
    } else {
      this._swal.show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Vamos a agregar el plano'
      }).then(r => {
        if (r.isConfirmed) {
          let data = {
            ...this.blueprintForm.value,
            file_base64: this.file
          }
          this._work_order.uploadBlueprint(data).subscribe((res: any) => {
            this._swal.show({
              icon: 'success',
              title: 'Correcto',
              text: res.data,
              showCancel: false,
              timer: 1000
            })
          })
        }
      })
    }
  }

  ganttRenderice() {
    gantt.config.date_format = "%d-%m-%Y %H:%i";
    gantt.config.autosize = "y"
    gantt.config.columns = [
      { name: "text", label: "Pieza", tree: true, width: '*', min_width: 150, max_width: 300 },
      { name: "start_date", label: "Inicio", align: "center" },
      { name: "end_date", label: "Fin", align: "center" },
      { name: "duration", label: "Duración", align: "center" },
      { name: "add", label: "" }
    ];
    gantt.i18n.setLocale("es");
    gantt.config.duration_unit = "hour";
    gantt.config.grid_elastic_columns = true;
    gantt.config.work_time = true;
    gantt.config.scales = [
      { unit: "day", step: 1, format: "%j, %D" },
      { unit: "hour", step: 1, format: "%H" }
    ];

    gantt.init(this.ganttContainer.nativeElement);
  }

  getWorkOrder() {
    this.loading = true
    this._work_order.getWorkOrder(this.work_order_id).subscribe((res: any) => {
      this.work_order = res.data;
      this.datosCabecera.Codigo = res.data.code;
      this.datosCabecera.Fecha = res.data.date;
      this.datosCabecera.CodigoFormato = res.data.format_code;
      this.loading = false
    })
  }

  openModal(content, title, requirements) {
    title == 1 ? this.modal_title = 'Requisitos técnicos, funcionales y desempeño' : this.modal_title = 'Requisitos legales o reglamentos aplicacbles'
    this.modal_content = requirements
    this._modal.open(content)
  }

}
