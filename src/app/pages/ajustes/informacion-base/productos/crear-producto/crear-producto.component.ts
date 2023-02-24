import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { functionsUtils } from '../../../../../core/utils/functionsUtils';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss'],
})
export class CrearProductoComponent implements OnInit {
  public Fotos: any;
  timeout: any;
  Familias: any[];
  Codigo_Cum: any;
  PrincipioActivo: any;
  Presentacion: any;
  Concentracion: any;
  NombreComercial: any;
  Embalaje: any;
  LaboratorioGenerico: any;
  LaboratorioComercial: any;
  Familia: any;
  CantidadMinima: any;
  CantidadMaxima: any;
  ATC: any;
  DescripcionATC: any;
  Invima: any;
  FechaExpedicionInvima: any;
  FechaVencimientoInvima: any;
  PrecioMinimo: any;
  PrecioMaximo: any;
  TipoRegulacion: any;
  TipoPos: any;
  ViaAdministracion: any;
  UnidadMedida: any;
  Cantidad: any;
  Regulado: any;
  Tipo: any;
  PesoPresentacionMinima: any;
  PesoPresentacionRegular: any;
  PesoPresentacionMaxima: any;
  CodigoBarras: any;
  CantidadPresentacion: any;
  Mantis: any;
  RotativoC: '';
  RotativoD: '';
  Imagen: any;
  IdCategoria: any;
  NombreListado: any;
  Referencia: any;
  respuesta: any;
  company_id: any;
  Si: boolean;
  public Forma_Farmaceutica: any = '';
  public Lista: any = [];
  public Codigo_Barras: any = '';
  /* TODO ACTUALIZAR FUNCIONARIO */

  public Identificacion_Funcionario = '1';

  public productos: any[];

  public fieldDinamic: any[];
  public fieldDinamicSubcategory: any[] = [];

  public IdProductos: any = '';
  public Subcategoria: any[] = [];
  public Direcciones = [
    {
      cum: 'wqeu-3uhz.json',
    },
    {
      cum: '994u-gm46.json',
    },
    { cum: '8tya-2uai.json' },
    { cum: '6nr4-fx8r.json' },
    { cum: '7c5e-muu4.json' },
  ];
  public Bandera: any[] = [];
  public Material = 'Dispositivo';
  public Medicamento = 'Medicamento';

  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private _user: UserService
  ) { }

  ngOnInit() {
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Familia' },
      })
      .subscribe((data: any) => {
        this.Familias = data;
      });
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Subcategoria' },
      })
      .subscribe((data: any) => {
        this.Subcategoria = data;
      });
    this.http
      .get(environment.base_url + '/php/lista_generales.php', {
        params: { modulo: 'Lista_Ganancia' },
      })
      .subscribe((data: any) => {
        this.Lista = data;
      });
    // this.company_id = parseInt(this._user.user.person.company_worked.id);
  }
  normalize = (function () {
    var from = 'ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç',
      to = 'AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc',
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i))) ret.push(mapping[c]);
        else ret.push(c);
      }
      return ret.join('');
    };
  })();

  fetchFilterData(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', environment.ruta + 'php/productos/lista_productos.php');

    req.onload = () => {
      cb(JSON.parse(req.response));
    };
    req.send();
  }

  BuscarProducto(cum: any, formulario: NgForm = null): void {
    let band = 0;
    this.http
      .get(environment.ruta + 'php/productos/detalle_cum.php', {
        params: { cum: cum },
      })
      .subscribe((data: any) => {
        this.respuesta = data;
        if (this.respuesta == '') {
          this.http
            .get(environment.ruta + 'php/productos/ruta_crear_producto.php', {
              params: { cum: cum },
            })
            .subscribe((data: any) => {
              // console.log("DATOS ABIERTOOOSSS >>>>>>>>>>>>>", data);

              // if (data.length == 0) {
              if (data.length < 0) {
                this.Si = false;
                this.confirmacionSwal.title = 'Error En Codigo';
                this.confirmacionSwal.icon =
                  'Éste CUM no se encontró en la Base de Datos de datosabiertos.org';
                this.confirmacionSwal.icon = 'error';
                this.confirmacionSwal.fire();
              } else {
                this.Si = true;
                this.PrincipioActivo = data[0].principioactivo;
                this.Presentacion = data[0].unidadreferencia;
                this.Concentracion = data[0].concentracion;
                this.NombreComercial = data[0].producto;
                this.Embalaje = data[0].descripcioncomercial;
                this.LaboratorioGenerico = data[0].titular;
                this.LaboratorioComercial = data[0].nombrerol;
                this.ATC = data[0].atc;
                this.DescripcionATC = data[0].descripcionatc;
                this.Invima = data[0].registrosanitario;
                this.ViaAdministracion = data[0].viaadministracion;
                this.UnidadMedida = data[0].unidadmedida;
                this.Cantidad = data[0].cantidad;
                this.Forma_Farmaceutica = data[0].formafarmaceutica;
                var fechaexp = data[0].fechaexpedicion.split('/');
                var fechaven = data[0].fechavencimiento.split('/');

                this.FechaExpedicionInvima =
                  fechaexp[2] + '-' + fechaexp[0] + '-' + fechaexp[1];

                this.FechaVencimientoInvima =
                  fechaven[2] + '-' + fechaven[0] + '-' + fechaven[1];
              }
            });
        } else {
          this.Si = false;
          this.confirmacionSwal.title = 'Error En Codigo';
          this.confirmacionSwal.icon =
            'Este codigo Cum ya esta registrado a un Producto';
          this.confirmacionSwal.icon = 'error';
          this.Codigo_Cum = '';
          this.confirmacionSwal.fire();
          formulario.reset();
        }
      });

    /*if(this.respuesta==''){
       /* for (let index = 0; index < this.Direcciones.length; index++) {

         if(index<=3){
          this.http.get('https://www.datos.gov.co/resource/'+this.Direcciones[index].cum+'?expediente=' + cum[0]+ '&consecutivocum=' + cum[1], {
          }).subscribe((data: any) => {
            this.Bandera=data
            // console.log(this.Bandera, "length >>>>>>>", this.Bandera.length);
            if(this.Bandera.length>0){
              band = 1;
            }
          });

         }else{
          this.http.get('https://www.datos.gov.co/resource/'+this.Direcciones[index].cum+'?expediente=' + cum[0], {
          }).subscribe((data: any) => {
            this.Bandera=data
            // console.log(this.Bandera, "length >>>>>>>", this.Bandera.length);
            if(this.Bandera.length>0){
              band = 1;
            }
          });


         }
         // console.log("Band >>>>>>>>>", band);

         if(band == 1){
           // console.log("Entra en el if");

          break;
        }

        }*/

    /* if (cum[1]) {
          this.http.get('https://www.datos.gov.co/resource/7c5e-muu4.json?expediente=' + cum[0], {
          }).subscribe((data: any) => {
              if (data.length == 0) {
              this.Si = false;
              this.confirmacionSwal.title = "Error En Codigo";
              this.confirmacionSwal.icon = "El codigo cum ingresado no se encuentra en la base de datos de DatosAbiertos.org";
              this.confirmacionSwal.icon = "error";
              this.confirmacionSwal.fire();
              this.Codigo_Cum = '';
              this.PrincipioActivo = '';
              this.Presentacion = '';
              this.Concentracion = '';
              this.NombreComercial = '';
              this.Embalaje = '';
              this.LaboratorioGenerico = '';
              this.LaboratorioComercial = '';
              this.Familia = '';
              this.CantidadMinima = '';
              this.CantidadMaxima = '';
              this.ATC = '';
              this.DescripcionATC = '';
              this.Invima = '';
              this.PrecioMinimo = '';
              this.PrecioMaximo = '';
              this.TipoRegulacion = '';
              this.TipoPos = '';
              this.ViaAdministracion = '';
              this.UnidadMedida = '';
              this.Cantidad = '';
              this.Regulado = '';
              this.Tipo = '';
              this.PesoPresentacionMinima = '';
              this.PesoPresentacionRegular = '';
              this.PesoPresentacionMaxima = '';
              this.CodigoBarras = '';
              this.CantidadPresentacion = '';
              this.Mantis = '';
              this.Imagen = '';
              this.IdCategoria = '';
              this.NombreListado = '';
              this.Referencia = '';
              //this.FormProducto.reset();
              //alert("El codigo cum ingresado no se encuentra en la base de datos de DatosAbiertos.org");
            } else {
              this.Si = true;
              this.PrincipioActivo = data[0].principioactivo;
              this.Presentacion = data[0].unidadreferencia;
              this.Concentracion = data[0].concentracion;
              this.NombreComercial = data[0].producto;
              this.Embalaje = data[0].descripcioncomercial;
              this.LaboratorioGenerico = data[0].titular;
              this.LaboratorioComercial = data[0].nombrerol;
              this.ATC = data[0].atc;
              this.DescripcionATC = data[0].descripcionatc;
              this.Invima = data[0].registrosanitario;
              this.ViaAdministracion = data[0].viaadministracion;
              this.UnidadMedida = data[0].unidadmedida;
              this.Cantidad = data[0].cantidad;
              var fechaexp = data[0].fechaexpedicion.split('/');
              var fechaven = data[0].fechavencimiento.split('/');


              this.FechaExpedicionInvima = fechaexp[2] + '-' + fechaexp[0] + "-" + fechaexp[1];


              this.FechaVencimientoInvima = fechaven[2] + '-' + fechaven[0] + "-" + fechaven[1];
              // console.log(this.FechaVencimientoInvima);

            }
          });
        } else {
          this.Si = false;
          this.confirmacionSwal.title = "Error En Codigo";
          this.confirmacionSwal.icon = "cum invalido, debe tener el numero del expediente y el consecutivo";
          this.confirmacionSwal.icon = "error";
          this.confirmacionSwal.fire();

          //alert("cum invalido, debe tener el numero del expediente y el consecutivo");
        }*/

    /*} else {
        this.Si = false;
        this.confirmacionSwal.title = "Error En Codigo";
        this.confirmacionSwal.icon = "Este codigo Cum ya esta registrado a un Producto";
        this.confirmacionSwal.icon = "error";
        this.Codigo_Cum='';
        this.confirmacionSwal.fire();

      }  */
  }

  BuscarExpediente(cum: any): void {
    if (cum) {
      this.http
        .get(
          'https://www.datos.gov.co/resource/wqeu-3uhz.json?expediente=' + cum,
          {}
        )
        .subscribe((data: any) => {
          if (data.length == 0) {
            this.Si = false;
            this.confirmacionSwal.title = 'Error En Codigo';
            this.confirmacionSwal.icon =
              'El codigo cum ingresado no se encuentra en la base de datos de DatosAbiertos.org';
            this.confirmacionSwal.icon = 'error';
            this.confirmacionSwal.fire();
            this.Presentacion = '';
            this.Concentracion = '';
            this.PrincipioActivo = '';
            this.Embalaje = '';
            this.NombreComercial = '';
            this.LaboratorioGenerico = '';
            this.LaboratorioComercial = '';
            this.Invima = '';
            this.Cantidad = '';
            this.UnidadMedida = '';
            this.ViaAdministracion = '';
            //this.FormProducto.reset();
            //alert("El codigo cum ingresado no se encuentra en la base de datos de DatosAbiertos.org");
          } else {
            this.Si = true;
            this.PrincipioActivo = data[0].principioactivo;
            this.Presentacion = data[0].unidadreferencia;
            this.Concentracion = data[0].concentracion;
            this.NombreComercial = data[0].producto;
            this.Embalaje = data[0].descripcioncomercial;
            this.LaboratorioGenerico = data[0].titular;
            this.LaboratorioComercial = data[0].nombrerol;
            this.Invima = data[0].registrosanitario;
            this.ViaAdministracion = data[0].viaadministracion;
            this.UnidadMedida = data[0].unidadmedida;
            this.Cantidad = data[0].cantidad;
          }
        });
    } else {
      this.Si = false;
      this.confirmacionSwal.title = 'Error En Codigo';
      this.confirmacionSwal.icon =
        'cum invalido, debe tener el numero del expediente y el consecutivo';
      this.confirmacionSwal.icon = 'error';
      this.confirmacionSwal.fire();
      //alert("cum invalido, debe tener el numero del expediente y el consecutivo");
    }
  }
  CargaFoto(event) {
    let fot = document.getElementById('foto_visual') as HTMLImageElement;

    if (event.target.files.length === 1) {
      this.Fotos = event.target.files[0];

      let url = URL.createObjectURL(event.target.files[0]);
      fot.src = url;
    }
  }
  GuardarProducto(formulario: NgForm) {
    if (formulario.value.Peso_Presentacion_Maxima === '')
      formulario.value.Peso_Presentacion_Maxima = 0;

    if (formulario.value.Peso_Presentacion_Minima === '')
      formulario.value.Peso_Presentacion_Minima = 0;

    if (formulario.value.Peso_Presentacion_Regular === '')
      formulario.value.Peso_Presentacion_Regular = 0;
    console.log(this.Lista);

    let info = JSON.stringify(formulario.value);
    let lista = this.normalize(JSON.stringify(this.Lista));
    let datos = new FormData();
    // datos.append('field', JSON.stringify(this.fieldDinamicSubcategory));
    datos.append('fieldSave', JSON.stringify(this.fieldDinamicSubcategory));

    datos.append('modulo', 'Producto');
    datos.append('datos', functionsUtils.utf8_encode(info));
    datos.append('Foto', this.Fotos);
    datos.append('funcionario', this.Identificacion_Funcionario);
    datos.append('lista', lista);
    this.http
      .post(environment.ruta + 'php/productos/producto_guardar.php', datos)
      .subscribe((data: any) => {
        this.confirmacionSwal.title = data.titulo;
        this.confirmacionSwal.text = data.mensaje;
        this.confirmacionSwal.icon = data.tipo;
        this.confirmacionSwal.fire();
        formulario.reset();
        this.Fotos = [];
        this.VerPantallaLista();
      });
  }

  getVariablesDinamic(value) {
    this.http
      .get(environment.ruta + 'php/parametros/lista_subcategoria.php', {
        params: { id: value },
      })
      .subscribe((data: any) => {
        this.fieldDinamic = [];
        this.fieldDinamic = data.Subcategoria[0].Variables;
      });
  }
  /*
  saveVariablesDinamic(value, item) {
    let obj = {
      subcategory_variables_id: item.id,
      valor: value,
    };
    this.fieldDinamicSubcategory.push(obj);
  }
*/
  saveVariablesDinamic(value, item, i) {
    let obj = {
      subcategory_variables_id: item.id,
      valor: value,
    };

    this.fieldDinamicSubcategory[i] = obj;
  }

  VerPantallaLista() {
    this.router.navigate(['/ajustes/informacion-base/productos']);
  }
  ValidarCodigo() {
    this.http
      .get(environment.ruta + 'php/productos/validar_codigo.php', {
        params: { codigo: this.Codigo_Barras },
      })
      .subscribe((data: any) => {
        if (data.Id_Producto) {
          let html = `
          <h5>Este codigo de barras ya esta asociado a otro producto:</h5>

          <ul>
            <li><strong style="font-weight:bold;font-size:15px">Nombre: </strong> <span style="font-size:15px">${data.Nombre_Comercial}</span></li>
            <li><strong style="font-weight:bold;font-size:15px">Laboratorio: </strong> <span style="font-size:15px">${data.Laboratorio_Comercial}</span></li>
            <li><strong style="font-weight:bold;font-size:15px">Embalaje: </strong> <span style="font-size:15px">${data.Embalaje}</span></li>
          </ul>
        `;
          this.confirmacionSwal.title = '';
          this.confirmacionSwal.html = html;
          this.confirmacionSwal.icon = 'warning';
          this.confirmacionSwal.fire();
          this.Codigo_Barras = '';
        }
      });
  }
}
