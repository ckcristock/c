import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SweetAlertOptions } from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { RetencionService } from '../../../../core/services/retencion.service';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ActaRecepcionService } from '../acta-recepcion.service';
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-crear-acta-recepcion',
  templateUrl: './crear-acta-recepcion.component.html',
  styleUrls: ['./crear-acta-recepcion.component.scss'],
})
export class CrearActaRecepcionComponent implements OnInit {
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  /* @ViewChild('ModalRetenciones') ModalRetenciones: any; */
  @ViewChild('FormActa') FormActa: NgForm;
  alertOption: SweetAlertOptions = {};
  masks = consts;
  Codigo: any = this.route.snapshot.params['codigo'];
  Fecha = new Date();
  Lista_Productos: any[] = [];
  Lista_Eliminados: any[] = [];
  NoConformes: any[] = [];
  Bodegas: any[] = [];
  Subcategoria: any[] = [];
  Archivo_Facturas: any[] = [];
  Fotos: any[] = [];
  Impuesto: any[] = [];
  Productos: any[] = [];
  RetencionesDefault: any[] = [];
  TotalesFacturas: Array<any> = [];
  RetencionesFacturaSeleccionada: Array<any> = [];
  Retenciones: Array<any> = [];
  ListaRetenciones: Array<any> = [];
  encabezado: any = {};
  DataRetencionesProveedor: any = {};
  ValoresRetenciones: any = {};
  Subtotal_Final: number = 0;
  Retenciones_Totales: number = 0;
  Iva_Final: number = 0;
  Total_Final: number = 0;
  Mes: number = 0;
  Total_Items: number = 0;
  ValorMinimoAplicaRetefuente: number = 0;
  ValorMinimoAplicaReteica: number = 0;
  ValorMinimoAplicaReteiva: number = 0;
  id_no_conforme: string = '';
  Nombre_Factura_Seleccionada: string = '';
  PosicionFacturaSeleccionada: string = '';
  Codigo_barras: boolean = true;
  Totales: any[] = [
    {
      Subtotal: 0,
      Iva: 0,
    },
  ];
  Facturas: any = [
    {
      Factura: '',
      Fecha_Factura: '',
      Archivo_Factura: '',
      Required: true,
      Retenciones: [],
      Total_Retenciones: '',
    },
  ];
  datosCabecera = {
    Titulo: 'Acta de recepción',
    Fecha: new Date(),
    Codigo: ''
  }
  user: any = {
    Identificacion_Funcionario: '1'
  };

  reducer = (accumulator, currentValue) => accumulator + parseInt(currentValue.Cantidad);

  reducer2 = (accumulator, currentValue) => {
    let acu_subt = 0;
    currentValue.producto.forEach((v, i) => {
      acu_subt += parseFloat(v.Subtotal);
    });
    return accumulator + acu_subt;
  };

  reducer3 = (accumulator, currentValue) => {
    let acu_iva = 0;
    currentValue.producto.forEach((v, i) => {
      acu_iva += parseFloat(v.Iva);
    });
    return accumulator + acu_iva;
  };

  reducer_retenciones = (accumulator, currentValue) => {
    let suma = 0;
    if (currentValue.Valor != '') {
      suma = accumulator + currentValue.Valor;
    }
    return suma;
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private swalService: SwalService,
    private _actaRecepcion: ActaRecepcionService
  ) {
    this.getRetencionesCompras();
  }

  ngOnInit() {
    this.getLocalStorage();
    this.getActaRecepcion();
    this.getNoConformes();
    this.getListaImpuestoMes();
    setTimeout(() => {
      this.CalcularRetencionesProveedor();
    }, 1000);
  }

  getActaRecepcion() {
    let params2 = {
      codigo: this.route.snapshot.params['codigo'],
      compra: this.route.snapshot.params['compra'],
      id: this.id_no_conforme,
    }
    this._actaRecepcion.getActaRecepcionCompra(params2).subscribe((data: any) => {
      let params = this.route.snapshot.queryParams;
      this.DataRetencionesProveedor = data.Data_Retenciones;
      this.ValoresRetenciones = data.Valores_Base_Retenciones;
      this.AsignarRetencionesDefault();
      this.OperacionParaValoresMinimosRetenciones();
      this.encabezado = data.encabezado;
      this.datosCabecera.Codigo = this.encabezado.Codigo
      this.cargarSubcategorias(data.encabezado.Id_Bodega);
      this.Total_Items = data.Items;
      this.Productos = data.Productos;
      if (params.devolucion != undefined) {
        this.Total_Items = data.producto.length;
        this.Lista_Productos = data.producto;
        this.Codigo_barras = false;
      }
      setTimeout(() => {
        this.Opciones();
      }, 100);
    });
  }

  getListaImpuestoMes() {
    this.http
      .get(
        environment.base_url + '/php/actarecepcion_nuevo/lista_impuesto_mes.php',
        { params: { modulo: 'Impuesto' } }
      )
      .subscribe((data: any) => {
        this.Impuesto = data.Impuesto;
        this.Mes = parseInt(data.Meses.Meses_Vencimiento);
        this.Bodegas = data.Bodega;
      });
  }

  getNoConformes() {
    this.http
      .get(environment.base_url + '/php/actarecepcion/causal_no_conformes.php')
      .subscribe((data: any) => {
        this.NoConformes = data;
      });
  }

  getLocalStorage() {
    let params = this.route.snapshot.queryParams;
    let ruta = 'php/bodega_nuevo/acta_recepcion_comprad_test.php';
    if (params.devolucion) {
      ruta = 'php/bodega/acta_recepcion_compra_devolucion.php';
      this.id_no_conforme = params.devolucion;
    }
    if (
      localStorage.getItem('Lista_Producto') &&
      localStorage.getItem('Codigo') == this.route.snapshot.params['codigo']
    ) {
      this.Lista_Productos = JSON.parse(
        functionsUtils.utf8_decode(localStorage.getItem('Lista_Producto'))
      );
      if (
        localStorage.getItem('Facturas') &&
        localStorage.getItem('Codigo') == this.route.snapshot.params['codigo']
      ) {
        this.Facturas = JSON.parse(localStorage.getItem('Facturas'));
      }
      this.Actualiza_Valores();
    }
  }

  getRetencionesPorModalidad(p: any) {
    return this.http.get(environment.base_url + '/php/GENERALES/retenciones/get_retenciones_modalidad.php', { params: p });
  }

  getRetencionesCompras() {
    let p = { modalidad: 'compras' };
    this.getRetencionesPorModalidad(p).subscribe((data: any) => {
      if (data.length > 0) {
        data.forEach((ret) => {
          if (ret.Tipo_Retencion != 'Iva') {
            this.ListaRetenciones.push(ret);
          }
        });
      } else {
        this.ListaRetenciones = data;
      }
    });
  }

  cargarSubcategorias(id_bodega) {
    this.http
      .get(
        environment.base_url + '/php/actarecepcion_nuevo/lista_subcategorias.php',
        { params: { id_bodega: id_bodega } }
      )
      .subscribe((data: any) => {
        this.Subcategoria = data;
      });
  }

  Opciones() {
    this.alertOption = {
      title: '¿Estás seguro(a)?',
      text:
        this.Total_Items == this.Lista_Productos.length
          ? 'Vamos a generar el acta'
          : ' En la orden de compra hay un total de ' +
          this.Total_Items +
          ' productos y en el acta hay ' +
          this.Lista_Productos.length +
          ' productos.',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: '¡Sí, confirmar!',
      confirmButtonColor: this.swalService.buttonColor.confirm,
      cancelButtonColor: this.swalService.buttonColor.cancel,
      reverseButtons: true,
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'question',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.guardarActa(this.FormActa);
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    };
  }

  noConforme(pos, pos2, value) {
    if (value != '') {
      (
        document.getElementById(
          'Cantidad_No_Conforme' + pos2
        ) as HTMLInputElement
      ).style.display = 'block';
      (
        document.getElementById(
          'Cantidad_No_Conforme' + pos2
        ) as HTMLInputElement
      ).required = true;
    } else {
      (
        document.getElementById(
          'Cantidad_No_Conforme' + pos2
        ) as HTMLInputElement
      ).style.display = 'none';
      (
        document.getElementById(
          'Cantidad_No_Conforme' + pos2
        ) as HTMLInputElement
      ).required = false;
    }
  }

  capturarNoConforme(pos, pos2, pos3) {
    let noconformidad = (
      document.getElementById('noconformidad' + pos3) as HTMLInputElement
    ).value;
    let cantidad_no_conforme = (
      document.getElementById('Cantidad_No_Conforme' + pos3) as HTMLInputElement
    ).value;
    let cantidad_restante =
      parseInt(this.Lista_Productos[pos].CantidadProducto) -
      this.Lista_Productos[pos].producto.reduce(this.reducer, 0);
    if (parseInt(cantidad_no_conforme) > cantidad_restante) {
      this.confirmacionSwal.title = 'Error en Cantidad';
      this.confirmacionSwal.html =
        'La cantidad no conforme no debe ser superior a la cantidad recibida de este producto.';
      this.confirmacionSwal.icon = 'error';
      this.confirmacionSwal.fire();
      (
        document.getElementById(
          'Cantidad_No_Conforme' + pos3
        ) as HTMLInputElement
      ).value = '';
    } else {
      this.Lista_Productos[pos].producto[pos2].No_Conforme = noconformidad;
      this.Lista_Productos[pos].producto[pos2].Cantidad_No_Conforme =
        cantidad_no_conforme;
    }
  }

  addFactura(pos, event) {
    let pos2 = pos + 1;
    let factura = (document.getElementById('Factura' + pos) as HTMLInputElement)
      .value;
    let fecha_factura = (
      document.getElementById('Fecha_Factura' + pos) as HTMLInputElement
    ).value;
    let archivo_factura = (
      document.getElementById('Archivo_Factura' + pos) as HTMLInputElement
    ).files.length;
    if (factura != '' && fecha_factura != '') {
      if (archivo_factura > 0) {
        if (this.Archivo_Facturas[pos] != undefined) {
          this.Archivo_Facturas[pos] = event.target.files[0];
        } else {
          this.Archivo_Facturas.push(event.target.files[0]);
          if (this.Facturas[pos2] == undefined) {
            this.Facturas.push({
              Factura: '',
              Fecha_Factura: '',
              Archivo_Factura: '',
              Required: false,
              Retenciones: [],
            });
            this.Facturas[pos].Required = true;
          }
        }
      }

      if (this.Facturas[pos] != undefined) {
        this.Facturas[pos].Retenciones = this.AsignarRetencionesFactura();
      }
    }
    localStorage.setItem('Facturas', JSON.stringify(this.Facturas));
    localStorage.setItem(
      'Lista_Producto',
      JSON.stringify(this.Lista_Productos)
    );
  }


  capturarDigitacion(i, j, k) {
    this.Lista_Productos[i].producto[j].Cantidad = (
      document.getElementById('Cantidad' + k) as HTMLInputElement
    ).value;

    this.Lista_Productos[i].producto[j].Precio = (
      document.getElementById('Precio' + k) as HTMLInputElement
    ).value;
    this.Lista_Productos[i].producto[j].No_Conforme = (
      document.getElementById('noconformidad' + k) as HTMLInputElement
    ).value;

    this.Lista_Productos[i].producto[j].Factura = (
      document.getElementById('Factura' + k) as HTMLInputElement
    ).value;

    let impuesto: any = parseInt(
      (document.getElementById('Impuesto' + k) as HTMLInputElement).value
    );

    impuesto =
      this.DataRetencionesProveedor.Tipo_Retencion == 'Regimen Simplificado'
        ? 0
        : impuesto; // Para limitar el impuesto según el proveedor.

    let subtotal: any =
      parseFloat(
        (document.getElementById('Precio' + k) as HTMLInputElement).value
      ) *
      parseFloat(
        (document.getElementById('Cantidad' + k) as HTMLInputElement).value
      );
    let iva = subtotal * (impuesto / 100);

    (document.getElementById('Subtotal' + k) as HTMLInputElement).value =
      subtotal;
    // this.Lista_Productos[i].Subtotal = subtotal;
    this.Lista_Productos[i].producto[j].Subtotal = subtotal;
    this.Lista_Productos[i].producto[j].Iva = iva;
    let acu_subtotal = 0;
    let acu_iva = 0;

    this.Lista_Productos[i].producto.forEach((p) => {
      acu_subtotal += parseFloat(p.Subtotal);
      acu_iva += parseFloat(p.Iva);
    });

    if (this.Totales[j] != undefined) {
      this.Totales[j].Subtotal = acu_subtotal;
      this.Totales[j].Iva = acu_iva;
    } else {
      this.Totales.push({
        Subtotal: subtotal,
        Iva: iva,
      });
    }
    this.Actualiza_Valores();

    localStorage.setItem(
      'Lista_Producto',
      JSON.stringify(this.Lista_Productos)
    );

    this.Opciones();
  }

  Actualiza_Valores() {
    this.Subtotal_Final = this.Lista_Productos.reduce(this.reducer2, 0);

    this.Iva_Final = this.Lista_Productos.reduce(this.reducer3, 0);

    this.Total_Final =
      this.Subtotal_Final + this.Iva_Final - this.Retenciones_Totales;
  }

  consultarCodigoBarras(event, input) {
    if (event.target.value) {
      let params = {
        codigo: event.target.value,
        orden: this.route.snapshot.params['codigo'],
      }
      this._actaRecepcion.codigoBarras(params).subscribe((data: any) => {
        let product = data.producto[0];
        if (data.Id_Producto) {
          let posicion = this.Lista_Productos.findIndex(
            (x) => x.Id_Producto == data.Id_Producto
          );
          if (posicion < 0) {
            this.Lista_Productos.push(data);
            localStorage.setItem(
              'Lista_Producto',
              JSON.stringify(this.Lista_Productos)
            );
          } else {
            let html = `
            <div>Este producto ya se encuentra agregado</div>
            <strong style="font-weight:bold;font-size:15px">Nombre: </strong> <span style="font-size:15px">${product.Nombre_Comercial}</span><br>
            <strong style="font-weight:bold;font-size:15px">Embalaje: </strong> <span style="font-size:15px">${product.Embalaje}</span>
          `;
            this.swalService.show({
              icon: 'error',
              title: 'Error',
              showCancel: false,
              html: html,
              confirmButtonColor: '#d33'
            })
          }
        } else {
          this.swalService.show({
            icon: 'error',
            title: 'Error',
            showCancel: false,
            text: 'Código de barras no encontrado',
            confirmButtonColor: '#d33'
          })
        }
      });
      event.preventDefault();
      input.value = '';
    }
    localStorage.setItem('Codigo', this.route.snapshot.params['codigo']);
    this.Opciones();
  }



  guardarActa(formulario) {
    let info = functionsUtils.normalize(JSON.stringify(formulario.value));
    let prod = functionsUtils.normalize(JSON.stringify(this.Lista_Productos));
    let fact = functionsUtils.normalize(JSON.stringify(this.Facturas));
    let comp = JSON.stringify(this.Productos);
    let datos = new FormData();
    datos.append('datos', info);
    datos.append('productos', prod);
    datos.append('codigoCompra', this.route.snapshot.params['codigo']);
    datos.append('tipoCompra', this.route.snapshot.params['compra']);
    datos.append('facturas', fact);
    datos.append('comparar', comp);
    for (let i = 0; i < this.Archivo_Facturas.length; i++) {
      datos.append('archivos' + i, this.Archivo_Facturas[i]);
    }
    for (let i = 0; i < this.Fotos.length; i++) {
      datos.append('fotos' + i, this.Fotos[i]);
    }
    if (this.Lista_Eliminados.length > 0) {
      let eliminados = JSON.stringify(this.Lista_Eliminados);
      datos.append('eliminados', eliminados);
    }
    var ruta_guardar = '/php/bodega_nuevo/guardar_acta_recepciond.php';
    if (this.id_no_conforme != '') {
      datos.append('id_no_conforme', this.id_no_conforme);
      ruta_guardar = 'php/bodega_nuevo/guardar_acta_recepcion_devolucion.php';
    }
    this.http
      .post(environment.base_url + ruta_guardar, datos)
      .subscribe((data: any) => {
        if (data.tipo == 'success') {
          this.confirmacionSwal.title = 'Acta de recepción Guardada';
          this.confirmacionSwal.html = data.mensaje;
          this.confirmacionSwal.icon = data.tipo;
          this.confirmacionSwal.fire();
          this.router.navigate(['/inventario/acta-recepcion']);
          formulario.reset();
          localStorage.removeItem('Facturas');
        } else {
          this.confirmacionSwal.title = 'Oops!';
          this.confirmacionSwal.html = data.mensaje;
          this.confirmacionSwal.icon = data.tipo;
          this.confirmacionSwal.fire();
        }
      });
  }

  AgregarLote(pos, pos2, poss) {
    let Cantidad_Band = this.Lista_Productos[pos].producto.reduce(
      this.reducer,
      0
    );

    let newProducto: any = {
      Cantidad: '0',
      Cantidad_Band: '0',
      CantidadProducto: this.Lista_Productos[pos].CantidadProducto,
      Checkeado: '0',
      Codigo_Barras: this.Lista_Productos[pos].Codigo_Barras,
      Codigo_CUM: this.Lista_Productos[pos].Codigo_CUM,
      CostoProducto: this.Lista_Productos[pos].CostoProducto,
      Embalaje: this.Lista_Productos[pos].Embalaje,
      Fecha_Vencimiento: '',
      Id_Categoria: this.Lista_Productos[pos].Id_Categoria,
      Id_Producto: this.Lista_Productos[pos].Id_Producto,
      Impuesto: this.Lista_Productos[pos].Impuesto,
      Lote: '',
      No_Conforme: '0',
      Id_Producto_Orden_Compra: '0',
      NombreProducto: this.Lista_Productos[pos].NombreProducto,
      Foto: this.Lista_Productos[pos].Foto,
      Peso: '0',
      Precio: '0',
      Disabled: false,
      Required: false,
      Subtotal: 0,
      Iva: 0,
    };

    let cantidad = (
      document.getElementById('Cantidad' + poss) as HTMLInputElement
    ).value;
    let precio = (document.getElementById('Precio' + poss) as HTMLInputElement)
      .value;

    if (cantidad && precio) {
      let pos3 = pos2 + 1;
      if (this.Lista_Productos[pos].producto[pos3] == undefined) {
        this.Lista_Productos[pos].producto[pos2].Required = true;
        this.Lista_Productos[pos].producto.push(newProducto);
      }
    }
  }



  EliminarRetencion(pos: any) {
    this.Facturas[this.PosicionFacturaSeleccionada].Retenciones.splice(pos, 1);
    localStorage.setItem('Facturas', JSON.stringify(this.Facturas));
    this.CalculoRetencion2();
  }

  CalcularRetenciones(nroFactura: string, index_retencion: string = '') {
    this.GetInfoFacturas();
    if (nroFactura != '') {
      let index_factura = this.Facturas.findIndex(
        (x) => x.Factura == nroFactura
      );
      if (index_factura > -1) {
        let valores_factura = this.TotalesFacturas.find(
          (x) => x.Factura == nroFactura
        );

        if (index_retencion != '') {
          let t =
            this.Facturas[index_factura].Retenciones[index_retencion].Tipo;
          let p =
            this.Facturas[index_factura].Retenciones[index_retencion]
              .Porcentaje;

          if (t == 'Iva') {
            this.Facturas[index_factura].Retenciones[index_retencion].Valor =
              valores_factura.iva_factura * (p / 100);
          } else {
            this.Facturas[index_factura].Retenciones[index_retencion].Valor =
              valores_factura.total_factura * (p / 100);
          }
        } else if (this.Facturas[index_factura].Retenciones.length > 0) {
          let count = this.Facturas[index_factura].Retenciones.length;
          for (let index = 0; index < count; index++) {
            let tipo_ret = this.Facturas[index_factura].Retenciones[index].Tipo;
            let porc = parseFloat(
              this.Facturas[index_factura].Retenciones[index].Porcentaje
            );

            if (tipo_ret == 'Iva') {
              this.Facturas[index_factura].Retenciones[index].Valor =
                valores_factura.iva_factura * (porc / 100);
            } else {
              this.Facturas[index_factura].Retenciones[index].Valor =
                valores_factura.total_factura * (porc / 100);
            }
          }
        }
      }
    }
    this.TotalizarRetenciones();
  }

  TotalizarRetenciones() {
    if (this.Facturas.length > 0) {
      this.Retenciones_Totales = 0;
      this.Facturas.forEach((f, i) => {
        if (f.Factura != '') {
          if (f.Retenciones.length > 0) {
            this.Retenciones_Totales += f.Retenciones.reduce(
              this.reducer_retenciones,
              0
            );
          }
        }
      });
    } else {
      this.Retenciones_Totales = 0;
    }
    this.Actualiza_Valores();
  }

  GetInfoFacturas() {
    let valores_facturas = [];
    if (this.Facturas.length > 0) {
      this.TotalesFacturas = this.ObtenerTotalesFactura();
    } else {
      this.TotalesFacturas = [];
    }
  }

  ObtenerTotalesFactura() {
    //ciclo nuevo
    let r = [];

    if (this.Lista_Productos.length > 0) {
      this.Lista_Productos.forEach((lista) => {
        if (lista.producto.length > 0) {
          lista.producto.forEach((p) => {
            if (p.Factura && p.Factura != '') {
              let exist = r.findIndex((x) => x.Factura == p.Factura);

              if (exist == -1) {
                let totales_factura = {
                  Factura: p.Factura,
                  total_factura: p.Subtotal,
                  iva_factura: p.Iva,
                };
                r.push(totales_factura);
              } else {
                r[exist].total_factura += p.Subtotal;
                r[exist].iva_factura += p.Iva;
              }
            }
          });
        }
      });
    }

    return r;
  }

  VaciarValoresRetenciones() {
    this.Facturas.forEach((f) => {
      f.Retenciones.forEach((rt) => {
        rt.Valor = 0;
      });
    });
  }

  CalculoRetencion2() {
    this.GetInfoFacturas();

    this.VaciarValoresRetenciones();

    this.Facturas.forEach((fac) => {
      if (fac.Factura != '') {
        let valores_factura = this.TotalesFacturas.find(
          (x) => x.Factura == fac.Factura
        );

        if (!functionsUtils.IsObjEmpty(valores_factura)) {
          let f = this.Facturas.findIndex((x) => x.Factura == fac.Factura);
          if (f > -1) {
            if (this.Facturas[f].Retenciones.length > 0) {
              this.Facturas[f].Retenciones.forEach((rt, ind) => {
                if (rt.Id_Retencion != '') {
                  let porc = parseFloat(
                    this.Facturas[f].Retenciones[ind].Porcentaje
                  );

                  if (rt.Tipo == 'Iva') {
                    let valor_final =
                      valores_factura.iva_factura * (porc / 100);
                    this.Facturas[f].Retenciones[ind].Valor += valor_final;
                  } else {
                    let valor_final =
                      valores_factura.total_factura * (porc / 100);
                    this.Facturas[f].Retenciones[ind].Valor += valor_final;
                  }
                }
              });
            }
          }
        }
      }
    });

    this.TotalizarRetenciones();
    localStorage.setItem('Facturas', JSON.stringify(this.Facturas));
  }

  AsignarRetencionesDefault() {
    let retenciones = this.DataRetencionesProveedor;
    this.RetencionesDefault = [];

    if (
      retenciones.Id_Plan_Cuenta_Retefuente != '0' &&
      retenciones.Id_Plan_Cuenta_Retefuente != ''
    ) {
      let r = {
        Nombre: retenciones.Nombre_Retefuente,
        Valor: '',
        Porcentaje: parseFloat(
          retenciones.Porcentaje_Retefuente?.replace(',', '.')
        ),
        Tipo: 'Renta',
        Tipo_R: retenciones.Tipo_Retencion,
        Id_Retencion: retenciones.Id_Retencion_Fte,
      };

      this.RetencionesDefault.push(r);
    }

    if (
      retenciones.Id_Plan_Cuenta_Reteica != '0' &&
      retenciones.Id_Plan_Cuenta_Reteica != ''
    ) {
      let r = {
        Nombre: retenciones.Nombre_Reteica,
        Valor: '',
        Porcentaje: parseFloat(
          retenciones.Porcentaje_Reteica?.replace(',', '.')
        ),
        Tipo: 'Ica',
        Tipo_R: retenciones.Tipo_Reteica,
        Id_Retencion: retenciones.Id_Retencion_Ica,
      };

      this.RetencionesDefault.push(r);
    }

    if (
      retenciones.Id_Plan_Cuenta_Reteiva != '0' &&
      retenciones.Id_Plan_Cuenta_Reteiva != ''
    ) {
      let r = {
        Nombre: retenciones.Nombre_Reteiva,
        Valor: '',
        Porcentaje: parseFloat(
          retenciones.Porcentaje_Reteiva?.replace(',', '.')
        ),
        Tipo: 'Iva',
        Tipo_R: retenciones.Contribuyente,
        Id_Retencion: retenciones.Id_Retencion_Iva,
      };

      this.RetencionesDefault.push(r);
    }
  }

  AsignarRetencionesFactura() {
    let retenciones = this.DataRetencionesProveedor;
    let Retenciones = [];

    if (
      retenciones.Id_Plan_Cuenta_Retefuente != '0' &&
      retenciones.Id_Plan_Cuenta_Retefuente != ''
    ) {
      let r = {
        Nombre: retenciones.Nombre_Retefuente,
        Valor: '',
        Porcentaje: parseFloat(
          retenciones.Porcentaje_Retefuente.replace(',', '.')
        ),
        Tipo: 'Renta',
        Tipo_R: retenciones.Tipo_Retencion,
        Id_Retencion: retenciones.Id_Retencion_Fte,
      };

      Retenciones.push(r);
    }

    if (
      retenciones.Id_Plan_Cuenta_Reteica != '0' &&
      retenciones.Id_Plan_Cuenta_Reteica != ''
    ) {
      let r = {
        Nombre: retenciones.Nombre_Reteica,
        Valor: '',
        Porcentaje: parseFloat(
          retenciones.Porcentaje_Reteica.replace(',', '.')
        ),
        Tipo: 'Ica',
        Tipo_R: retenciones.Tipo_Reteica,
        Id_Retencion: retenciones.Id_Retencion_Ica,
      };

      Retenciones.push(r);
    }

    if (
      retenciones.Id_Plan_Cuenta_Reteiva != '0' &&
      retenciones.Id_Plan_Cuenta_Reteiva != ''
    ) {
      let r = {
        Nombre: retenciones.Nombre_Reteiva,
        Valor: '',
        Porcentaje: parseFloat(
          retenciones.Porcentaje_Reteiva.replace(',', '.')
        ),
        Tipo: 'Iva',
        Tipo_R: retenciones.Contribuyente,
        Id_Retencion: retenciones.Id_Retencion_Iva,
      };

      Retenciones.push(r);
    }

    return Retenciones;
  }

  OperacionParaValoresMinimosRetenciones() {
    let retenciones = this.DataRetencionesProveedor;

    if (retenciones.Id_Plan_Cuenta_Retefuente != '0') {
      if (this.DataRetencionesProveedor.Regimen == 'Comun') {

        this.ValorMinimoAplicaRetefuente =
          parseFloat(this.ValoresRetenciones.Valor_Unidad_Tributaria) *
          parseFloat(this.ValoresRetenciones.Base_Retencion_Compras_Reg_Comun);
      } else {
        this.ValorMinimoAplicaRetefuente =
          parseFloat(this.ValoresRetenciones.Valor_Unidad_Tributaria) *
          parseFloat(this.ValoresRetenciones.Base_Retencion_Compras_Reg_Simpl);
      }
    }

    if (retenciones.Id_Plan_Cuenta_Reteica != '0') {
      this.ValorMinimoAplicaReteica =
        parseFloat(this.ValoresRetenciones.Valor_Unidad_Tributaria) *
        parseFloat(this.ValoresRetenciones.Base_Retencion_Compras_Ica);
    }

    if (retenciones.Id_Plan_Cuenta_Reteiva != '0') {
      this.ValorMinimoAplicaReteiva =
        parseFloat(this.ValoresRetenciones.Valor_Unidad_Tributaria) *
        parseFloat(this.ValoresRetenciones.Base_Retencion_Iva_Reg_Comun);
    }
  }

  CalcularRetencionesProveedor() {
    //SE OBTIENE EL TOTAL DE TODAS LAS FACTURAS
    this.GetInfoFacturas();
    //SE CALCULAN LAS RETENCIONES DE TODAS LAS FACTURAS AGREGADAS AL ACTA DE RECEPCION
    this.CalculoRetencionFacturas();
    //SE TOTALIZAN LAS RETENCIONES DE TODAS LAS FACTURAS
    this.TotalizarRetenciones();
  }

  CalculoRetencionFacturas() {
    this.VaciarValoresRetenciones();
    this.Facturas.forEach((fac, i) => {
      if (fac.Factura != '') {
        let valores_factura = this.TotalesFacturas.find(
          (x) => x.Factura == fac.Factura
        );
        if (!functionsUtils.IsObjEmpty(valores_factura)) {
          if (this.Facturas[i].Retenciones.length > 0) {
            this.Facturas[i].Retenciones.forEach((rt, ind) => {
              if (rt.Tipo == 'Renta') {
                if (rt.Tipo_R == 'Supera Base') {
                  if (
                    valores_factura.total_factura >
                    this.ValorMinimoAplicaRetefuente
                  ) {
                    let valor_final =
                      valores_factura.total_factura * (rt.Porcentaje / 100);
                    this.Facturas[i].Retenciones[ind].Valor = valor_final;
                  } else {
                    this.Facturas[i].Retenciones[ind].Valor = 0;
                  }
                } else if (rt.Tipo_R == 'Permanente') {
                  let valor_final =
                    valores_factura.total_factura * (rt.Porcentaje / 100);
                  this.Facturas[i].Retenciones[ind].Valor = valor_final;
                } else {
                  this.Facturas[i].Retenciones[ind].Valor = 0;
                }
              }

              if (rt.Tipo == 'Ica') {
                if (rt.Tipo_R == 'Supera Base') {
                  if (
                    valores_factura.total_factura >
                    this.ValorMinimoAplicaReteica
                  ) {
                    let valor_final =
                      valores_factura.total_factura * (rt.Porcentaje / 100);
                    this.Facturas[i].Retenciones[ind].Valor = valor_final;
                  } else {
                    this.Facturas[i].Retenciones[ind].Valor = 0;
                  }
                } else if (rt.Tipo_R == 'Permanente') {
                  let valor_final =
                    valores_factura.total_factura * (rt.Porcentaje / 100);
                  this.Facturas[i].Retenciones[ind].Valor = valor_final;
                } else {
                  this.Facturas[i].Retenciones[ind].Valor = 0;
                }
              }

              if (rt.Tipo == 'Iva') {
                if (rt.Tipo_R == 'No') {
                  if (
                    parseFloat(valores_factura.iva_factura) >
                    this.ValorMinimoAplicaReteiva
                  ) {
                    let valor_final =
                      valores_factura.iva_factura * (rt.Porcentaje / 100);
                    this.Facturas[i].Retenciones[ind].Valor = valor_final;
                  } else {
                    this.Facturas[i].Retenciones[ind].Valor = 0;
                  }
                } else {
                  this.Facturas[i].Retenciones[ind].Valor = 0;
                }
              }
            });
          }
        }
      }
    });
    localStorage.setItem('Facturas', JSON.stringify(this.Facturas));
  }

  /* habilitarCampos(i) {
    var checkeado = (document.getElementById('check' + i) as HTMLInputElement)
      .checked;
    switch (checkeado) {
      case true: {
        (document.getElementById('Cantidad' + i) as HTMLInputElement).disabled =
          false;
        (document.getElementById('Precio' + i) as HTMLInputElement).disabled =
          false;
        (document.getElementById('Lote' + i) as HTMLInputElement).disabled =
          false;
        (
          document.getElementById('Fecha_Vencimiento' + i) as HTMLInputElement
        ).disabled = false;
        (
          document.getElementById('noconformidad' + i) as HTMLInputElement
        ).style.visibility = 'hidden';

        (document.getElementById('Cantidad' + i) as HTMLInputElement).required =
          true;
        (document.getElementById('Precio' + i) as HTMLInputElement).required =
          true;
        (document.getElementById('Lote' + i) as HTMLInputElement).required =
          true;
        (
          document.getElementById('Fecha_Vencimiento' + i) as HTMLInputElement
        ).required = true;
        (
          document.getElementById('noconformidad' + i) as HTMLInputElement
        ).required = false;

        this.Lista_Productos[i].Checkeado = true;
        break;
      }
      case false: {
        (document.getElementById('Cantidad' + i) as HTMLInputElement).disabled =
          true;
        (document.getElementById('Precio' + i) as HTMLInputElement).disabled =
          true;
        (document.getElementById('Lote' + i) as HTMLInputElement).disabled =
          true;
        (
          document.getElementById('Fecha_Vencimiento' + i) as HTMLInputElement
        ).disabled = true;
        (
          document.getElementById('noconformidad' + i) as HTMLInputElement
        ).style.visibility = 'visible';

        (document.getElementById('Cantidad' + i) as HTMLInputElement).required =
          false;
        (document.getElementById('Precio' + i) as HTMLInputElement).required =
          false;
        (document.getElementById('Lote' + i) as HTMLInputElement).required =
          false;
        (
          document.getElementById('Fecha_Vencimiento' + i) as HTMLInputElement
        ).required = false;
        (
          document.getElementById('noconformidad' + i) as HTMLInputElement
        ).required = true;

        this.Lista_Productos[i].Checkeado = false;
        break;
      }
    }
  } */

  /* CargaFoto(event, i) {
    let fot = document.getElementById('foto_visual' + i) as HTMLImageElement;
    let foto_input = document.getElementById('Foto' + i) as HTMLInputElement;
    if (event.target.files.length === 1) {
      foto_input = event.target.files[0];
      if (this.Fotos[i] != undefined) {
        this.Fotos[i] = foto_input;
      } else {
        this.Fotos.push(foto_input);
      }
      this.Lista_Productos[i].Foto = foto_input;
      let url = URL.createObjectURL(event.target.files[0]);
      fot.src = '';
      this.Lista_Productos[i].Foto = '';
      fot.src = url;
    }
  } */

  /* ValidarCantidad(pos, pos2, pos3, cantidad) {
    let CantidadPedida = parseInt(
      this.Lista_Productos[pos].producto[pos2].CantidadProducto
    ),
      Total_CantidadRecibida = this.Lista_Productos[pos].producto.reduce(
        this.reducer,
        0
      );

    if (Total_CantidadRecibida > CantidadPedida) {
      this.confirmacionSwal.title = 'Error en Cantidad';
      this.confirmacionSwal.html =
        'La cantidad recibida no debe ser superior a la cantidad pedida de este producto.';
      this.confirmacionSwal.icon = 'error';
      this.confirmacionSwal.fire();
      (document.getElementById('Cantidad' + pos3) as HTMLInputElement).value =
        '';
    }
  } */

  /* replacerStringify(json) {
    var cache = [];
    var json_fix = JSON.stringify(json, function (key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          try {
            return JSON.parse(JSON.stringify(value));
          } catch (error) {
            return;
          }
        }
        cache.push(value);
      }
      return value;
    });
    cache = null;
    return json_fix;
  } */

  /* AgregarRetencion() {
    if (this.RetencionesFacturaSeleccionada.length > 0) {
      for (
        let index = 0;
        index < this.RetencionesFacturaSeleccionada.length;
        index++
      ) {
        if (this.RetencionesFacturaSeleccionada[index].Id_Retencion == '') {
          this.swalService.show({
            icon: 'warning',
            title: 'Alerta',
            text: 'Debe llenar los campos de todas las retenciones agregadas!',
          });
          return;
        }
      }
    }

    let retencion = {
      Id_Retencion: '',
      Nombre: '',
      Valor: '',
      Porcentaje: '',
      Tipo: '',
    };
    this.Facturas[this.PosicionFacturaSeleccionada].Retenciones.push(retencion);

    localStorage.setItem('Facturas', JSON.stringify(this.Facturas));
  } */

  /* ValidatebeforeAdd(objRetencion: any, arrPos: string) {
    if (objRetencion.Id_Retencion != '') {
      let retencion_original = this.ListaRetenciones.find(
        (x) => x.Id_Retencion == objRetencion.Id_Retencion
      );

      if (this.RetencionesFacturaSeleccionada.length > 0) {
        let exist = this.RetencionesFacturaSeleccionada.filter(
          (x) => x.Id_Retencion == objRetencion.Id_Retencion
        );

        if (exist.length >= 2) {
          this.swalService.show({
            icon: 'warning',
            title: 'Alerta',
            text: 'No se pueden agregar retenciones duplicadas!!',
          });
          this.Facturas[this.PosicionFacturaSeleccionada].Retenciones[arrPos] =
          {
            Id_Retencion: '',
            Nombre: '',
            Valor: '',
            Porcentaje: '',
            Tipo: '',
          };
        } else {
          this.Facturas[this.PosicionFacturaSeleccionada].Retenciones[
            arrPos
          ].Tipo = retencion_original.Tipo_Retencion;
          this.Facturas[this.PosicionFacturaSeleccionada].Retenciones[
            arrPos
          ].Nombre = retencion_original.Nombre;

          let qtyTipo = this.RetencionesFacturaSeleccionada.filter(
            (x) => x.Tipo == retencion_original.Tipo_Retencion
          );

          if (qtyTipo.length >= 2) {
            this.swalService.show({
              icon: 'warning',
              title: 'Alerta',
              text: 'No se pueden agregar 2 retenciones del mismo tipo!',
            });
            this.Facturas[this.PosicionFacturaSeleccionada].Retenciones[
              arrPos
            ] = {
              Id_Retencion: '',
              Nombre: '',
              Valor: '',
              Porcentaje: '',
              Tipo: '',
            };
          } else {
            this.Facturas[this.PosicionFacturaSeleccionada].Retenciones[
              arrPos
            ].Porcentaje = retencion_original.Porcentaje;
          }
        }
      }
    } else {
      this.Facturas[this.PosicionFacturaSeleccionada].Retenciones[arrPos] = {
        Id_Retencion: '',
        Nombre: '',
        Valor: '',
        Porcentaje: '',
        Tipo: '',
      };
    }
    localStorage.setItem('Facturas', JSON.stringify(this.Facturas));
    this.CalculoRetencion2();
  } */

  /* AbrirModalRetenciones(pos: string, retenciones: Array<any>) {
    this.Nombre_Factura_Seleccionada = 'Factura #' + (parseInt(pos) + 1);
    this.RetencionesFacturaSeleccionada = retenciones;
    this.PosicionFacturaSeleccionada = pos;
    this.ModalRetenciones.show();
  } */

  /* ObtenerTotalFactura(nroFactura: string) {
    let result = { Factura: nroFactura, total_factura: 0, iva_factura: 0 };

    if (this.Lista_Productos.length > 0) {
      this.Lista_Productos.forEach((lista) => {
        if (lista.producto.length > 0) {
          let prodFactura = lista.producto.filter(
            (x) => x.Factura == nroFactura
          );

          if (prodFactura.length > 0) {
            prodFactura.forEach((p) => {
              result.total_factura += p.Subtotal;
              result.iva_factura += p.Iva;
            });
          } else {
            result.total_factura = 0;
            result.iva_factura = 0;
          }
        }
      });
    } else {
      result.total_factura = 0;
      result.iva_factura = 0;
    }

    return result;
  } */

  /* MarcarNoConforme(pos) {
    if (this.Lista_Productos[pos].Eliminado == 'Si') {
      this.Lista_Productos[pos].Eliminado = 'No';
      this.Lista_Productos[pos].Disabled = false;
      for (
        let index = 0;
        index < this.Lista_Productos[pos].producto.length;
        index++
      ) {
        this.Lista_Productos[pos].producto[index].Disabled = false;
      }
      var tem = this.Lista_Eliminados.findIndex(
        (x) => x === this.Lista_Productos[pos].Id_Producto
      );
      if (tem >= 0) {
        this.Lista_Eliminados.splice(tem, 1);
      }
    } else {
      this.Lista_Productos[pos].Eliminado = 'Si';
      this.Lista_Eliminados.push(this.Lista_Productos[pos].Id_Producto);
      this.Lista_Productos[pos].Disabled = true;
      for (
        let index = 0;
        index < this.Lista_Productos[pos].producto.length;
        index++
      ) {
        this.Lista_Productos[pos].producto[index].Disabled = true;
      }
    }
  } */

  /* productoNoRecibido(pos) {
    let inputCheck = document.getElementById(
      'noRecibido' + pos
    ) as HTMLInputElement;

    if (inputCheck.checked) {
      this.Lista_Productos[pos].No_Conforme = 2;
      document
        .getElementById('fila' + pos)
        .setAttribute('class', 'label-danger');
      this.confirmacionSwal.title = 'Aviso';
      this.confirmacionSwal.html = 'Has marcado el producto como no recibido.';
      this.confirmacionSwal.icon = 'info';
      this.confirmacionSwal.fire();
    } else {
      this.Lista_Productos[pos].No_Conforme = 0;
      document.getElementById('fila' + pos).removeAttribute('class');
    }
  } */
}
