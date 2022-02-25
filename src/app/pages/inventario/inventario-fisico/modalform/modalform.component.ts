import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modalform',
  templateUrl: './modalform.component.html',
  styleUrls: ['./modalform.component.scss']
})
export class ModalformComponent implements OnInit {


  Funcionario_Cuenta;
  Funcionario_Digita;
  Codigo_Barras;
  queryParams

  /**
   * variables que contienen errores
   */
  Error_Funcionario_Cuenta = false;
  Error_Funcionario_Digita = false;
  Error_Codigo_Barras = false;

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal,
    private http: HttpClient, private router:Router
  ) {

  }

  ngOnInit() {
  }
  buscarDatos() {



  }

  listarProductosCategoria() {

    let Codigo_Barras = this.Codigo_Barras;
    if (!this.Funcionario_Digita || this.Funcionario_Cuenta=='') {
      this.Error_Funcionario_Digita = true;
      return false;
    }
    if (!this.Funcionario_Cuenta || this.Funcionario_Cuenta=='') {
      this.Error_Funcionario_Cuenta = true;
      return false;
    }
    if (!this.Funcionario_Digita || this.Funcionario_Digita=='' ) {
      this.Error_Funcionario_Digita = true;
      return false;
    }



    let params: any = {
      Contador:  this.Funcionario_Cuenta,
      Digitador: this.Funcionario_Digita,
      Codigo_Barras: this.Codigo_Barras
    }

    this.http.get(environment.ruta + 'php/inventariofisico/estiba/iniciar_inventario.php', { params })
      .subscribe((data: any) => {
        if (data.Tipo == 'success') {
          // localStorage.setItem("InventarioFisico", JSON.stringify(data));

          // localStorage.setItem("queryParams", '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&'));
          // this.queryParams = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
          //  this.router.navigate(['/inventariobarrido']);
          this.router.navigate(['/inventario/inventario-estiba',data.Id_Doc_Inventario_Fisico]);
          this.activeModal.close('Close click')

          const modalAlertReference = this.modalService.open(ModalAlert, { size: 'lg', centered: true, backdrop:'static'});
          modalAlertReference.componentInstance.tipo = data.Tipo
          modalAlertReference.componentInstance.title = data.Title
          modalAlertReference.componentInstance.texto = data.Text

        } else{
          const modalAlertReference = this.modalService.open(ModalAlert, { size: 'lg', centered: true, backdrop:'static'});
          modalAlertReference.componentInstance.tipo = data.Tipo
          modalAlertReference.componentInstance.title = data.Title
          modalAlertReference.componentInstance.texto = data.Text
        }
        //abre modal alerta



      });


  }

}


/** modal alert */

@Component({
  template: `
    <div class="modal-header header-red" [ngClass]="{'header-red':!success,'header-blue':success}">

      <h4 class="modal-title text-white">{{title}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body d-flex flex-row align-items-center">
       <i class="fa  fa-5x" [ngClass]="{'text-danger fa-times-circle':!success, 'text-primary fa-check-circle':success}"></i>
      <h5 class="ml-2 text-alert">{{texto}}</h5>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `,
  styleUrls: ['./modalform.component.scss']
})
export class ModalAlert {
  @Input() tipo;
  @Input() title;
  @Input() texto;
  success
  constructor(public activeModal: NgbActiveModal, private router:Router,private modalService: NgbModal) {



  }
  ngOnInit(): void {

    if (this.tipo=='success') {
      this.success=true;
    }else{
      this.success=false
    }

  }




}


