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
  public Mostrar=false;
  public cargando: any = {
    actividad: false
  }

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private _catalogo: CatalogoService
  ){}

  ngOnInit() {
    let id = this.route.snapshot.params["id"];
    /* this.http.get(environment.ruta + 'php/productos/producto_ver.php', */
    this.cargando.actividad = true;
    this._catalogo.getData({ id: id }).subscribe((res: any) => {
      this.productoPorVer = res.data.data;
      this.cargando.actividad = false;
    });
    /* this.http.get(environment.ruta+'php/productos/actividades.php',{ */
    this._catalogo.getActividad({ id: id }).subscribe((res:any)=>{
      this.Actividades=res.data;
      if(this.Actividades.length==0){
        this.Mostrar=true;
      }
    });

  }

}
