import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CompraNacionalService } from '../compra-nacional.service';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { UserService } from 'src/app/core/services/user.service';
@Component({
  selector: 'app-ver-compra-nacional',
  templateUrl: './ver-compra-nacional.component.html',
  styleUrls: ['./ver-compra-nacional.component.scss']
})
export class VerCompraNacionalComponent implements OnInit {
  public objeto: any = {
    'Costo Incorrecto': 'Costo Incorrecto',
    'Proveedor Incorrecto': 'Proveedor Incorrecto',
    'Productos Incorrectos': 'Productos Incorrectos'
  };

  activities: any[] = [];
  datosCabecera: any = {}
  loading: boolean;


  public Compra: any = [];
  public Productos: any = [];
  public Rechazo: any = [];
  public Total: number = 0;
  Fecha = new Date();
  public id: any = '';
  public SubTotalFinal: any = 0;

  public IvaFinal: any = 0;
  public TotalFinal: any = 0;
  public user = { Identificacion_Funcionario: this._user.user.id };
  public Lista_Rechazo: any = {};
  @ViewChild('confirmacionSwal') confimracionSwal: any;

  constructor(
    private route: ActivatedRoute,
    private _user: UserService,
    private _swal: SwalService,
    private _compras: CompraNacionalService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {

      this.id = params.get('id');
      this.getTipoRechazo();
      this.getData();
    })
  }

  getTipoRechazo() {
    this._compras.getTipoRechazo().subscribe((res: any) => {
      res.data.forEach(value => { this.Lista_Rechazo[value.Id_Tipo_Rechazo] = value.Nombre });
    });
  }

  getData() {
    this.loading = true;
    let params = {
      id: this.id
    }
    this._compras.getDatosComprasNacionales(params).subscribe((res: any) => {
      this.Compra = res.data;
      this.activities = res.data.activity
      this.datosCabecera = {
        Fecha: res.data.created_at,
        Codigo: res.data.Codigo,
        Titulo: res.data.Estado,
        CodigoFormato: res.data.format_code
      }
      this.loading = false;
    });
  }

  async EstadoAprobacion(Estado) {
    /* EstadoAprobacion(valor, Estado){ */
    const MENSAJE_ACCION = {
      Anulada: 'anular',
      Pendiente: 'activar',
      Aprobada: 'aprobar'
    }
    let decision = (Estado == "Rechazada") ?
      Swal.fire({
        title: '¿Está Seguro?',
        text: 'Se dispone a rechazar esta orden de compra, por favor seleccione un motivo',
        icon: 'warning',
        input: 'select',
        inputOptions: this.Lista_Rechazo,
        inputPlaceholder: 'Seleccione un Motivo',
        showCancelButton: true,
        confirmButtonText: 'Si, Rechazar',
        cancelButtonText: 'No, Dejame Comprobar!',
        confirmButtonColor: this._swal.buttonColor.confirm,
        cancelButtonColor: this._swal.buttonColor.cancel,
        reverseButtons: true,
        inputValidator: (value) => {
          return new Promise(function (resolve) {
            if (value !== '') {
              resolve('');
            } else {
              resolve('Por favor seleccione un motivo de rechazo.');
            }
          });
        }
      })
      :
      this._swal.show({
        title: '¿Está Seguro?',
        text: 'Se dispone a ' + MENSAJE_ACCION[Estado] + ' esta orden de compra' + ((Estado == 'Aprobada') ? ' para proceder a solicitarla' : ''),
        icon: 'warning',
        showCancel: true
      })

    decision.then((result) => {
      if (result.isConfirmed) {

        let datos = {
          id: this.id,
          estado: Estado,
          funcionario: this.user.Identificacion_Funcionario,
          motivo: (Estado == "Rechazada") ? result.value : ''
        }
        /* datos.append("motivo",valor) */

        this._compras.setEstadoCompra(datos).subscribe((res: any) => {
          /* this.http.post(environment.ruta+'php/comprasnacionales/actualiza_compra.php', datos).subscribe((data:any) => {
            this.confimracionSwal.title = data.titulo;
            this.confimracionSwal.text = data.mensaje;
            this.confimracionSwal.icon = data.tipo;
            this.confimracionSwal.fire(); */
          this._swal.show({
            icon: res.data.tipo,
            title: res.data.titulo,
            text: res.data.mensaje,
            timer: 1000,
            showCancel: false
          })
          this.ngOnInit();
        })
      }
    })
  }


  formatMoney = (n, c = undefined, d = undefined, t = undefined) => {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      s = n < 0 ? "-" : "",
      i: any = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
      j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  }

}
