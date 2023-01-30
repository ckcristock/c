import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CatalogoService } from '../../catalogo/catalogo.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  public productoPorVer: any = {};
  public Actividades:any[]=[];
  public VariablesProducto:any={
    categoria: {nom:[], valor:[]},
    subcategoria: {nom:[], valor:[]}
  };
  public cargando: any = {
    actividad: false,
    producto: false,
    varsProducto: false,
    valor: () => {
      return this.cargando.actividad && this.cargando.producto && this.cargando.varsProducto;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private _catalogo: CatalogoService
  ){}

  ngOnInit() {
    let id = this.route.snapshot.params["id"];
    /* this.http.get(environment.ruta + 'php/productos/producto_ver.php', */
    this.cargando.producto = true;
    this._catalogo.getData({ id: id }).subscribe((res: any) => {
      this.productoPorVer = res.data;
      this.cargando.producto = false;
    });
    /* this.http.get(environment.ruta+'php/productos/actividades.php',{ */
    this.cargando.actividad = true;
    this._catalogo.getActividad({ id: id }).subscribe((res:any)=>{
      this.Actividades=res.data;
      this.cargando.actividad = false;
    });
    this.cargando.varsProducto = true;
    this._catalogo.getCampos({ producto: id }).subscribe((res:any)=>{
      res.data.cat.forEach(catVar => {
        this.VariablesProducto.categoria.nom.push(catVar.label);
        this.VariablesProducto.categoria.valor.push((catVar.valor)?catVar.valor:"<Por definir>");
      });
      res.data.subcat.forEach(subcatVar => {
        this.VariablesProducto.subcategoria.nom.push(subcatVar.label);
        this.VariablesProducto.subcategoria.valor.push((subcatVar.valor)?subcatVar.valor:"<Por definir>");
      });
      this.cargando.varsProducto = false;
    });

  }

}
