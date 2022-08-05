import { Component, OnInit, Input, Output, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { CierrecontableService } from '../cierrecontable.service';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PlanCuentasService } from '../../plan-cuentas/plan-cuentas.service';
import Swal from 'sweetalert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modalcierrecontable',
  templateUrl: './modalcierrecontable.component.html',
  styleUrls: ['./modalcierrecontable.component.scss']
})
export class ModalcierrecontableComponent implements OnInit, OnDestroy {

  @ViewChild('ModalCierreContable') ModalCierreContable: any;
  @Input() abrirModal: Observable<any> = new Observable;
  @Output() recargarListas: EventEmitter<any> = new EventEmitter;
  private _suscription: any;
  public modelCierre: any = {
    Id_Cierre_Contable: '',
    Mes: '',
    Anio: '',
    Tipo_Cierre: '',
    Observaciones: '',
    Id_Empresa: ''
  };
  public meses: any = [];
  public Anio: any = new Date().getFullYear();
  public alertOption: SweetAlertOptions = {};
  companies: any[] = [];
  constructor(
    private cierreContableService: CierrecontableService,
    private swalService: SwalService,
    private http: HttpClient,
    private modalService: NgbModal,
    private _planCuentas: PlanCuentasService
  ) {

    this.alertOption = {
      title: "¿Está Seguro?",
      text: "Se dispone a guardar el proceso de cierre",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      input: 'select',
      inputOptions: {
        Pcga: 'Imprimir en PCGA',
        Niif: 'Imprimir en NIIF'
      },
      preConfirm: (value) => {
        return new Promise((resolve) => {
          this.validarCierre(value)
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }
  }

  ngOnInit() {
    this._suscription = this.abrirModal.subscribe((data: any) => {
      this.modelCierre.Tipo_Cierre = data;
      this.openConfirm(this.ModalCierreContable)
      //this.ModalCierreContable.show();
    });

    this.getMeses();
    // this.ListasEmpresas();
  }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnDestroy() {
    if (this._suscription != null && this._suscription != undefined) {
      this._suscription.unsubscribe();
    }
  }
  /* 
    ListasEmpresas(){
      this._planCuentas.getCompanies().subscribe((data:any) => {
        this.companies = data.data;
      })
    } */

  private guardarCierre(datos, tipo) {
    this.http.post(environment.ruta + 'php/contabilidad/cierres/guardar_cierre.php', datos).subscribe((data: any) => {
      if (data.nroId) {
        this.openComprobantesCierreAnio(data.nroId, tipo);
      }
      //this.ModalCierreContable.hide();
      this.modalService.dismissAll(); 
      this.resetModel();
      Swal.fire({
        icon: data.codigo,
        title: data.titulo,
        text: data.mensaje
      })
      // this.swalService.ShowMessage(data);
      this.recargarListas.emit();
    })
  }

  private openComprobantesCierreAnio(id, tipo) {
    /* tipo = tipo == 'Pcga' ? '' : '&tipo_valor=Niif';
    window.open(this.generalService.Ruta_Principal+'php/contabilidad/cierres/movimientos_cierreanio_excel.php?id_registro='+id+'&id_funcionario_elabora='+this.Funcionario+tipo,'_blank');
    window.open(this.generalService.Ruta_Principal+'php/contabilidad/cierres/movimientos_cierreanio_excel.php?id_registro='+id+'&id_funcionario_elabora='+this.Funcionario+'&tipo_rep=act-pas'+tipo,'_blank'); */
  }

  validarCierre(tipo) {
    let info = this.cierreContableService.Utf8.encode(JSON.stringify(this.modelCierre));
    let datos = new FormData;
    datos.append('datos', info);

    this.http.post(environment.ruta + 'php/contabilidad/cierres/validar_cierre.php', datos).subscribe((data: any) => {
      if (data.codigo == 'success') {
        this.guardarCierre(datos, tipo);
      } else {
        Swal.fire({
          icon: data.codigo,
          text: data.mensaje,
          title: data.titulo
        })
        // this.swalService.ShowMessage(data);
      }
    })
  }

  private resetModel() {
    this.modelCierre = {
      Id_Cierre_Contable: '',
      Mes: '',
      Anio: '',
      Tipo_Cierre: '',
      Observaciones: ''
    };
  }

  getMeses() {
    this.meses = this.cierreContableService.getMeses();
  }

}
