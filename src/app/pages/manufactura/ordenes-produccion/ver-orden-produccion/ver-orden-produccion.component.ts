import { Component, ContentChild, ContentChildren, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { OrdenesProduccionService } from '../../services/ordenes-produccion.service';
import { gantt } from 'dhtmlx-gantt';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-ver-orden-produccion',
  templateUrl: './ver-orden-produccion.component.html',
  styleUrls: ['./ver-orden-produccion.component.scss']
})
export class VerOrdenProduccionComponent implements OnInit {
  @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;
  ruta;
  ruta2;
  datosCabecera = {
    Titulo: 'Orden de trabajo'
  }
  work_order_id;
  work_order;
  modal_title;
  modal_content;
  loading: boolean;
  constructor(
    private route: ActivatedRoute,
    private _work_order: OrdenesProduccionService,
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
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
    this.route.paramMap.subscribe(params => {
      this.work_order_id = params.get('id');
      //this.ruta2 = environment.url_assets + '/tinyfilemanager/tinyfilemanager.php?p=&fijo=op' + this.work_order_id;
      this.ruta = environment.url_assets + '/filemanager/filemanager/dialog.php?config=2&car=ordenes-produccion/op' + this.work_order_id;
      this.getWorkOrder();
    })
  }

  getWorkOrder() {
    this.loading = true
    this._work_order.getWorkOrder(this.work_order_id).subscribe((res: any) => {
      this.work_order = res.data;
      this.loading = false
    })
  }

  openModal(content, title, requirements) {
    title == 1 ? this.modal_title = 'Requisitos técnicos, funcionales y desempeño' : this.modal_title = 'Requisitos legales o reglamentos aplicacbles'
    this.modal_content = requirements
    this._modal.open(content)
  }

}
