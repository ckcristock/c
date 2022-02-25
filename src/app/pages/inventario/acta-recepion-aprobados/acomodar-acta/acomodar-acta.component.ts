import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-acomodar-acta',
  templateUrl: './acomodar-acta.component.html',
  styleUrls: ['./acomodar-acta.component.scss']
})
export class AcomodarActaComponent implements OnInit {

  public Fecha=new Date();
  public id=  this.route.snapshot.params["id"];
  public TipoActa = this.route.snapshot.params['tipo'];
  public Lugar = this.route.snapshot.params['lugar'];
  public idLugar = this.route.snapshot.params['idLugar'];
  public Datos:any = {};
  public Productos:any[]=[];
  
  public user = JSON.parse(localStorage.getItem('User'));
  public permiso: boolean = false;
  public SubTotalFinal = 0;
  public IvaFinal = 0;
  public TotalFinal = 0;
  public ActividadesActa:any[] = [];
  
  public alertOption:SweetAlertOptions;
  public alertOptionGuardar:SweetAlertOptions;
  public reducer_subt = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Subtotal);
  public reducer_iva = (accumulator, currentValue) => accumulator + (parseFloat(currentValue.Subtotal) * (parseInt(currentValue.Impuesto)/100));
  public Tipo ="Bodega";
  @ViewChild('confirmacionBodega') private confirmacionBodega: SwalComponent;
  @ViewChild('confirmacionSwal') confirmacionSwal:any;
  @ViewChild('actaAcomodadaSwal') actaAcomodadaSwal:any;
  @ViewChild('inventarioSwal') inventarioSwal:any;
  
  @ViewChild('codigos') codigoEstibas:any;
  @ViewChild("CodigoBarra") CodigoBarra: Array<ElementRef>;
    constructor(private route: ActivatedRoute, private http: HttpClient,
      public router: Router,) {
  
        this.alertOption = {
          title: "Operación exitosa",
          text: "Se han acomodado e ingresado correctamente el acta al inventario",
          showCancelButton: false,
          confirmButtonText: 'Ok',
          showLoaderOnConfirm: true,
          allowEscapeKey:false,
          icon: 'success',
          preConfirm: () => {
            return new Promise((resolve) => {
            this.redireccionar();
            })
          },
          allowOutsideClick: () => !swal.isLoading()
        }
        this.alertOptionGuardar = {
          title: "¿Está Seguro?",
          text: "Se dispone a acomodar los productos en las estibas e ingresarlos al inventario",
          showCancelButton: true,
          confirmButtonText: 'Si, Acomodar',
          cancelButtonText : 'No, Dejame Comprobar!',
          showLoaderOnConfirm: true,
          icon: 'warning',
  
          preConfirm: () => {
            return new Promise((resolve) => {
             this.validarProductos()
            })
          },
          allowOutsideClick: () => !swal.isLoading()
        }
       }
    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges {
      let queryParams = this.route.snapshot.queryParams;
      let params:any = {};
      params.id = this.id;
      params.Tipo_Acta = this.TipoActa;
      params.Lugar = this.Lugar;
      params.idLugar = this.idLugar;
      this.http.get(environment.ruta + 'php/bodega_nuevo/detalle_acta_recepcion_acomodar.php', {
        params: params
      }).subscribe((data: any) => {
        this.Datos=data.Datos;
        this.Productos=data.Productos;
        this.varlidarBodegaEnInventario();
      });
      this.http.get(environment.ruta+'php/actarecepcion/detalle_perfil.php', { params: { funcionario: this.user.Identificacion_Funcionario } }).subscribe((data:any) => {
        this.permiso = data.status;
      })
    }
  
    focus() {
      let codigos = document.getElementsByName("CodigoBarra");
      console.log('codigo BN',codigos);
      for (let index = 0; index < codigos.length; index++) {
        if (!this.Productos[index]['Id_Estiba']) {
          codigos[index].focus();
          break;
        }
      }
    }
    Puntero() {
      this.focus()
    }
    acomodarProductos(){
  
      let datos = new FormData();
  
      datos.append('id', this.id);
      datos.append('funcionario', this.user.Identificacion_Funcionario);
      datos.append('productos', JSON.stringify( this.Productos ));
      datos.append('tipo_acta',this.TipoActa);
  
      if ( this.Datos.Cambio_Estiba ) {
        datos.append('cambio_estiba','1');
      }
  
      this.http.post(environment.ruta+'php/actarecepcion_nuevo/acomodar_acta.php', datos).subscribe((data:any) => {
        //cambiar Swal
        if(data.Tipo=='success'){
          this.actaAcomodadaSwal.fire();
        }else{
          this.confirmacionSwal.title = data.Titulo;
          this.confirmacionSwal.text = data.Mensaje;
          this.confirmacionSwal.type = data.Tipo;
          this.confirmacionSwal.fire();
        }
      })
  
  
    }
    validarProductos(){
  
      for (const producto of this.Productos) {
        if (producto.Id_Estiba=='' || producto.Id_Estiba==undefined) {
          this.confirmacionSwal.title = 'Productos Inválidos';
          this.confirmacionSwal.text = 'Existen productos que no se le ha asignado una estiba, por favor verifique!';
          this.confirmacionSwal.type = 'error';
          this.confirmacionSwal.fire();
          return false;
        }
      }
  
       this.acomodarProductos();
    }
    validarEstiba(elemento,codigo:string){
  
      //validar si es ajuste cambio estiba * por ende la estiba debe ser obligatoriamente la ingresada en el mismo
      if (typeof elemento['Codigo_Barras_Estiba_Ajuste'] != 'undefined' &&  elemento['Codigo_Barras_Estiba_Ajuste'] ) {
  
        if ( elemento.Codigo_Barras_Estiba_Ajuste == codigo.toUpperCase() ) {
          elemento['Id_Estiba']=elemento.Id_Estiba_Ajuste;
  
        }else{
          if (elemento['Id_Estiba']) {
            elemento['Id_Estiba']='';
          }
          elemento['Codgo_Barras_Estiba']='';
  
          this.confirmacionSwal.type = 'error';
          this.confirmacionSwal.title = 'Error al seleccionar estiba';
          this.confirmacionSwal.text = 'La estiba que itenta seleccionar no coincide con la seleccionada en el ajuste';
          this.confirmacionSwal.fire();
        }
  
      }else{
        let Lugar = this.Lugar;
        let idLugar = this.idLugar;
        this.http.get(environment.ruta+'php/bodega_nuevo/validar_estiba.php',{
          params : { codigo_barras : codigo, idLugar, Lugar }
        }).subscribe((data:any)=>{
          if (data.Tipo=='success') {
            elemento['Id_Estiba']=data.Estiba.Id_Estiba;
          }else{
            if (elemento['Id_Estiba']) {
              elemento['Id_Estiba']='';
            }
            elemento['Codgo_Barras_Estiba']='';
  
            this.confirmacionSwal.type = data.Tipo;
            this.confirmacionSwal.title = data.Titulo;
            this.confirmacionSwal.text = data.Mensaje;
            this.confirmacionSwal.fire();
        }
        this.focus();
      });
    }
  
  
    }
    async varlidarBodegaEnInventario(){
      if(this.Datos.Id_Origen_Destino!=''){
  
        await this.http.get(`${environment.ruta}php/bodega_nuevo/validar_bodega_en_inventario.php`,{
           params:{'Id_Bodega_Nuevo':this.Datos.Id_Origen_Destino}})
         .toPromise()
         .then((data:any)=>{
           if(data.type == 'error'){
             this.inventarioSwal.title = data.title;
             this.inventarioSwal.text = data.message;
             this.inventarioSwal.type = "error";
             this.inventarioSwal.fire();
             this.Datos.Id_Origen_Destino = '';
           }
       })
      }
  
    }
    redireccionar(){
      let dir = this.Lugar == 'Punto_Dispensacion' ? '/actarecepcionaprobadospuntos' : '/inventario/acta-recepcion-aprobados'
      this.router.navigate([dir])
    }
  

}
