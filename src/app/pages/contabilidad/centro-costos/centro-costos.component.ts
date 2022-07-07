import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectOption, NgForm } from '@angular/forms';
import { CentroCostosService } from './centro-costos.service';
import { Globales } from '../globales';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-centro-costos',
  templateUrl: './centro-costos.component.html',
  styleUrls: ['./centro-costos.component.scss']
})
export class CentroCostosComponent implements OnInit {
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
  @ViewChild('modalCentroCosto') modalCentroCosto: any;
  @ViewChild('modalVerCentroCosto') modalVerCentroCosto: any;
  @ViewChild('alertSwal') alertSwal: any;
  enviromen: any;
  public Cargando: boolean = true;
  public Costos: any = [];
  public maxSize = 15;
  public pageSize = 20;
  public TotalItems: 0;
  public page: number;
  public filtro_nombre = '';
  public filtro_codigo = '';
  public filtro_cuenta = '';
  public CentrosCostosPadre: Array<NgSelectOption>;

  public items: any = [];
  public ValorTipo: any = 'Escoja tipo';

  public CentroCostoModel: any = {
    Nombre: '',
    Codigo: '',
    //EsCentroPadre: false,
    Id_Centro_Padre: '',
    Id_Tipo_Centro: '',
    Valor_Tipo_Centro: '',
    Movimiento: 'No',
    Id_Empresa: ''
    //Nivel: 0
  };

  public EditarCentroCostoModel: any = {
    Nombre: '',
    Codigo: '',
    Id_Centro_Padre: '',
    Id_Tipo_Centro: '',
    Valor_Tipo_Centro: '',
    Id_Centro_Costo: '',
    Movimiento: '',
    Id_Empresa: ''
  };

  public VerCentroCostoModel: any = {
    NombreCentro: '',
    CodigoCentro: '',
    PadreCentro: '',
    TipoCentro: '',
    ValorTipoCentro: '',
    Empresa: ''
  };

  public TiposCentro1: Array<string> = [
    "Tercero", "Departamento"
  ];

  public TiposCentro: any = [];

  public Niveles: Array<number> = [
    1, 2, 3, 4, 5
  ];

  public Filtros: any = {
    Codigo: '',
    Nombre: '',
    Id_Empresa: ''
  }

  public CentrosPadre: Array<string> = [
    'Administracion',
    'Contabilidad'
  ];

  public ValoresTipoCentro: any = [];
  public CentrosCostos: any = [];
  public CentrosCostosEditar: any = [];

  public CodigoPlaceholder: string = 'Codigo';
  companies: any[] = [];
  constructor(
    public globales: Globales,
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    private _centroCosto: CentroCostosService,
    private modalService: NgbModal,
  ) { }

  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
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

  ngOnInit() {
    this.ListarCostos();
    this.QueryTipoCentros();
    this.QueryCentrosCostos();
    this.enviromen = environment;
    // this.getCompanies();
  }
  estadoFiltros = false;
  mostrarFiltros() {
    this.estadoFiltros = !this.estadoFiltros
  }
  openInNewTab() {
    window.open(this.enviromen.ruta + 'php/centroscostos/exportar.php', '_blank').focus();
  }
  ListarCostos() {
    /* this.http.get(environment.ruta + 'php/centroscostos/centro_costos_listar.php').subscribe((data: any) => {
      this.items = data;
    }); */

    let queryString = this.getQueryParams();

    this.http.get(environment.ruta + 'php/centroscostos/lista_centros_costos.php' + queryString).subscribe((data: any) => {
      this.Cargando = false;
      this.items = data.Centros;
      this.TotalItems = data.numReg;
    });
  }

  /*   getCompanies(){
      this._centroCosto.getCompanies().subscribe((data:any) => {
        this.companies = data.data;
      })
    }
   */
  getQueryParams() {

    let queryParams = this.route.snapshot.queryParams;

    this.Filtros.Codigo = queryParams.cod ? queryParams.cod : '';
    this.Filtros.Nombre = queryParams.nom ? queryParams.nom : '';
    this.page = queryParams.pag ? queryParams.pag : 1;

    let queryString = '?' + Object.keys(queryParams).map(key => key + '=' + queryParams[key]).join('&');

    return queryString;

  }

  getQueryStringFiltro() {

    let params: any = {
      pag: this.page
    };

    if (this.Filtros.Codigo != '') {
      params.cod = this.Filtros.Codigo;
    }

    if (this.Filtros.Nombre != '') {
      params.nom = this.Filtros.Nombre;
    }

    if (this.Filtros.Id_Empresa != '') {
      params.empresa = this.Filtros.Id_Empresa
    }

    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

    this.location.replaceState('/contabilidad/centro-costos', queryString); // actualizando URL

    return queryString;

  }

  filtrar(paginacion?) {
    this.Cargando = true;
    if (paginacion != undefined && paginacion == 'No') {
      this.page = 1;
    }

    let queryString = this.getQueryStringFiltro();

    this.http.get(environment.ruta + '/php/centroscostos/lista_centros_costos.php?' + queryString).subscribe((data: any) => {
      this.items = data.Centros;
      this.TotalItems = data.numReg;
      this.Cargando = false;
    });

  }

  QueryCentrosCostos(idCentro: string = '') {

    if (idCentro === '') {
      this.http.get(environment.ruta + 'php/centroscostos/lista_centros_costos.php').subscribe((data: any) => {
        this.CentrosCostos = data.Centros;
        this.CentrosCostosPadre = data.CentrosCostosPadre;
      });
    } else {
      this.http.get(environment.ruta + 'php/centroscostos/lista_centros_costos.php', { params: { id_centro: idCentro } }).subscribe((data: any) => {
        this.CentrosCostosEditar = data.Centros;
        this.CentrosCostosPadre = data.CentrosCostosPadre;

      });
    }

  }

  QueryTipoCentros() {
    this.http.get(environment.ruta + 'php/centroscostos/lista_tipo_centro.php').subscribe((data: any) => {
      this.TiposCentro = data;
    });
  }

  QueryCentroCosto(id: number) {
    let idStr = id.toString();

    this.http.get(environment.ruta + 'php/centroscostos/consultar_centro.php', { params: { nivel: idStr } }).subscribe((data: any) => {
      this.CentroCostoModel.Nombre = data.Nombre;
      this.CentroCostoModel.Codigo = data.Codigo;
      this.CentroCostoModel.EsCentroPadre = data.Es_Padre;
      this.CentroCostoModel.Padre = data.Centro_Padre;
      this.CentroCostoModel.Tipo = data.Tipo;
      this.CentroCostoModel.Nivel = data.Nivel;
      this.CentroCostoModel.ValorTipo = data.Valor_Tipo;
    });
  }

  GuardarCentroCosto(FormCentroCosto: NgForm, funcion: string) {

    if (funcion == 'guardar') {

      let datos = new FormData();
      let data = this.normalize(JSON.stringify(this.CentroCostoModel));
      datos.append("Datos", data);
      datos.append("accion", funcion);
      this.PeticionGuardarCentro(datos);
      this.modalService.dismissAll(); 
      this.LimpiarModelo();

      setTimeout(() => {
        this.ListarCostos();
      }, 1000);

    } else if (funcion == 'editar') {

      let datos = new FormData();
      let data = this.normalize(JSON.stringify(this.EditarCentroCostoModel));
      datos.append("Datos", data);
      datos.append("accion", funcion);

      this.PeticionGuardarCentro(datos);
      this.modalService.dismissAll(); 
      this.LimpiarModelo();

      setTimeout(() => {
        this.ListarCostos();
      }, 1000);
    }

  }

  AbrirModalNuevoCentro() {
    this.modalCentroCosto.show();
  }

  AbrirModalVerCentro() {
    this.modalVerCentroCosto.show();
  }

  ValorTipoCentro(value: string) {

    switch (value) {
      case '1':
        this.CentroCostoModel.ValorTipo = 'Tercero';
        this.ValorTipo = 'Tercero';

        this.http.get(environment.ruta + 'php/centroscostos/listar_valores_tipo_centro.php', { params: { id_tipo: value, tipo: 'Tercero' } }).subscribe((data: any) => {

          this.ValoresTipoCentro = data;
        });
        break;

      case '2':
        this.CentroCostoModel.ValorTipo = 'Departamento';
        this.ValorTipo = 'Departamento';

        this.http.get(environment.ruta + 'php/centroscostos/listar_valores_tipo_centro.php', { params: { id_tipo: value, tipo: 'Departamento' } }).subscribe((data: any) => {

          this.ValoresTipoCentro = data;
        });
        break;

      case '4':
        this.CentroCostoModel.ValorTipo = 'Municipio';
        this.ValorTipo = 'Municipio';

        this.http.get(environment.ruta + 'php/centroscostos/listar_valores_tipo_centro.php', { params: { id_tipo: value, tipo: 'Municipio' } }).subscribe((data: any) => {

          this.ValoresTipoCentro = data;
        });
        break;

      case '5':
        this.CentroCostoModel.ValorTipo = 'Zona';
        this.ValorTipo = 'Zona';

        this.http.get(environment.ruta + 'php/centroscostos/listar_valores_tipo_centro.php', { params: { id_tipo: value, tipo: 'Zonas' } }).subscribe((data: any) => {

          this.ValoresTipoCentro = data;
        });
        break;

      default:
        this.CentroCostoModel.ValorTipo = 'Tipo';
        this.ValorTipo = 'Tipo';
        this.ValoresTipoCentro = [];
        break;
    }
  }

  checkValue(event: any) {
    // console.log(event);
    if (event) {
      this.CodigoPlaceholder = 'Ej: 001';
      this.CentroCostoModel.Nivel = '';
      this.CentroCostoModel.Padre = '';
    } else {
      this.CodigoPlaceholder = 'Ej: 01';
    }
  }

  Validaciones() {
    if (this.CentroCostoModel.EsCentroPadre) {
      if (this.CentroCostoModel.Codigo.length < 3) {
        Swal.fire({
          icon: 'warning',
          title: 'Alerta',
          text: 'El código de un centro de costo padre no puede ser de dos(2) dígitos'
        })
        // this.ShowSwal('warning', 'Alerta', 'El código de un centro de costo padre no puede ser de dos(2) dígitos');
      }
    }
  }

  VerCentroCosto(idCentroCosto) {

    this.http.get(environment.ruta + 'php/centroscostos/consultar_centro_costo.php', { params: { id_centro: idCentroCosto.toString() } }).subscribe((data: any) => {

      this.VerCentroCostoModel = {
        NombreCentro: '',
        CodigoCentro: '',
        PadreCentro: '',
        TipoCentro: '',
        ValorTipoCentro: ''
      };
    });
  }

  EditarCentroCosto(idCentroCosto) {

    this.http.get(environment.ruta + 'php/centroscostos/consultar_centro_costo.php', { params: { id_centro: idCentroCosto.toString(), opcion: 'editar' } }).subscribe((data: any) => {
      console.log(data);
      this.ValorTipoCentro(data.Id_Tipo_Centro);

      this.QueryCentrosCostos(idCentroCosto);

      setTimeout(() => {
        this.EditarCentroCostoModel = data;
      }, 300);

    });
  }

  normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
          ret.push(mapping[c]);
        else
          ret.push(c);
      }
      return ret.join('');
    }

  })();

  PeticionGuardarCentro(data) {
    this.http.post(environment.ruta + 'php/centroscostos/guardar_centros_costos.php', data).subscribe((data: any) => {
      if (data.codigo == 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Registro Exitoso',
          text: data.mensaje
        })
        // this.ShowSwal('success', 'Registro Exitoso', data.mensaje);
        this.QueryCentrosCostos();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: data.mensaje
        })
        // this.ShowSwal('error', 'Error!', data.mensaje);
      }
    });
  }

  LimpiarModelo() {
    this.CentroCostoModel = {
      Nombre: '',
      Codigo: '',
      Id_Centro_Padre: '0',
      Id_Tipo_Centro: '',
      Valor_Tipo_Centro: '',
      ValorTipo: 'Escoja el tipo'
    };
  }

  CambiarEstado(id_centro) {
    this.http.get(environment.ruta + 'php/centroscostos/cambiar_estado_centro_costo.php', { params: { id_centro: id_centro.toString() } }).subscribe((data: any) => {
      if (data.codigo == 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Cambio Exitoso',
          text: data.msg
        })
        // this.ShowSwal('success', 'Cambio Exitoso', data.msg);  
      } else if (data.codigo == 'error') {
        Swal.fire({
          icon: 'error',
          title: 'Error Inesperado',
          text: data.msg
        })
        // this.ShowSwal('error', 'Error Inesperado', data.msg);
      } else if (data.codigo == 'warning') {
        Swal.fire({
          icon: 'warning',
          title: 'Alerta',
          text: data.msg
        })
        // this.ShowSwal('warning', 'Alerta', data.msg);
      }

      setTimeout(() => {
        this.ListarCostos();
      }, 1000);
    });
  }

  Eliminar(id_centro) {
    this.http.get(environment.ruta + 'php/centroscostos/eliminar_centro_costo.php', { params: { id: id_centro } }).subscribe((data: any) => {
      if (data.tipo == 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Eliminado con éxito',
          text: data.mensaje
        })
        // this.ShowSwal('success', 'Cambio Exitoso', data.mensaje);  
      } else if (data.tipo == 'error') {
        Swal.fire({
          icon: 'error',
          title: 'Error Inesperado',
          text: data.mensaje
        })
        // this.ShowSwal('error', 'Error Inesperado', data.mensaje);
      }
      setTimeout(() => {
        this.ListarCostos();
      }, 500);
    });
  }

  Test() {
    console.log(this.EditarCentroCostoModel);

  }

}
