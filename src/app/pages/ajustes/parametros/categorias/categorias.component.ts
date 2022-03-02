import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { UserService } from 'src/app/core/services/user.service';

// import { DatatableComponent } from '@swimlane/ngx-datatable';

// import { SwalComponent } from "@toverux/ngx-sweetalert2";

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {
  @ViewChild('PlantillaBotones') PlantillaBotones: TemplateRef<any>;
  @ViewChild('FormCategoria') FormCategoria: any;
  @ViewChild('modalCategoria') modalCategoria: any;
  @ViewChild('FormCategoriaEditar') FormCategoriaEditar: any;
  @ViewChild('modalCategoriaEditar') modalCategoriaEditar: any;
  @ViewChild('deleteSwal') deleteSwal: any;

  //Variables para filtros
  public filtro_categoria: any = '';
  public filtro_departamento: any = '';
  public filtro_municipio: any = '';
  public filtro_direccion: any = '';
  public filtro_telefono: any = '';
  public categorias_filtro: any = '';
  public SubcategoriasSeleccionadas: any = [];
  public Subcategorias: any = [];

  public Departamentos: any = '';
  public company_id: any = '';
  public categoriaDepartamento: any;
  public columns = [];
  public Municipios: any = '';
  public IdCategoria: any = '';
  public Categoria: any = {};
  public categorias: any[];
  public TotalItems: number;
  public tempFilter = [];
  public rowsFilter = [];
  public page = 1;
  public maxSize = 10;

  constructor(
    private http: HttpClient,
    private location: Location,
    private _user: UserService
  ) {
    this.company_id = this._user.user.person.company_worked.id;
    this.Listarcategorias();
    this.cargarSubcategorias();
  }

  ngOnInit() {

    this.http
      .get(environment.ruta + 'php/genericos/departamentos.php', {
        params: { modulo: 'Departamento' },
      })
      .subscribe((data: any) => {
        this.Departamentos = data;
      });

    this.http
      .get(
        environment.ruta +
          'php/categoria_nueva/detalle_categoria_nueva_departamento.php'
      )
      .subscribe((data: any) => {
        this.categoriaDepartamento = data;
      });

    this.columns = [
      //#	Código	Nombre
      { prop: 'Nombre', name: 'Categoria' },
      { prop: 'NombreDepartamento', name: 'Departamento' },
      { prop: 'NombreMunicipio', name: 'Municipio' },
      { prop: 'Direccion' },
      { prop: 'Telefono' },
      {
        cellTemplate: this.PlantillaBotones,
        prop: 'Id_Categoria_Nueva',
        name: 'Acciones',
        sortable: false,
        maxWidth: '110',
      },
    ];

  }

  Municipios_Departamento(Departamento) {
    this.http
      .get(environment.ruta + 'php/genericos/municipios_departamento.php', {
        params: { id: Departamento },
      })
      .subscribe((data: any) => {
        this.Municipios = data;
      });
  }

  GuardarCategoria(formulario: NgForm, modal) {
    if (formulario.value.Municipio === '') {
      formulario.value.Municipio = '0';
    }

    let info = JSON.stringify(formulario.value);
    let subcategorias = JSON.stringify(this.SubcategoriasSeleccionadas);
    let datos = new FormData();
    datos.append('modulo', 'Categoria');
    datos.append('datos', info);
    datos.append('subcategorias', subcategorias);
    modal.hide();
    this.http
      .post(
        environment.ruta + 'php/categoria_nueva/guardar_categoria_nueva.php',
        datos
      )
      .subscribe((data: any) => {
        formulario.reset();
        this.SubcategoriasSeleccionadas = [];
        this.Listarcategorias();
      });
    this.IdCategoria = '';
    this.Categoria = [];

    this.http
      .get(
        environment.ruta +
          'php/categoria_nueva/detalle_categoria_nueva_departamento.php'
      )
      .subscribe((data: any) => {
        this.categoriaDepartamento = data;
      });
  }

  EditarCategoria(id) {
    this.http
      .get(
        environment.ruta + 'php/categoria_nueva/detalle_categoria_nueva.php',
        {
          params: { id: id },
        }
      )
      .subscribe((data: any) => {
        this.IdCategoria = id;
        this.Categoria = data.Categoria_Nueva;
        this.SubcategoriasSeleccionadas = data.Subcategorias;
        this.Municipios_Departamento(data.Departamento);
        this.modalCategoriaEditar.show();
      });
  }

  EliminarCategoria(id) {
    let datos = new FormData();
    datos.append('modulo', 'Categoria');
    datos.append('id', id);
    this.http
      .post(
        environment.ruta + 'php/categoria_nueva/eliminar_categoria_nueva.php',
        datos
      )
      .subscribe((data: any) => {
        /*this.categorias = data;
      this.rowsFilter = data;
      this.tempFilter = [...data];*/
        // this.deleteSwal.title = data.title;
        // this.deleteSwal.text = data.text;
        // this.deleteSwal.type = data.type;
        // this.deleteSwal.show();
        this.mostrarTodos();
      });
  }

  Listarcategorias() {
    this.http
      .get(environment.ruta + 'php/categoria_nueva/detalle_categoria_nueva_general.php', {params: { company_id: this._user.user.person.company_worked.id }}).subscribe((data: any) => {
        this.categorias = data.Categorias;
        this.TotalItems = data.numReg;
        this.categorias_filtro = data.Categorias;
      });
  }

  paginacion() {
    this.http
      .get(
        environment.ruta +
          '/php/categoria_nueva/detalle_categoria_nueva_general.php?pag=' +
          this.page
      )
      .subscribe((data: any) => {
        this.categorias = data.Categorias;
      });
  }

  actualiza_filtro(txt, col, tipo) {
    const val = txt.target.value.toLowerCase();
    const temp = this.tempFilter.filter(function (d) {
      if (tipo === '=') {
        return d[col].toLowerCase().indexOf(val) !== -1 || !val;
      } else if (tipo === '!=') {
        return d[col].toLowerCase().indexOf(val) === -1;
      }
    });
    this.rowsFilter = temp;
    // this.table.offset = 0;
  }

  actualiza_filtro_dinamico(txt, col, tipo) {
    const val = txt.toLowerCase();
    const temp = this.tempFilter.filter(function (d) {
      if (tipo === '=') {
        return d[col].toLowerCase().indexOf(val) !== -1 || !val;
      } else if (tipo === '!=') {
        return d[col].toLowerCase().indexOf(val) === -1;
      }
    });
    this.rowsFilter = temp;
    // this.table.offset = 0;
  }

  mostrarTodos() {
    this.Listarcategorias();
  }
  //Aplicar filtros en la tabla
  filtros() {
    let params: any = {};

    if (
      this.filtro_categoria != '' ||
      this.filtro_departamento != '' ||
      this.filtro_municipio != '' ||
      this.filtro_direccion != '' ||
      this.filtro_telefono != ''
    ) {
      this.page = 1;
      params.pag = this.page;
      params.company_id = this._user.user.person.company_worked.id;


      if (this.filtro_categoria != '') {
        params.categoria = this.filtro_categoria;
      }
      if (this.filtro_departamento != '') {
        params.departamento = this.filtro_departamento;
      }
      if (this.filtro_municipio != '') {
        params.municipio = this.filtro_municipio;
      }
      if (this.filtro_direccion != '') {
        params.direccion = this.filtro_direccion;
      }
      if (this.filtro_telefono != '') {
        params.telefono = this.filtro_telefono;
      }

      let queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');

      this.location.replaceState('/base/categorias', queryString);

      this.http
        .get(
          environment.ruta +
            'php/categoria_nueva/detalle_categoria_nueva_general.php?' +
            queryString
        )
        .subscribe((data: any) => {
          this.categorias = data.Categorias;
          this.TotalItems = data.numReg;
        });
    } else {
      this.location.replaceState('/base/categorias', '');

      this.filtro_categoria = '';
      this.filtro_departamento = '';
      this.filtro_municipio = '';
      this.filtro_direccion = '';
      this.filtro_telefono = '';

      this.http
        .get(environment.ruta + 'php/categoria_nueva/detalle_categoria_nueva_general.php', {params: { company_id: this._user.user.person.company_worked.id }}).subscribe((data: any) => {
          this.categorias = data.Categorias;
          this.TotalItems = data.numReg;
        });
    }
  }

  cargarSubcategorias() {
    this.http
      .get(environment.ruta + 'php/subcategoria/get_subcategorias.php')
      .subscribe((data: any) => {
        this.Subcategorias = data;
      });
  }
}
