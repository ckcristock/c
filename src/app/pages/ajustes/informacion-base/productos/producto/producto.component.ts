import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit {
  productover: any = {};
  public Actividades:any[]=[];
  public Mostrar=false;
  constructor(private route: ActivatedRoute, private http: HttpClient ) { }

  ngOnInit() {
    let id = this.route.snapshot.params["id"];
    this.http.get(environment.ruta + 'php/productos/producto_ver.php', {
      params: { id: id }
    }).subscribe((data: any) => {
      this.productover = data;
     // console.log(this.productover);
     
    });
    this.http.get(environment.ruta+'php/productos/actividades.php',{
      params : { id : id }
    }).subscribe((data:any)=>{
      this.Actividades=data;
      if(this.Actividades.length==0){
        this.Mostrar=true;
      }
    });

  }

}
