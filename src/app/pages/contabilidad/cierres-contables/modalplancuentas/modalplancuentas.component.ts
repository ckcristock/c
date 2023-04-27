import { Component, OnInit, Input, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modalplancuentas',
  templateUrl: './modalplancuentas.component.html',
  styleUrls: ['./modalplancuentas.component.scss']
})
export class ModalplancuentasComponent implements OnInit {

  @Input('abrirPlanesCuenta') abrirPlanesCuenta: EventEmitter<string>;
  @ViewChild('ModalPlanes') ModalPlanes;
  public tipoCierre = '';
  public Planes_Cuentas = [];
  public loading = false;
  public filtros = {
    nombre: '',
    codigo: '',
    tipoCierre: ''
  }
  constructor(private modalService: NgbModal, public http: HttpClient) { }

  ngOnInit() {
    this.abrirPlanesCuenta.subscribe(data => {
      this.tipoCierre = data;
      this.loading = true;
      //this.ModalPlanes.show();
      this.openConfirm(this.ModalPlanes)
      setTimeout(() => {
        this.buscarPlanes();
      }, 300);
    });
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {
    this.ocultar()

  }

  buscarPlanes() {
    this.loading = true;
    let filtros = JSON.stringify(this.filtros);
    this.http.get(environment.base_url + '/php/plancuentas/get_planes_cuentas.php?filtros=' + filtros + '&tipoCierre=' + this.tipoCierre).subscribe(planes => {
      this.Planes_Cuentas = planes['query_result'];
      this.loading = false;

    })

  }

  setTipoPlan(plan) {
    let data = new FormData();
    data.append('tipo_cierre', this.tipoCierre);
    data.append('id_plan_cuenta', plan.Id_Plan_Cuentas);
    data.append('valor_actualizar', plan['Tipo_Cierre_' + this.tipoCierre]);

    this.http.post(environment.base_url + '/php/plancuentas/set_plan_cuentas_tipo_cierre.php', data)
      .toPromise().catch(err => {
      })

  }


  OnDestroy() {
    this.abrirPlanesCuenta.unsubscribe();
  }

  ocultar() {
    this.Planes_Cuentas = [];
    //this.ModalPlanes.hide();
    this.modalService.dismissAll();
  }
}
