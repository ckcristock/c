import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Globales } from '../../../globales';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notascreditover',
  templateUrl: './notascreditover.component.html',
  styleUrls: ['./notascreditover.component.scss']
})
export class NotascreditoverComponent implements OnInit {
  enviromen:any;
  public idNotaCredito = this.route.snapshot.params["id"];
  public Datos: any={
    Factura:'',
    Cliente:'',

  };
  public Lista_Productos:any[]=[];
  public Total :any;
  public TotalImpuesto :any;
  public user: any;

  public perfilUsuario = localStorage.getItem('miPerfil');
  @ViewChild('confirmacionSwal') confirmacionSwal:any;

  public reducer = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Valor_Nota_Credito); 
  public reducerImpuesto = (accumulador,currentValue) => accumulador + parseFloat(currentValue.Total_Impuesto);

  constructor(private route: ActivatedRoute,private http : HttpClient,public globales: Globales,private router:Router) { 
    this.http.get(environment.ruta+'php/notas_credito_nuevo/get_nota_credito.php',{ params: { id_nota_credito: this.idNotaCredito}}).subscribe((data:any)=>{
      this.Datos=data.Nota_Credito;
      this.Lista_Productos = data.Productos_Nota;

      this.Total = this.Lista_Productos.reduce(this.reducer,0);
      this.TotalImpuesto = this.Lista_Productos.reduce(this.reducerImpuesto,0);
    });
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.User);
    this.enviromen = environment;
  }

}
