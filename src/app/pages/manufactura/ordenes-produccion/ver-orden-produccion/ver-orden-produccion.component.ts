import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';
import { OrdenesProduccionService } from '../../services/ordenes-produccion.service';

@Component({
  selector: 'app-ver-orden-produccion',
  templateUrl: './ver-orden-produccion.component.html',
  styleUrls: ['./ver-orden-produccion.component.scss']
})
export class VerOrdenProduccionComponent implements OnInit {
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
    this.route.paramMap.subscribe(params => {
      this.work_order_id = params.get('id');
      this.getWorkOrder();
    })
  }

  getWorkOrder() {
    this.loading = true
    this._work_order.getWorkOrder(this.work_order_id).subscribe((res:any) => {
      this.work_order = res.data;
      this.loading = false
    })
  }

  openModal(content, title, requirements){
    title == 1 ? this.modal_title ='Requisitos técnicos, funcionales y desempeño' : this.modal_title = 'Requisitos legales o reglamentos aplicacbles'
    this.modal_content = requirements
    this._modal.open(content)
  }

}
