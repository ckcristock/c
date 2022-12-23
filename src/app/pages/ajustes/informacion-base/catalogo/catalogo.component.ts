import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { CategoriasService } from '../../parametros/categorias/categorias.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.scss'],
})
export class CatalogoComponent implements OnInit {

  public Categorias: any[] = [];
  public Subcategorias: any[] = [];
  public selectedCategory: any = {
    categoria: {
      id: null,
      nombre: null
    },
    subcategoria: {
      id: null,
      nombre: null
    }
  }
  public pagination: any = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }

  constructor(
    private _categoria: CategoriasService,
    private _user: UserService
  ) { }

  //ngbNavItem
  active = 1;
  loadingCategorias: boolean = false;
  loadingProductos: boolean = false;
  Productos: any[] = [];

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias() {
    this.loadingCategorias = true;
    this._categoria.getCategorias().subscribe((res: any) => {
      this.Categorias = res.data;
      this.loadingCategorias = false;
    });
  }

  moveToTop() {
    // window.scroll(0,0);
    window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
     });
 }
}
