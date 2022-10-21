import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Input,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { functionsUtils } from '../../../../core/utils/functionsUtils';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';
import { FormArray, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { productoForm } from './helpers/producto';
import { CategoryService } from '../services/category.service';
import Swal from 'sweetalert2';
//import { User } from 'src/app/core/models/users.model';
import { User } from 'src/app/core/models/users.model';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent implements OnInit {
  @Input('user') user: User;
  @Input('type') type;

  form: FormGroup;

  public productos: any[];
  public IdProductos: any = '';

  public Material = 'Material';
  public Medicamento = 'Medicamento';
  public Generico = 'Generico';
  public Codigo_Barras: any = '';

  rowsFilter = [];
  tempFilter = [];
  columns = [];
  isLoading: boolean;
  timeout: any;
  public fieldDinamicMaterial: any[];

  /* TODO ACTUALIZAR FUNCIONARIO */
  public funcionario: any = 1;

  @ViewChild('PlantillaFoto') PlantillaFoto: TemplateRef<any>;
  @ViewChild('FormProducto') FormProducto: any;

  @ViewChild('modalMaterial') modalMaterial: any;
  @ViewChild('modalMedicamento') modalMedicamento: any;
  @ViewChild('modalMedicamentoEditar') modalMedicamentoEditar: any;
  @ViewChild('modalMaterialEditar') modalMaterialEditar: any;

  @ViewChild('FormMaterialEditar') FormMaterialEditar: any;
  @ViewChild('FormMaterial') FormMaterial: any;
  @ViewChild('FormMedicamento') FormMedicamento: any;
  @ViewChild('FormMedicamentoEditar') FormMedicamentoEditar: any;

  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('modalGenerico') modalGenerico: any;

  Si: boolean;
  Subcategorias: any[];

  Productos: any = [];

  public Datos: any = {
    Codigo_Cum: '',
    PrincipioActivo: '',
    Presentacion: '',
    Concentracion: '',
    NombreComercial: '',
    Embalaje: '',
    LaboratorioGenerico: '',
    LaboratorioComercial: '',
    Familia: '',
    CantidadMinima: '',
    CantidadMaxima: '',
    ATC: '',
    DescripcionATC: '',
    Invima: '',
    FechaExpedicionInvima: '',
    FechaVencimientoInvima: '',
    PrecioMinimo: '',
    PrecioMaximo: '',
    TipoRegulacion: '',
    TipoPos: '',
    ViaAdministracion: '',
    UnidadMedida: '',
    Cantidad: '',
    Regulado: '',
    Tipo: '',
    PesoPresentacionMinima: '',
    PesoPresentacionRegular: '',
    PesoPresentacionMaxima: '',
    CodigoBarras: '',
    CantidadPresentacion: '',
    Mantis: '',
    Imagen: '',
    IdSubcategoria: '',
    NombreListado: '',
    Referencia: '',
    Gravado: '',
    RotativoC: '',
    RotativoD: '',
    Subcategoria: '',
  };

  public maxSize = 10;
  public TotalItems: number;
  public page = 1;
  public filtro_nombre: any = '';
  public filtro_cum: any = '';
  public tipo: any = '';
  public company: any = '';
  public filtro_lab: any = '';
  public fieldDinamicSubcategory: any[] = [];

  public Fotos: any;
  public company_id: any;

  public filtro_nom_com: any = '';
  public filtro_lab_gral: any = '';
  public filtro_inv: any = '';
  public filtro_tipo: any = '';
  public Lista: any = [];
  public Categorias: any[] = [];
  public fields: any[] = [];
  public field: any;
  public Producto: any = {};
  public title: string = 'Nuevo Producto';

  public SubCategorias: any[] = [];

  constructor(
    private _category: CategoryService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.isLoading = true;
    this.http
      .get(environment.ruta + 'php/lista_generales.php', {
        params: { modulo: 'Subcategoria' },
      })
      .subscribe((data: any) => {
        this.Subcategorias = data;
      });
    this.http
      .get(environment.ruta + 'php/lista_generales.php', {
        params: { modulo: 'Lista_Ganancia' },
      })
      .subscribe((data: any) => {
        this.Lista = data;
      });

    // this.ListarProductos();
  }

  ngOnInit() {
  //  this.company_id = this.user.person.company_worked.id;
    this.tipo = this.type;
    this.filtro();

    this.columns = [
      {
        cellTemplate: this.PlantillaFoto,
        prop: 'Foto',
        name: 'Foto',
        maxWidth: '70',
      },
      { prop: 'Cum', name: 'Cum', maxWidth: '100' },
      { prop: 'Nombre', name: 'Nombre' },
      { prop: 'Nombre_Comercial', name: 'Comercial', maxWidth: '250' },
      { prop: 'Generico', name: 'Laboratorio Generico', maxWidth: '250' },
      { prop: 'Comercial', name: 'Laboratorio Comercial', maxWidth: '250' },
      { prop: 'Invima', name: 'Invima' },
      { prop: 'Tipo', name: 'Tipo' },
      {
        cellTemplate: this.PlantillaBotones,
        prop: 'Id_Producto',
        name: '<i class="mdi mdi-chevron-down"></i>',
        sortable: false,
        maxWidth: '100',
      },
    ];
    this.getCategory();
    this.createForm();
  }

  filtro() {
    let params: any = {};

    if (
      this.tipo != '' ||
      this.filtro_nombre != '' ||
      this.filtro_cum != '' ||
      this.filtro_lab != '' ||
      this.filtro_nom_com != '' ||
      this.filtro_lab_gral != '' ||
      this.filtro_inv != '' ||
      this.filtro_tipo != ''
    ) {
      // Si algunos de los campos para filtrar no está vacío, se ejecuta el proceso de filtraje.
      this.page = 1; // Volver a la página 1 al filtrar
      params.pag = this.page;
     // params.company_id = this.user.person.company_worked.id;

      if (this.tipo != '') {
        params.tip = this.tipo;
      }
      if (this.filtro_nombre != '') {
        params.nom = this.filtro_nombre;
      }
      if (this.filtro_cum != '') {
        params.cum = this.filtro_cum;
      }
      if (this.filtro_lab != '') {
        params.lab = this.filtro_lab;
      }
      if (this.filtro_nom_com != '') {
        params.nom_com = this.filtro_nom_com;
      }
      if (this.filtro_lab_gral != '') {
        params.lab_gral = this.filtro_lab_gral;
      }
      if (this.filtro_inv != '') {
        params.inv = this.filtro_inv;
      }
      if (this.filtro_tipo != '') {
        params.tipo = this.filtro_tipo;
      }

      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.location.replaceState('/base/catalogo', queryString);

      this.http
        .get(
          environment.ruta + '/php/productos/lista_productos.php?' + queryString
        )
        .subscribe((data: any) => {
          this.Productos = JSON.parse(
            functionsUtils.utf8_decode(JSON.stringify(data.productos))
          );
          this.TotalItems = data.numReg;
        });
    } else {
      // Resetear filtros cuando todo está vacío
      this.location.replaceState('/base/catalogo', '');

      this.page = 1;
      this.filtro_cum = '';
      this.filtro_inv = '';
      this.filtro_lab = '';
      this.filtro_lab_gral = '';
      this.filtro_nom_com = '';
      this.filtro_nombre = '';
      this.filtro_tipo = '';
      this.tipo = '';

      this.http
        .get(environment.ruta + '/php/productos/lista_productos.php')
        .subscribe((data: any) => {
          this.Productos = data.productos;
          this.TotalItems = data.numReg;
        });
    }
  }

  createForm() {
    this.form = this.fb.group({
      Id_Producto: [''],
      Id_Categoria: [''],
      Id_Subcategoria: [''],
      Principio_Activo: [''],
      Descripcion_ATC: [''],
      Codigo_Barras: [''],
      Invima: [''],
      Tipo: ['Generico'],
      dynamic: this.fb.array([]),
    });
  }

  editGeneric(producto) {
    this.modalGenerico.show();
    this.Producto = { ...producto };
    this.title = 'Editar Producto';
    this.form.patchValue({
      Id_Producto: this.Producto.Id_Producto,
      Descripcion_ATC: this.Producto.Descripcion_ATC,
      Codigo_Barras: this.Producto.Codigo_Barras,
      Invima: this.Producto.Invima,
      Id_Categoria: Number(this.Producto.Id_Categoria),
      Id_Subcategoria: Number(this.Producto.Id_Subcategoria),
      Principio_Activo: this.Producto.Principio_Activo,
    });
    this.getSubCategories(this.Producto.Id_Subcategoria);
    this.getSubCategoryEdit(
      this.Producto.Id_Producto,
      this.Producto.Id_Subcategoria
    );
    this.fieldDinamic.clear();
    // this.Producto.Variables.forEach(e => {
    // let group = this.fb.group({
    //   subcategory_variables_id: e.subcategory_variables_id,
    //   id:e.id,
    //   label: e.label,
    //   type: e.type,
    //   valor: e.valor
    // })
    //   this.fieldDinamic.push(group)
    // });
  }

  getSubCategoryEdit(Id_Producto, Id_Subcategoria) {
    this._category
      .getSubCategoryEdit(Id_Producto, Id_Subcategoria)
      .subscribe((r: any) => {
        this.fieldDinamic.clear();
        r.data.forEach((e) => {
          let group = this.fb.group({
            subcategory_variables_id: e.subcategory_variables_id,
            id: e.id,
            label: e.label,
            type: e.type,
            valor: e.valor,
          });
          this.fieldDinamic.push(group);
        });
      });
  }

  getDinamicField(Id_Subcategoria) {
    this.getSubCategoryEdit(this.Producto.Id_Producto, Id_Subcategoria);
  }

  get fieldDinamic() {
    return this.form.get('dynamic') as FormArray;
  }

  getCategory() {
    this._category.getCategories().subscribe((r: any) => {
      this.Categorias = r.data;
      this.Categorias.unshift({ text: 'Seleccione ', value: '' });
    });
  }

  getSubCategories(Id_Categoria_Nueva) {
    this._category.getSubCategories(Id_Categoria_Nueva).subscribe((r: any) => {
      this.SubCategorias = r.data;
    });
  }

  saveGeneric() {
    if (this.form.get('Id_Producto').value) {
      this._category
        .updateProduct(this.form.value, this.Producto.Id_Producto)
        .subscribe((r: any) => {
          // this.dataClear();
          Swal.fire({
            icon: 'success',
            title: 'Producto editado con éxito',
            text: '',
          });
        });
    } else {
      this._category.save(this.form.value).subscribe((r: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Producto creado con éxito',
          text: '',
        });
      });
    }

    // this.form.reset();
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

  ListarProductos() {
    let params = this.route.snapshot.queryParams;

    let queryString = '';

    if (Object.keys(params).length > 0) {
      // Si existe parametros o filtros
      // actualizando la variables con los valores de los paremetros.
      this.page = params.pag ? params.pag : 1;
      this.filtro_cum = params.cum ? params.cum : '';
      this.tipo = params.tip ? params.tip : '';
      this.filtro_nombre = params.nom ? params.nom : '';
      this.filtro_nom_com = params.nom_com ? params.nom_com : '';
      this.filtro_lab = params.lab ? params.lab : '';
      this.filtro_lab_gral = params.lab_com ? params.lab_com : '';
      this.filtro_inv = params.inv ? params.inv : '';
      this.filtro_tipo = params.tipo ? params.tipo : '';

      queryString =
        '?' +
        Object.keys(params)
          .map((key) => key + '=' + params[key])
          .join('&');
    }

    this.http
      .get(environment.ruta + 'php/productos/lista_productos.php' + queryString)
      .subscribe((data: any) => {
        this.Productos = JSON.parse(
          functionsUtils.utf8_decode(JSON.stringify(data.productos))
        );

        this.TotalItems = data.numReg;
      });

    this.filtro();
  }

  paginacion() {
    let params: any = {
      pag: this.page,
    };

    if (this.filtro_nombre != '') {
      params.nom = this.filtro_nombre;
    }
    if (this.filtro_cum != '') {
      params.cum = this.filtro_cum;
    }
    if (this.filtro_lab != '') {
      params.lab = this.filtro_lab;
    }
    if (this.filtro_nom_com != '') {
      params.nom_com = this.filtro_nom_com;
    }
    if (this.filtro_lab_gral != '') {
      params.lab_gral = this.filtro_lab_gral;
    }
    if (this.filtro_inv != '') {
      params.inv = this.filtro_inv;
    }
    if (this.filtro_tipo != '') {
      params.tipo = this.filtro_tipo;
    }

    let queryString = Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&');

    this.location.replaceState('/base/catalogo', queryString);

    this.http
      .get(
        environment.ruta + '/php/productos/lista_productos.php?' + queryString
      )
      .subscribe((data: any) => {
        this.Productos = JSON.parse(
          functionsUtils.utf8_decode(JSON.stringify(data.productos))
        );
        this.TotalItems = data.numReg;
      });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempFilter.filter(function (d) {
      return d.Cum.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rowsFilter = temp;
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {}, 100);
  }

  GuardarProducto(formulario: NgForm, modal) {
    let info = JSON.stringify(formulario.value);
    let lista = this.normalize(JSON.stringify(this.Lista));
    let datos = new FormData();
    datos.append('modulo', 'Producto');
    datos.append('Foto', this.Fotos);
    datos.append('lista', lista);
    datos.append('field', JSON.stringify(this.fieldDinamicMaterial));
    datos.append('fieldSave', JSON.stringify(this.fieldDinamicSubcategory));
    datos.append('funcionario', this.funcionario);
    datos.append('datos', functionsUtils.utf8_encode(info));
    this.http
      .post(environment.ruta + 'php/productos/producto_guardar_dev.php', datos)
      .subscribe((data: any) => {
        this.confirmacionSwal.title = data.titulo;
        this.confirmacionSwal.text = data.mensaje;
        this.confirmacionSwal.icon = data.tipo;
        this.confirmacionSwal.fire();
        this.Fotos = [];
        formulario.reset();
        modal.hide();
        this.ResetValues();
        this.ListarProductos();

        this.http
          .get(environment.ruta + 'php/lista_generales.php', {
            params: { modulo: 'Lista_Ganancia' },
          })
          .subscribe((data: any) => {
            this.Lista = data;
          });
      });
  }

  LimpiarCampos(formulario: NgForm) {
    formulario.reset();
  }

  getListaProducto(id) {
    this.http
      .get(environment.ruta + 'php/productos/lista.php', { params: { id: id } })
      .subscribe((data: any) => {
        this.Lista = data;
      });
  }

  EditarProducto(id) {
    this.http
      .get(environment.ruta + 'php/productos/producto_detalle.php', {
        params: { id: id },
      })
      .subscribe((data: any) => {
        // this.http.get(environment.ruta + 'php/productos/lista_productos.php', {params: { id: id }}).subscribe((data: any) => {

        this.getListaProducto(id); // Lista Ganancia
        this.IdProductos = id;
        this.Datos['Codigo_Cum'] = functionsUtils.utf8_decode(
          data.productos[0].Codigo_Cum
        );
        this.Datos['Id_Producto'] = functionsUtils.utf8_decode(
          data.productos[0].Id_Producto
        );
        this.Datos['PrincipioActivo'] = functionsUtils.utf8_decode(
          data.productos[0].Principio_Activo
        );
        this.Datos['Presentacion'] = functionsUtils.utf8_decode(
          data.productos[0].Presentacion
        );
        this.Datos['Concentracion'] = functionsUtils.utf8_decode(
          data.productos[0].Concentracion
        );
        this.Datos['NombreComercial'] = functionsUtils.utf8_decode(
          data.productos[0].Nombre_Comercial
        );
        this.Datos['Embalaje'] = functionsUtils.utf8_decode(
          data.productos[0].Embalaje
        );
        this.Datos['LaboratorioGenerico'] = functionsUtils.utf8_decode(
          data.productos[0].Laboratorio_Generico
        );
        this.Datos['LaboratorioComercial'] = functionsUtils.utf8_decode(
          data.productos[0].Laboratorio_Comercial
        );
        this.Datos['Familia'] = functionsUtils.utf8_decode(
          data.productos[0].Familia
        );
        this.Datos['CantidadMinima'] = functionsUtils.utf8_decode(
          data.productos[0].Cantidad_Minima
        );
        this.Datos['CantidadMaxima'] = functionsUtils.utf8_decode(
          data.productos[0].Cantidad_Maxima
        );
        this.Datos['ATC'] = functionsUtils.utf8_decode(data.productos[0].ATC);
        this.Datos['DescripcionATC'] = functionsUtils.utf8_decode(
          data.productos[0].Descripcion_ATC
        );
        this.Datos['Invima'] = functionsUtils.utf8_decode(
          data.productos[0].Invima
        );
        this.Datos['FechaExpedicionInvima'] = functionsUtils.utf8_decode(
          data.productos[0].Fecha_Expedicion_Invima
        );
        this.Datos['FechaVencimientoInvima'] = functionsUtils.utf8_decode(
          data.productos[0].Fecha_Vencimiento_Invima
        );
        this.Datos['PrecioMinimo'] = functionsUtils.utf8_decode(
          data.productos[0].Precio_Minimo
        );
        this.Datos['PrecioMaximo'] = functionsUtils.utf8_decode(
          data.productos[0].Precio_Maximo
        );
        this.Datos['TipoRegulacion'] = functionsUtils.utf8_decode(
          data.productos[0].Tipo_Regulacion
        );
        this.Datos['TipoPos'] = functionsUtils.utf8_decode(
          data.productos[0].Tipo_Pos
        );
        this.Datos['ViaAdministracion'] = functionsUtils.utf8_decode(
          data.productos[0].Via_Administracion
        );
        this.Datos['UnidadMedida'] = functionsUtils.utf8_decode(
          data.productos[0].Unidad_Medida
        );
        this.Datos['Cantidad'] = functionsUtils.utf8_decode(
          data.productos[0].Cantidad
        );
        this.Datos['Regulado'] = functionsUtils.utf8_decode(
          data.productos[0].Regulado
        );
        this.Datos['Tipo'] = functionsUtils.utf8_decode(data.productos[0].Tipo);
        this.Datos['PesoPresentacionMinima'] = functionsUtils.utf8_decode(
          data.productos[0].Peso_Presentacion_Minima
        );
        this.Datos['PesoPresentacionRegular'] = functionsUtils.utf8_decode(
          data.productos[0].Peso_Presentacion_Regular
        );
        this.Datos['PesoPresentacionMaxima'] = functionsUtils.utf8_decode(
          data.productos[0].Peso_Presentacion_Maxima
        );
        this.Datos['CodigoBarras'] = functionsUtils.utf8_decode(
          data.productos[0].Codigo_Barras
        );
        this.Datos['CantidadPresentacion'] = functionsUtils.utf8_decode(
          data.productos[0].Cantidad_Presentacion
        );
        this.Datos['Mantis'] = functionsUtils.utf8_decode(
          data.productos[0].Mantis
        );
        this.Datos['Imagen'] = functionsUtils.utf8_decode(
          data.productos[0].Imagen
        );
        this.Datos['IdSubcategoria'] = functionsUtils.utf8_decode(
          data.productos[0].Id_Subcategoria
        );
        this.Datos['NombreListado'] = functionsUtils.utf8_decode(
          data.productos[0].Nombre_Listado
        );
        this.Datos['Referencia'] = functionsUtils.utf8_decode(
          data.productos[0].Referencia
        );
        this.Datos['Familia'] = functionsUtils.utf8_decode(
          data.productos[0].Familia
        );
        this.Datos['Gravado'] = functionsUtils.utf8_decode(
          data.productos[0].Gravado
        );
        this.Datos['RotativoC'] = functionsUtils.utf8_decode(
          data.productos[0].RotativoC
        );
        this.Datos['RotativoD'] = functionsUtils.utf8_decode(
          data.productos[0].RotativoD
        );
        this.Datos['Subcategoria'] = functionsUtils.utf8_decode(
          data.productos[0].Subcategoria
        );
        this.Datos['Unidad_Empaque'] = functionsUtils.utf8_decode(
          data.productos[0].Unidad_Empaque
        );
        this.Datos['Porcentaje_Arancel'] = functionsUtils.utf8_decode(
          data.productos[0].Porcentaje_Arancel
        );
        this.fieldDinamicMaterial = data.productos[0].Variables;

        this.Codigo_Barras = functionsUtils.utf8_decode(
          data.productos[0].Codigo_Barras
        );
        this.modalMaterialEditar.show();
      });
  }

  getDinamicVariables(value, Datos) {
    this._category
      .getSubCategoryEdit(Datos.Id_Producto, value)
      .subscribe((r: any) => {
        this.fieldDinamicMaterial = [];
        this.fieldDinamicMaterial = r.data;
      });
  }

  editVariablesDinamic(value, item, i) {
    const t = this.fieldDinamicMaterial.find((el) => el.id === item.id);

    if (t.id) {
      this.fieldDinamicMaterial[i].valor = value;
    } else {
      let obj = {
        id: item.id,
        subcategory_variables_id: item.subcategory_variables_id,
        valor: value,
      };
      this.fieldDinamicMaterial[i] = obj;
    }
  }

  getVariablesDinamic(value) {
    this.http
      .get(environment.ruta + 'php/parametros/lista_subcategoria.php', {
        params: { id: value },
      })
      .subscribe((data: any) => {
        this.fieldDinamicMaterial = [];
        this.fieldDinamicMaterial = data.Subcategoria[0].Variables;
      });
  }

  BuscarProducto(cum: any): void {
    cum = cum.split('-');

    if (cum[1]) {
      this.http
        .get(
          'https://www.datos.gov.co/resource/wqeu-3uhz.json?expediente=' +
            cum[0] +
            '&consecutivocum=' +
            cum[1],
          {}
        )
        .subscribe((data: any) => {
          if (data.length == 0) {
            this.Si = false;
            this.confirmacionSwal.title = 'Error En Codigo';
            this.confirmacionSwal.text =
              'El codigo cum ingresado no se encuentra en la base de datos de DatosAbiertos.org';
            this.confirmacionSwal.icon = 'error';
            this.confirmacionSwal.fire();
            this.Datos['Codigo_Cum'] = '';
            this.Datos['PrincipioActivo '] = '';
            this.Datos['Presentacion '] = '';
            this.Datos['Concentracion '] = '';
            this.Datos['NombreComercial '] = '';
            this.Datos['Embalaje '] = '';
            this.Datos['LaboratorioGenerico '] = '';
            this.Datos['LaboratorioComercial '] = '';
            this.Datos['Familia '] = '';
            this.Datos['CantidadMinima '] = '';
            this.Datos['CantidadMaxima '] = '';
            this.Datos['ATC '] = '';
            this.Datos['DescripcionATC '] = '';
            this.Datos['Invima '] = '';
            this.Datos['FechaExpedicionInvima'] = '';
            this.Datos['FechaVencimientoInvima'] = '';
            this.Datos['PrecioMinimo'] = '';
            this.Datos['PrecioMaximo'] = '';
            this.Datos['TipoRegulacion'] = '';
            this.Datos['TipoPos'] = '';
            this.Datos['ViaAdministracion'] = '';
            this.Datos['UnidadMedida'] = '';
            this.Datos['Cantidad'] = '';
            this.Datos['Regulado'] = '';
            this.Datos['Tipo'] = '';
            this.Datos['PesoPresentacionMinima'] = '';
            this.Datos['PesoPresentacionRegular'] = '';
            this.Datos['PesoPresentacionMaxima'] = '';
            this.Datos['CodigoBarras'] = '';
            this.Datos['CantidadPresentacion'] = '';
            this.Datos['Mantis'] = '';
            this.Datos['Imagen'] = '';
            this.Datos['IdSubcategoria'] = '';
            this.Datos['NombreListado'] = '';
            this.Datos['Referencia'] = '';
            this.Datos['Familia'] = '';
            this.Datos['Gravado'] = '';
            this.Datos['Subcategoria'] = '';
            this.Datos['Unidad_Empaque'] = '';
            this.Datos['Porcentaje_Arancel'] = '';
            //this.FormProductos[0].reset();
            //alert("El codigo cum ingresado no se encuentra en la base de datos de DatosAbiertos.org");
          } else {
            this.Si = true;
            this.Datos['PrincipioActivo'] = data[0].principioactivo;
            this.Datos['Presentacion'] = data[0].unidadreferencia;
            this.Datos['Concentracion'] = data[0].concentracion;
            this.Datos['NombreComercial'] = data[0].producto;
            this.Datos['Embalaje'] = data[0].descripcioncomercial;
            this.Datos['LaboratorioGenerico'] = data[0].titular;
            this.Datos['LaboratorioComercial'] = data[0].nombrerol;
            this.Datos['ATC'] = data[0].atc;
            this.Datos['DescripcionATC'] = data[0].descripcionatc;
            this.Datos['Invima'] = data[0].registrosanitario;
            this.Datos['ViaAdministracion'] = data[0].viaadministracion;
            this.Datos['UnidadMedida'] = data[0].unidadmedida;
            this.Datos['Cantidad'] = data[0].cantidad;
          }
        });
    } else {
      this.Si = false;
      this.confirmacionSwal.title = 'Error En Codigo';
      this.confirmacionSwal.text =
        'cum invalido, debe tener el numero del expediente y el consecutivo';
      this.confirmacionSwal.icon = 'error';
      this.confirmacionSwal.fire();
      this.FormProducto.reset();
      //alert("cum invalido, debe tener el numero del expediente y el consecutivo");
    }
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
            this.confirmacionSwal.text =
              'El codigo cum ingresado no se encuentra en la base de datos de DatosAbiertos.org';
            this.confirmacionSwal.icon = 'error';
            this.confirmacionSwal.fire();
            this.Datos['Presentacion'] = '';
            this.Datos['Concentracion'] = '';
            this.Datos['PrincipioActivo'] = '';
            this.Datos['Embalaje'] = '';
            this.Datos['NombreComercial'] = '';
            this.Datos['LaboratorioGenerico'] = '';
            this.Datos['LaboratorioComercial'] = '';
            this.Datos['Invima'] = '';
            this.Datos['Cantidad'] = '';
            this.Datos['UnidadMedida'] = '';
            this.Datos['ViaAdministracion'] = '';
            //this.FormProducto.reset();
            //alert("El codigo cum ingresado no se encuentra en la base de datos de DatosAbiertos.org");
          } else {
            this.Si = true;
            this.Datos['PrincipioActivo'] = data[0].principioactivo;
            this.Datos['Presentacion'] = data[0].unidadreferencia;
            this.Datos['Concentracion'] = data[0].concentracion;
            this.Datos['NombreComercial'] = data[0].producto;
            this.Datos['Embalaje'] = data[0].descripcioncomercial;
            this.Datos['LaboratorioGenerico'] = data[0].titular;
            this.Datos['LaboratorioComercial'] = data[0].nombrerol;
            this.Datos['Invima'] = data[0].registrosanitario;
            this.Datos['ViaAdministracion'] = data[0].viaadministracion;
            this.Datos['UnidadMedida'] = data[0].unidadmedida;
            this.Datos['Cantidad'] = data[0].cantidad;
          }
        });
    } else {
      this.Si = false;
      this.confirmacionSwal.title = 'Error En Codigo';
      this.confirmacionSwal.text =
        'cum invalido, debe tener el numero del expediente y el consecutivo';
      this.confirmacionSwal.icon = 'error';
      this.confirmacionSwal.fire();
      this.FormProducto.reset();
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

  CargaFotoEditar(event) {
    let fot = document.getElementById('foto_visualE') as HTMLImageElement;

    if (event.target.files.length === 1) {
      this.Fotos = event.target.files[0];

      let url = URL.createObjectURL(event.target.files[0]);
      fot.src = url;
    }
  }

  ResetValues() {
    this.Datos = {
      Codigo_Cum: '',
      PrincipioActivo: '',
      Presentacion: '',
      Concentracion: '',
      NombreComercial: '',
      Embalaje: '',
      LaboratorioGenerico: '',
      LaboratorioComercial: '',
      Familia: '',
      CantidadMinima: '',
      CantidadMaxima: '',
      ATC: '',
      DescripcionATC: '',
      Invima: '',
      FechaExpedicionInvima: '',
      FechaVencimientoInvima: '',
      PrecioMinimo: '',
      PrecioMaximo: '',
      TipoRegulacion: '',
      TipoPos: '',
      ViaAdministracion: '',
      UnidadMedida: '',
      Cantidad: '',
      Regulado: '',
      Tipo: '',
      PesoPresentacionMinima: '',
      PesoPresentacionRegular: '',
      PesoPresentacionMaxima: '',
      CodigoBarras: '',
      CantidadPresentacion: '',
      Mantis: '',
      Imagen: '',
      IdSubcategoria: '',
      NombreListado: '',
      Referencia: '',
      Gravado: '',
      Subcategoria: '',
      Unidad_Empaque: '',
      Porcentaje_Arancel: '',
    };

    this.IdProductos = '';
  }

  ValidarCodigo() {
    this.http
      .get(environment.ruta + 'php/productos/validar_codigo.php', {
        params: { codigo: this.Codigo_Barras },
      })
      .subscribe((data: any) => {
        if (data?.Id_Producto) {
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

  CambiarEstadoProducto(Estado: string, Id) {
    let p = {
      Estado: Estado,
      Id_Producto: Id,
      Funcionario: this.funcionario,
    };
    let datos = new FormData();
    datos.append('modelo', JSON.stringify(p));
    this.http
      .post(environment.ruta + 'php/productos/cambiar_estado.php', datos)
      .subscribe((data: any) => {
        this.confirmacionSwal.title = data.titulo;
        this.confirmacionSwal.text = data.mensaje;
        this.confirmacionSwal.icon = data.tipo;
        this.confirmacionSwal.fire();
        this.ListarProductos();
      });
  }

  DescargarReporte() {
    window.open(
      environment.ruta + '/php/productos/descargar_reporte.php',
      '_blank'
    );
  }

  closeModal() {
    this.title = '';
    this.modalGenerico.hide();
  }

  saveVariablesDinamic(value, item, i) {
    let obj = {
      subcategory_variables_id: item.id,
      valor: value,
    };

    this.fieldDinamicSubcategory[i] = obj;
  }
}
