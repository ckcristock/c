import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { IMyDrpOptions } from 'mydaterangepicker';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-board-contabilidad',
  templateUrl: './board-contabilidad.component.html',
  styleUrls: ['./board-contabilidad.component.scss']
})
export class BoardContabilidadComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  globales = { ruta: 'http://inventario.sigmaqmo.com/' }
  private _rutaReportesAuditor = this.globales.ruta + 'php/tableroauditor/reportes.php';
  private _rutaReportesContabilidad = this.globales.ruta + 'php/tablerocontabilidad/reportes.php';

  myDateRangePickerOptions1: IMyDrpOptions = {
    width: '120px',
    height: '21px',
    selectBeginDateTxt: 'Inicio',
    selectEndDateTxt: 'Fin',
    selectionTxtFontSize: '10px',
    dateFormat: 'yyyy-mm-dd',
  };
  public Reportes: any = [
    {
      Color: 'text-info',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte ventas ',
      Tipo: 'Ventas',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'text-warning',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte actas compras ',
      Tipo: 'Acta_Compra',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'text-success',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte ajuste individual ',
      Tipo: 'Reporte_Ajuste',
      Ruta: this._rutaReportesAuditor
    },
    {
      Color: 'text-info',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte remisiones ',
      Tipo: 'Reporte_Remision',
      Ruta: this._rutaReportesAuditor
    },
    {
      Color: 'text-danger',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte actas remisiones ',
      Tipo: 'Reporte_Acta_Remision',
      Ruta: this._rutaReportesAuditor
    },
    {
      Color: 'text-primary',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte inventario físico bodega ',
      Tipo: 'Reporte_Inventario_Bodega',
      Ruta: this._rutaReportesAuditor
    },
    {
      Color: 'text-info',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte inventario físico puntos ',
      Tipo: 'Reporte_Inventario_Punto',
      Ruta: this._rutaReportesAuditor
    },
    {
      Color: 'text-warning',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte actas internacionales ',
      Tipo: 'Reporte_Acta_Internacional',
      Ruta: this._rutaReportesAuditor
    },
    {
      Color: 'text-success',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte nacionalización ',
      Tipo: 'Reporte_Nacionalizacion',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'text-info',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte devolución compras ',
      Tipo: 'DevolucionC',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'text-danger',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte devolución ventas  ',
      Tipo: 'DevolucionV',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'text-primary',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte inventario valorizado ',
      Tipo: 'Inventario_Valorizado',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'text-info',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte dispensación',
      Tipo: 'Dispensacion',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'text-danger',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte dispensación cuotas',
      Tipo: 'Dispensacion_Cuotas',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'text-info',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte terceros consolidados',
      Tipo: 'Terceros',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'text-success',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte dispensacion costo pendiente',
      Tipo: 'Dispensacion_Pendientes',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'text-warning',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte de exentos',
      Tipo: 'Reporte_Exentos',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'text-primary',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte nota crédito g.',
      Tipo: 'Nota_Credito_Global',
      Ruta: this._rutaReportesContabilidad
    },
    {
      Color: 'text-danger',
      Icono: 'fas fa-file-download',
      Texto: 'Reporte compras - Parciales internacionales',
      Tipo: 'Compra_Pai',
      Ruta: this._rutaReportesContabilidad
    }
  ]
  page1: number = 1;
  filtro_cod_fact: any = '';
  filtro_fecha_fact: any = '';
  filtro_estado_fact: any = '';
  filtro_facturador: any = '';
  filtro_cliente: any = '';
  Facturas: any = [];
  TotalItems1: number = 0;
  public maxSize = 20;
  filtro_tipo_fact: string = '';
  filtro_mod: string = '';
  resoluciones: any = 0;
  loading: boolean = false
  constructor(private route: ActivatedRoute, private http: HttpClient, private location: Location) { }

  ngOnInit() {
    this.ListarDetallesFacturacion();
  }

  ListarDetallesFacturacion() {
    this.loading = true
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

    this.http.get(this.globales.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php' + queryString).subscribe((data: any) => {
      this.Facturas = data.Facturas;
      this.loading = false
      this.TotalItems1 = data.numReg;
    });
  }

  paginacion() {

    let params: any = {
      pag: this.page1
    };

    if (this.filtro_cod_fact != "") {
      params.cod_fact = this.filtro_cod_fact;
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

    this.http.get(this.globales.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php?' + queryString).subscribe((data: any) => {
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
    let params: any = {};

    if (this.filtro_cod_fact != "" || this.filtro_fecha_fact != "" || this.filtro_estado_fact != "" || this.filtro_facturador != "" || this.filtro_cliente != "" || this.filtro_tipo_fact != "") {
      this.page1 = 1;
      params.pag = this.page1;

      if (this.filtro_cod_fact != "") {
        params.cod_fact = this.filtro_cod_fact;
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

      this.http.get(this.globales.ruta + '/php/tablero_jefe_facturacion/lista_facturas.php?' + queryString).subscribe((data: any) => {
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

    this.resoluciones = data.length;
  }
}
