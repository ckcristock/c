import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IMyDrpOptions } from 'mydaterangepicker';
import { Location } from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {

  @ViewChild("PlantillaProductos") PlantillaProductos: TemplateRef<any>;
  // @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild("confirmacionSwal") confirmacionSwal: any;
  @ViewChild("modalInventario") modalInventario: any;
  @ViewChild("modalApartadas") modalApartadas: any;
  @ViewChild("modalSeleccionadas") modalSeleccionadas: any;
  @ViewChild("modalCompras") modalCompras: any;
  @ViewChild("modalContrato") modalContrato: any;
  Bodegadefecto;
  IdPuntoDispensacion;
  rowsFilter = [];
  tempFilter = [];
  columns = [];
  loadingIndicator = true;
  timeout: any;
  public cargando = false;
  public bodegas: any[] = [];
  public categorias_nuevas: any[] = [];
  public display_bodega = "block";
  public display_punto = "none";

  public Cargando_Compras = false;
  public Compras: any = [];

  public bodegas_nuevo: any = [];
  public bodega_selected: any = 0;

  //TODO Corregir funcionario login
  // public user = JSON.parse(localStorage.getItem("User"));
  public user = {Identificacion_Funcionario : '1'};
  public permiso: boolean = false;

  public Inventarios: any = [];
  public TotalItems: number;
  public page = 1;
  public maxSize = 10;
  public pageSize = 20;
  myDateRangePickerOptions: IMyDrpOptions = {
    width: "220px",
    height: "21px",
    selectBeginDateTxt: "Inicio",
    selectEndDateTxt: "Fin",
    selectionTxtFontSize: "10px",
    dateFormat: "yyyy-mm-dd",
  };

  public filtro_nom: string = "";
  public filtro_lab: string = "";
  public filtro_lote: string = "";
  public filtro_cant: string = "";
  public filtro_cant_sel: string = "";
  public filtro_cum: string = "";
  public filtro_fecha: any = "";
  public filtro_cant_apar: any = "";
  public filtro_bod: any = "";
  public filtro_lab_gen: any = "";
  public filtro_invima: any = "";
  public filtro_grupo :any = "";
  public filtro_iva: any = "";
  public Cargando_Tabla = false;
  public Cargando_Apartadas = false;

  public listas = [];
  public lista_informe = 1;

  public tipo_punto: string = "Bodega";
  public subtipo_punto: any = 0;
  public filtrando: boolean = false;

  public nombre_producto: string = "";
  public lote_producto: string = "";
  public fecha_venc_producto: string = "";
  public Apartadas: any = [];

  public filtro_sin_inventario: boolean = true;

  csv: any;
  Cargando_Seleccionados: boolean = false;
  Seleccionados: any = [];
  CargandoDetalleContrato: boolean = false;
  DetalleContrato: any = [];

  constructor(
    private http: HttpClient,
    private location: Location,
    private route: ActivatedRoute,
    public dropConfig :NgbDropdownConfig
  ) {
    // configuraciones de boton desplegable ngboostrap
    dropConfig.placement = 'left-top';
    /* dropConfig.autoClose = false; */
  }

  ngOnInit() {

    this.http
      .get(environment.ruta+ "php/lista_generales.php", {params: { modulo: "Lista_Ganancia" },}).subscribe((data: any) => {
        this.listas = data;
      });

    this.ListarInventario(true);


    this.http
      .get(environment.ruta+ "php/actarecepcion/detalle_perfil_dev.php", {
        params: { funcionario: this.user.Identificacion_Funcionario },
      })
      .subscribe((data: any) => {
        this.permiso = data.status;
      });

    this.http
      .get(environment.ruta+ "php/bodega_nuevo/get_bodegas.php")
      .subscribe((data: any) => {
        if (data.Tipo == "success") this.bodegas_nuevo = data.Bodegas;
      });
  }

  ListarInventario(primeraVez=false) {
    let params = Object.assign({},this.route.snapshot.queryParams);

   if (!params.lista) {
      params.lista = 1


   }
   if (params.id_bodega_nuevo) {
     //params.id es el id de la categoria!!!
     if (params.id) {
        this.buscar_categorias(params.id_bodega_nuevo,params.id);
     }else{
       this.buscar_categorias(params.id_bodega_nuevo);
     }
   }

    let queryString = "";


    if (Object.keys(params).length > 0 || primeraVez) {
      // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page = params.pag ? params.pag : 1;
      this.tipo_punto = params.tipo ? params.tipo : "";
      this.subtipo_punto = params.id ? params.id : 0;
      this.Tipo(this.tipo_punto, this.subtipo_punto);
      this.filtro_nom = params.nom ? params.nom : "";
      this.filtro_lote = params.lote ? params.lote : "";
      this.filtro_lab = params.lab ? params.lab : "";
      this.filtro_cant = params.cant ? params.cant : "";
      this.filtro_cant_sel = params.cant_sel ? params.cant_sel : "";
      this.filtro_fecha = params.fecha ? params.fecha : "";
      this.filtro_cant_apar = params.cant_apar ? params.cant_apar : "";
      this.filtro_bod = params.bod ? params.bod : "";
      this.filtro_lab_gen = params.lab_gen ? params.lab_gen : "";
      this.lista_informe = params.lista ? params.lista : "";
      this.filtro_invima = params.invima ? params.invima : "";
      this.filtro_grupo = params.grupo ? params.grupo : "";
      this.filtro_sin_inventario = params.sin_inventario
        ? params.sin_inventario
        : true;
      this.bodega_selected = params.id_bodega_nuevo
        ? params.id_bodega_nuevo
        : 0;
      $("#sin-inventario").prop("checked", this.filtro_sin_inventario);

      queryString =
        "?" +
        Object.keys(params)
          .map((key) => key + "=" + params[key])
          .join("&");
    }
    this.Cargando_Tabla=true;

    this.http
      .get(
        environment.ruta+"php/inventario_nuevo/lista_inventario.php" + queryString ).subscribe((data: any) => {
        this.Cargando_Tabla=false;
        this.Inventarios = data.inventarios;
        console.log("lista de inventarios");

        console.log( this.Inventarios);

        this.TotalItems = data.numReg;
      });
  }

  verContrato(inventario, i) {
    console.log(inventario);

    this.modalContrato.show();
    this.CargandoDetalleContrato = true;
    this.http.get(environment.ruta+ "php/inventario_nuevo/ver_inventario_contrato.php", {params: { Id_Inventario_Nuevo: inventario},}).subscribe((data: any) => {
        this.DetalleContrato = data;
        this.CargandoDetalleContrato = false;
      });
  }
  limpiarContrato(){
    this.DetalleContrato = [];

  }

  buscar_productos() {
    console.log(this.subtipo_punto, "subtipo punto");
    console.log(this.bodega_selected, "bodega selected");
    this.AsignarValorSinInventario();
    // if ((this.tipo_punto != "" && this.tipo_punto != undefined) &&  (this.bodega_selected != "" && this.bodega_selected != undefined)) {

    let params: any = {
      pag: 1,
      tipo: this.tipo_punto,
      id: this.subtipo_punto ? this.subtipo_punto : "0",
      lista: this.lista_informe,
      id_bodega_nuevo: this.bodega_selected,
      sin_inventario: this.filtro_sin_inventario,
    };

    let queryString = Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");

    this.location.replaceState("/inventarionuevo", queryString);

    this.Cargando_Tabla = true;
    this.filtrando = true;
    console.log(queryString);

    this.http
      .get(
        environment.ruta+
          "php/inventario_nuevo/lista_inventario.php?" +
          queryString
      )
      .subscribe((data: any) => {
        this.Cargando_Tabla = false;
        this.Inventarios = data.inventarios;
        this.TotalItems = data.numReg;

      });
    // } else {
    //   this.location.replaceState('/inventario', '?sin_inventario='+this.filtro_sin_inventario);
    //   this.http.get(environment.ruta+ 'php/inventario_nuevo/lista_inventario.php?sin_inventario='+this.filtro_sin_inventario).subscribe((data:any) => {
    //     this.Cargando_Tabla = false;
    //     this.Inventarios = data.inventarios;
    //     this.TotalItems = data.numReg;
    //     this.page = 1;
    //   });
    this.filtrando = false;
    // }

  }
  buscar_categorias(id_bodega_nuevo, id_categoria?){

      this.http
        .get(environment.ruta+ "php/categoria_nueva/get_categorias_por_bodega.php", {
          params: { id_bodega_nuevo },
        })
        .subscribe((data: any) => {
          this.categorias_nuevas = data['Categorias'];
          if (id_categoria) {
           let cat= this.categorias_nuevas.findIndex(cat=>cat.Id_Categoria_Nueva == id_categoria);
           console.log('categoria encontrada',cat);

          }
        });


  }
  paginacion() {
    let params: any = {
      pag: this.page,
    };

    params.sin_inventario = this.filtro_sin_inventario;

    if (this.subtipo_punto != undefined) {
      params.tipo = this.tipo_punto;
      params.id = this.subtipo_punto;
    }

    if (this.filtro_nom != "") {
      params.nom = this.filtro_nom;
    }
    if (this.filtro_lab != "") {
      params.lab = this.filtro_lab;
    }
    if (this.filtro_lote != "") {
      params.lote = this.filtro_lote;
    }
    if (this.filtro_cum != "") {
      params.cum = this.filtro_cum;
    }
    if (this.filtro_bod != "") {
      params.bod = this.filtro_bod;
    }
    if (this.filtro_lab_gen != "") {
      params.lab_gen = this.filtro_lab_gen;
    }
    if (this.filtro_invima != "") {
      params.invima = this.filtro_invima;
    }
    if (this.filtro_grupo != "") {
      params.grupo = this.filtro_grupo;
    }
    if (this.filtro_cant != "" && this.filtro_cant != null) {
      params.cant = this.filtro_cant;
    }
    if (this.filtro_cant_apar != "" && this.filtro_cant_apar != null) {
      params.cant_apar = this.filtro_cant_apar;
    }
    if (this.filtro_cant_sel != "" && this.filtro_cant_sel != null) {
      params.cant_sel = this.filtro_cant_sel;
    }
    if (this.filtro_fecha != "" && this.filtro_fecha != null) {
      params.fecha = this.filtro_fecha.formatted;
    }
    if (this.filtro_iva != "" && this.filtro_iva != null) {
      params.iva = this.filtro_iva;
    }
    if (this.lista_informe != 0) {
      params.lista = this.lista_informe;
    }

    let queryString = Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");

    this.location.replaceState("/inventarionuevo", queryString);
  this.Cargando_Tabla=true;
    this.http
      .get(
        environment.ruta+
          "/php/inventario_nuevo/lista_inventario.php?" +
          queryString
      )
      .subscribe((data: any) => {
        this.Cargando_Tabla=false;
        this.Inventarios = data.inventarios;
        this.TotalItems = data.numReg;
      });
  }
  dateRangeChanged(event) {
    if (event.formatted != "") {
      this.filtro_fecha = event;
    } else {
      this.filtro_fecha = "";
    }

    this.filtro();
  }
  filtro() {
    this.AsignarValorSinInventario();

    let params: any = {};

    if (
      this.filtro_nom != "" ||
      this.filtro_lab != "" ||
      this.filtro_lote != "" ||
      this.filtro_cant != "" ||
      this.filtro_cant_sel != "" ||
      this.filtro_cum != "" ||
      this.filtro_fecha != "" ||
      this.filtro_cant_apar != "" ||
      this.filtro_bod != "" ||
      this.filtro_lab_gen != "" ||
      this.filtro_invima != "" ||
      this.filtro_grupo != "" ||
      this.lista_informe != 0 ||
      this.filtro_iva != ""
    ) {
      params.sin_inventario = this.filtro_sin_inventario;
      this.page = 1;
      params.pag = this.page;

      if (this.subtipo_punto != undefined) {
        params.tipo = this.tipo_punto;

        if (this.subtipo_punto != "") {
          params.id = this.subtipo_punto;
        }
      }

      if (this.filtro_nom != "") {
        params.nom = this.filtro_nom;
      }
      if (this.filtro_lab != "") {
        params.lab = this.filtro_lab;
      }
      if (this.filtro_lote != "") {
        params.lote = this.filtro_lote;
      }
      if (this.filtro_cum != "") {
        params.cum = this.filtro_cum;
      }
      if (this.filtro_bod != "") {
        params.bod = this.filtro_bod;
      }
      if (this.filtro_lab_gen != "") {
        params.lab_gen = this.filtro_lab_gen;
      }
      if (this.filtro_invima != "") {
        params.invima = this.filtro_invima;
      }
      if (this.filtro_grupo != "") {
        params.grupo = this.filtro_grupo;
      }
      if (this.filtro_cant != "" && this.filtro_cant != null) {
        params.cant = this.filtro_cant;
      }
      if (this.filtro_cant_apar != "" && this.filtro_cant_apar != null) {
        params.cant_apar = this.filtro_cant_apar;
      }
      if (this.filtro_cant_sel != "" && this.filtro_cant_sel != null) {
        params.cant_sel = this.filtro_cant_sel;
      }
      if (this.filtro_fecha != "" && this.filtro_fecha != null) {
        params.fecha = this.filtro_fecha.formatted;
      }
      if (this.lista_informe != 0) {
        params.lista = this.lista_informe;
      }
      if (this.filtro_iva != "" && this.filtro_iva != null) {
        params.iva = this.filtro_iva;
      }

      if (this.bodega_selected != "" && this.bodega_selected != null) {
        params.id_bodega_nuevo = this.bodega_selected;
      }
      if (this.bodega_selected != "" && this.bodega_selected != null) {
        params.id_bodega_nuevo = this.bodega_selected;
      }

      let queryString = Object.keys(params)
        .map((key) => key + "=" + params[key])
        .join("&");

      this.location.replaceState("/inventarionuevo", queryString);
      this.Cargando_Tabla = true;
      this.http
        .get(
          environment.ruta+
            "php/inventario_nuevo/lista_inventario.php?" +
            queryString
        )
        .subscribe((data: any) => {
          this.Inventarios = data.inventarios;
          this.TotalItems = data.numReg;
          this.Cargando_Tabla = false;
        });
    } else {
      this.filtro_lab = "";
      this.filtro_lote = "";
      this.filtro_nom = "";
      this.filtro_cant = "";
      this.filtro_cant_sel = "";
      this.filtro_fecha = "";
      this.filtro_cant_apar = "";
      this.filtro_bod = "";
      this.filtro_lab_gen = "";
      this.filtro_invima = "";
      this.filtro_grupo = "";
      this.filtro_iva = "";

      this.buscar_productos();
    }
  }
  Tipo(tipo, subtipo?) {
    console.log("tipo", tipo);

    if (tipo == "Bodega") {
      this.http
        .get(environment.ruta+ "php/inventario/bodega_punto.php", {
          params: { bod: "Bodega" },
        })
        .subscribe((data: any) => {
          this.categorias_nuevas = data;

          if (subtipo != "") {
            this.subtipo_punto = subtipo;
          }
        });
    } else {
      this.categorias_nuevas = [];
    }
  }
  Archivo(event) {
    if (event.target.files.length === 1) {
      this.csv = event.target.files[0];
    }
  }
  // ImportarArchivo(formulario: NgForm){

  //   let info = JSON.stringify(formulario.value);
  //   let datos = new FormData();
  //   let fun = JSON.parse(localStorage.getItem("User"));
  //   datos.append("id_func", fun.Identificacion_Funcionario);
  //   datos.append("datos", info);
  //   datos.append('Archivo', this.csv );
  //   this.cargando = true;
  //   this.http.post(environment.ruta+ 'php/inventario/invnetario_inicial/generar_inventario_inicial_csv.php', datos).subscribe(
  //     (data: any) => {
  //     if(data){
  //       this.cargando=false;
  //       formulario.reset();
  //       this.modalInventario.hide();
  //       this.confirmacionSwal.title=data.Titulo;
  //       this.confirmacionSwal.html= data.Mensaje;
  //       this.confirmacionSwal.type= data.Tipo;
  //       this.confirmacionSwal.show();
  //     }else{
  //       this.cargando=false;
  //       this.confirmacionSwal.title='Error de Conexión';
  //       this.confirmacionSwal.html= 'Error con los tiempos de respuesta del Servidor';
  //       this.confirmacionSwal.type= 'error';
  //       this.confirmacionSwal.show();
  //     }

  //   });
  // }

  actualiza_filtro(txt, col, tipo) {
    const val = txt.target.value.toLowerCase();
    const temp = this.tempFilter.filter(function (d) {
      if (tipo === "=") {
        return d[col].toLowerCase().indexOf(val) !== -1 || !val;
      } else if (tipo === "!=") {
        return d[col].toLowerCase().indexOf(val) === -1;
      }
    });
    this.rowsFilter = temp;
  }
  verApartadas(id, i) {
    this.Apartadas = [];
    this.nombre_producto = (document.getElementById(
      "NombreProducto" + i
    ) as HTMLInputElement).value;
    this.lote_producto = (document.getElementById(
      "LoteProducto" + i
    ) as HTMLInputElement).value;
    this.fecha_venc_producto = (document.getElementById(
      "Fecha_Venc" + i
    ) as HTMLInputElement).value;

    this.modalApartadas.show();
    this.Cargando_Apartadas = true;

    this.http
      .get(environment.ruta+ "php/inventario_nuevo/ver_apartadas.php", {
        params: { id_inventario_nuevo: id },
      })
      .subscribe((data: any) => {
        this.Cargando_Apartadas = false;
        this.Apartadas = data;
      });
  }
  verSeleccionadas(inventario, i) {
    this.Apartadas = [];
    this.nombre_producto = inventario.Nombre_Producto;
    this.lote_producto =  inventario.Lote;
    this.fecha_venc_producto =inventario.Fecha_Vencimiento;

    this.modalSeleccionadas.show();
     this.Cargando_Seleccionados = true;

    this.http.get(environment.ruta+ "php/inventario_nuevo/ver_seleccionados.php", {
        params: { Id_Bodega_Nuevo: inventario.Id_Bodega_Nuevo,
                  Id_Producto : inventario.Id_Producto
        },
      })
      .subscribe((data: any) => {
        this.Cargando_Seleccionados = false;
        this.Seleccionados = data;
        console.log(this.Seleccionados);

      });
  }
  verCompras(id, i) {
    this.Compras = [];
    this.nombre_producto = (document.getElementById(
      "NombreProducto" + i
    ) as HTMLInputElement).value;
    this.lote_producto = (document.getElementById(
      "LoteProducto" + i
    ) as HTMLInputElement).value;
    this.fecha_venc_producto = (document.getElementById(
      "Fecha_Venc" + i
    ) as HTMLInputElement).value;

    this.modalCompras.show();
    this.Cargando_Compras = true;

    this.http
      .get(environment.ruta+ "php/inventario/ver_compras.php", {
        params: { id_producto: id },
      })
      .subscribe((data: any) => {
        this.Cargando_Compras = false;
        this.Compras = data;
      });
  }
  DescargaExcel() {
    let params: any = {};

    // if(this.subtipo_punto!='' && this.subtipo_punto!=undefined && this.bodega_selected!='' && this.bodega_selected!=undefined ){
    this.subtipo_punto ? (params.id = this.subtipo_punto) : 0;

    params.id_bodega_nuevo = this.bodega_selected;
    // }
    params.funcionario = this.user.Identificacion_Funcionario;
    let queryString = Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");

    window.open(
      environment.ruta+
        "php/inventario_nuevo/descargar_excel.php?" +
        queryString,
      "_blank"
    );
  }
  AsignarValorSinInventario() {
    var check = $("#sin-inventario").is(":checked");
    this.filtro_sin_inventario = check;
  }
}
