import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { IMyDrpOptions } from 'mydaterangepicker';

@Component({
  selector: 'app-board-contabilidad',
  templateUrl: './board-contabilidad.component.html',
  styleUrls: ['./board-contabilidad.component.scss']
})
export class BoardContabilidadComponent implements OnInit {
  globales = {ruta: 'http://inventario.sigmaqmo.com/'}
  private _rutaReportesAuditor =this.globales.ruta+'php/tableroauditor/reportes.php';
  private _rutaReportesContabilidad =this.globales.ruta+'php/tablerocontabilidad/reportes.php';

  myDateRangePickerOptions1: IMyDrpOptions = {
    width:'120px', 
    height: '21px',
    selectBeginDateTxt:'Inicio',
    selectEndDateTxt:'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };

  public Reportes:any=[
    {
      Color: 'bg-inverse',
      Icono: ' fa fa-download',
      Texto: 'Reporte Ventas ',
      Tipo:'Ventas',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'bg-viber',
      Icono: ' fa fa-download',
      Texto: 'Reporte Actas Compras ',
      Tipo:'Acta_Compra',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'bg-success',
      Icono: ' fa fa-download',
      Texto: 'Reporte Ajuste Individual ',
      Tipo:'Reporte_Ajuste',
      Ruta: this._rutaReportesAuditor
    },
    {
      Color: 'bg-c-yellow',
      Icono: ' fa fa-download',
      Texto: 'Reporte Remisiones ',
      Tipo:'Reporte_Remision',
      Ruta: this._rutaReportesAuditor
    },
    {
      Color: 'bg-twitter',
      Icono: ' fa fa-download',
      Texto: 'Reporte Actas Remisiones ',
      Tipo:'Reporte_Acta_Remision',
      Ruta: this._rutaReportesAuditor
    },
    {
      Color: 'bg-instagram',
      Icono: ' fa fa-download',
      Texto: 'Reporte Inventario Fisico Bodega ',
      Tipo:'Reporte_Inventario_Bodega',
      Ruta: this._rutaReportesAuditor
    },
    {
      Color: 'bg-dark',
      Icono: ' fa fa-download',
      Texto: 'Reporte Inventario Fisico Puntos ',
      Tipo:'Reporte_Inventario_Punto',
      Ruta: this._rutaReportesAuditor
    },
    {
      Color: 'bg-c-lite-green',
      Icono: ' fa fa-download',
      Texto: 'Reporte Actas Internacionales ',
      Tipo:'Reporte_Acta_Internacional',
      Ruta: this._rutaReportesAuditor
    },
    {
      Color: 'bg-c-lite-green',
      Icono: ' fa fa-download',
      Texto: 'Reporte Nacionalización ',
      Tipo:'Reporte_Nacionalizacion',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'bg-youtube',
      Icono: ' fa fa-download',
      Texto: 'Reporte Devolucion Compras ',
      Tipo:'DevolucionC',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'bg-secondary',
      Icono: ' fa fa-download',
      Texto: 'Reporte Devolucion Ventas  ',
      Tipo:'DevolucionV',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'bg-youtube',
      Icono: ' fa fa-download',
      Texto: 'Reporte Inventario Valorizado ',
      Tipo:'Inventario_Valorizado',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'bg-inverse',
      Icono: ' fa fa-download',
      Texto: 'Reporte Dispensación',
      Tipo:'Dispensacion',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'bg-instagram',
      Icono: ' fa fa-download',
      Texto: 'Reporte Dispensación Cuotas',
      Tipo:'Dispensacion_Cuotas',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'bg-c-lite-green',
      Icono: ' fa fa-download',
      Texto: 'Reporte Terceros Consolidados',
      Tipo:'Terceros',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'bg-viber',
      Icono: ' fa fa-download',
      Texto: 'Reporte Dispensacion Costo Pendiente',
      Tipo:'Dispensacion_Pendientes',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'bg-c-yellow',
      Icono: ' fa fa-download',
      Texto: 'Reporte de Exentos',
      Tipo:'Reporte_Exentos',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'bg-twitter',
      Icono: ' fa fa-download',
      Texto: 'Reporte Nota Credito G',
      Tipo:'Nota_Credito_Global',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'bg-primary',
      Icono: ' fa fa-download',
      Texto: 'Reporte Compras - Parciales Internacionales',
      Tipo:'Compra_Pai',
      Ruta: this._rutaReportesContabilidad
    }
  ]
  page1: number = 1;
  filtro_cod_fact: any = '';
  filtro_fecha_fact: any = '';
  filtro_estado_fact: any = '';
  filtro_facturador: any = '';
  filtro_cliente: any = '';
  Facturas:any = [];
  TotalItems1:number = 0;
  public maxSize = 20;
  filtro_tipo_fact: string = '';
  resoluciones: any = 0;

  constructor(private route: ActivatedRoute, private http: HttpClient, private location: Location) { }
  
  ngOnInit() {
    this.ListarDetallesFacturacion();
  }

  ListarDetallesFacturacion() {
    
    let params = this.route.snapshot.queryParams;

    let queryString = '';
    
    if (Object.keys(params).length > 0) { // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page1 = params.pag ? params.pag : 1;
      this.filtro_cod_fact = params.cod_fact ? params.cod_fact : '';
      this.filtro_fecha_fact = params.fecha_fact ? params.fecha_fact : '';
      this.filtro_estado_fact = params.estado_fact ? params.estado_fact : '';
      this.filtro_facturador = params.facturador ? params.facturador : '';
      this.filtro_cliente = params.cliente ? params.cliente : '';

      queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    }
    
    this.http.get(this.globales.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php'+queryString).subscribe((data: any) => {
      this.Facturas = data.Facturas;
      this.TotalItems1 = data.numReg;
    });
  }

  paginacion() {

    let params:any = {
      pag: this.page1
    };

    console.log(this.filtro_fecha_fact);
    

    if (this.filtro_cod_fact != "") {
      params.cod_fact= this.filtro_cod_fact;
    }
    if (this.filtro_fecha_fact != "" && this.filtro_fecha_fact != null) {
      params.fecha_fact = this.filtro_fecha_fact;
    }
    if (this.filtro_estado_fact != "") {
      params.estado_fact = this.filtro_estado_fact;
    }
    if (this.filtro_facturador != "") {
      params.facturador = this.filtro_facturador;
    }
    if (this.filtro_cliente != "") {
      params.cliente = this.filtro_cliente;
    }
    if (this.filtro_tipo_fact != "") {
      params.tipo = this.filtro_tipo_fact;
    }

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    this.location.replaceState('/tablero', queryString);
    
    this.http.get(this.globales.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php?'+queryString).subscribe((data: any) => {
      this.Facturas = data.Facturas;
      this.TotalItems1 = data.numReg;
    });
  }

  dateRangeChanged1(event) {
    
    if (event.formatted != "") {
      this.filtro_fecha_fact = event.formatted;
    } else {
      this.filtro_fecha_fact = '';
    }
    this.filtros1();
  }

  filtros1() {
    let params:any = {};

    if (this.filtro_cod_fact != "" || this.filtro_fecha_fact != "" || this.filtro_estado_fact != "" || this.filtro_facturador != "" || this.filtro_cliente != "" || this.filtro_tipo_fact != "") {
      this.page1 = 1;
      params.pag = this.page1;
      
      if (this.filtro_cod_fact != "") {
        params.cod_fact= this.filtro_cod_fact;
      }
      if (this.filtro_fecha_fact != "" && this.filtro_fecha_fact != null) {
        params.fecha_fact = this.filtro_fecha_fact;
      }
      if (this.filtro_estado_fact != "") {
        params.estado_fact = this.filtro_estado_fact;
      }
      if (this.filtro_facturador != "") {
        params.facturador = this.filtro_facturador;
      }
      if (this.filtro_cliente != "") {
        params.cliente = this.filtro_cliente;
      }
      if (this.filtro_tipo_fact != "") {
        params.tipo = this.filtro_tipo_fact;
      }
      

      let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

      this.location.replaceState('/tablero', queryString);

      this.http.get(this.globales.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php?'+queryString).subscribe((data: any) => {
        this.Facturas = data.Facturas;
        this.TotalItems1 = data.numReg;
      });
    } else {
      this.location.replaceState('/tablero', '');

      this.page1 = 1;
      this.filtro_fecha_fact = '';
      this.filtro_cod_fact = '';
      this.filtro_estado_fact = '';
      this.filtro_facturador = '';
      this.filtro_cliente = '';
      this.filtro_tipo_fact = '';

      this.http.get(this.globales.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php').subscribe((data: any) => {
        this.Facturas = data.Facturas;
        this.TotalItems1 = data.numReg; 
      });
    }
  }

  countResolucionesXVencer(data) {
    console.log(data);
    
    this.resoluciones = data.length;
  }
}
