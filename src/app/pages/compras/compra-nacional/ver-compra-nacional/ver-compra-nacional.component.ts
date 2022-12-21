import { Component, Directive, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CompraNacionalService } from '../compra-nacional.service';
import Swal from 'sweetalert2';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { UserService } from 'src/app/core/services/user.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ver-compra-nacional',
  templateUrl: './ver-compra-nacional.component.html',
  styleUrls: ['./ver-compra-nacional.component.scss']
})
export class VerCompraNacionalComponent implements OnInit {
  public objeto:any = {
    'Costo Incorrecto' : 'Costo Incorrecto',
    'Proveedor Incorrecto' : 'Proveedor Incorrecto',
    'Productos Incorrectos' : 'Productos Incorrectos'
  };
  public Compra:any = [];
  public Productos:any = [];
  public Rechazo:any = [];
  public Total: number = 0;
  Fecha = new Date();
  public id:any = '';
  public SubTotalFinal:any = 0;
  public IvaFinal:any = 0;
  public TotalFinal:any = 0;
  public Actividades: any[]=[];
  /* TODO USR AuTH */
  public user = {Identificacion_Funcionario: this._user.user.id} ;
  public permiso: boolean = false;
  public Lista_Rechazo:any={};
  @ViewChild('confirmacionSwal') confimracionSwal:any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private _user: UserService,
    private _swal: SwalService,
    private _compras: CompraNacionalService
  ) {}

  ngOnInit() {

    this.id = this.route.snapshot.params["id"];
    this.init();
    this.http.get(environment.base_url + '/php/comprasnacionales/detalles_compras_nacionales', {params: { id: this.id }}).subscribe((res: any) => {
      this.Productos = res.data;
    /* this.http.get(environment.ruta + 'php/comprasnacionales/detalles_compras_nacionales.php', {params: { id: this.id }}).subscribe((data: any) => {
      this.Productos = data.Productos; */

      let subtotal = 0;
      let iva = 0;
      let subt_acumulada = 0;
      let total = 0;
      let iva_acumulada = 0;

      this.Productos.forEach(p => {
        this.Total += parseInt(p.Total);
        subtotal = parseFloat(p.Cantidad) * parseFloat(p.Costo);
        iva = ((parseFloat(p.Cantidad) * parseFloat(p.Costo)) * (parseFloat(p.Iva)/100));
        subt_acumulada += subtotal;
        iva_acumulada += iva;
        total += subtotal + iva;
      });
      this.IvaFinal = this.formatMoney(iva_acumulada);
      this.SubTotalFinal = this.formatMoney(subt_acumulada);
      this.TotalFinal = this.formatMoney(total);
    });


    this.http.get(environment.base_url+'/php/comprasnacionales/detalle_rechazo', { params: {} }).subscribe((res:any) => {
      res.data.forEach(value => {this.Lista_Rechazo[value.Id_Tipo_Rechazo]= value.Nombre});
    });
    /* this.http.get(environment.ruta+'php/comprasnacionales/detalle_rechazo.php', { params: { funcionario: this.user.Identificacion_Funcionario } }).subscribe((data:any) => {
      for (let i = 0; i < data.length; i++) {
        this.Lista_Rechazo[data[i].Id_Tipo_Rechazo] = data[i].Nombre;
      }
    }); */
  }

  async EstadoAprobacion(Estado){
    /* EstadoAprobacion(valor, Estado){ */
    const MENSAJE_ACCION = {
      Anulada: 'anular',
      Pendiente: 'activar',
      Aprobada: 'aprobar'
    }
    let decision = (Estado=="Rechazada")?
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
        text: 'Se dispone a '+MENSAJE_ACCION[Estado]+' esta orden de compra'+((Estado=='Aprobada')?' para proceder a solicitarla':''),
        icon: 'warning',
        showCancel: true
      })

    decision.then((result) => {
      if (result.isConfirmed) {

        let datos = {
          id:  this.id,
          estado:  Estado,
          funcionario:  this.user.Identificacion_Funcionario,
          motivo: (Estado=="Rechazada")?result.value:''
        }
          /* datos.append("motivo",valor) */

        this._compras.setEstadoCompra(datos).subscribe((res:any) => {
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

  init() {
    this._compras.getDatosComprasNacionales({params: { id: this.id }}).subscribe((res: any) => {
      this.Compra = res.data;
    });
    /* this.http.get(environment.ruta + 'php/comprasnacionales/datos_compras_nacionales.php', {params: { id: this.id }}).subscribe((data: any) => {
      this.Compra = data;
    }); */
    this._compras.getActividadOrdenCompra({params : { id : this.id }}).subscribe((res:any)=>{
      this.Actividades=res.data;
    });
    /* this.http.get(environment.ruta+'php/comprasnacionales/actividad_orden_compra.php',{params : { id : this.id }}).subscribe((data:any)=>{
      this.Actividades=data;
    });
 */
    this._compras.getDetallePerfil({ params: { funcionario: this.user.Identificacion_Funcionario } }).subscribe((res:any) => {
      this.permiso = res.data.status;
    })
   /*  this.http.get(environment.ruta+'php/comprasnacionales/detalle_perfil.php', { params: { funcionario: this.user.Identificacion_Funcionario } }).subscribe((data:any) => {
      this.permiso = data.status;
    }) */
  }
  formatMoney = (n,c=undefined,d=undefined,t=undefined) => {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i:any = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  }

}
