import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ver-compra-nacional',
  templateUrl: './ver-compra-nacional.component.html',
  styleUrls: ['./ver-compra-nacional.component.scss']
})
export class VerCompraNacionalComponent implements OnInit {

  public objeto:any = { 'Costo Incorrecto' : 'Costo Incorrecto', 'Proveedor Incorrecto' : 'Proveedor Incorrecto', 'Productos Incorrectos' : 'Productos Incorrectos'};
  public Compra:any = [];
  public Productos:any = [];
  public Rechazo:any = [];
  public Total: number = 0;
  Fecha = new Date();
  public id:any = '';
  public SubTotalFinal:any = 0;
  public IvaFinal:any = 0;
  public TotalFinal:any = 0;
  public Actividades: any[]=[];
  /* TODO USR AuTH */
  public user = {Identificacion_Funcionario:'1'} ;
  public permiso: boolean = false;
  public Lista_Rechazo:any={};
  @ViewChild('confirmacionSwal') confimracionSwal:any;

  constructor(private http: HttpClient, private router: ActivatedRoute) {
    this.id = this.router.snapshot.params["id"]; 
    this.http.get(environment.ruta + 'php/comprasnacionales/datos_compras_nacionales.php', {params: { id: this.id }}).subscribe((data: any) => {
      this.Compra = data;
    });
    this.http.get(environment.ruta + 'php/comprasnacionales/detalles_compras_nacionales.php', {params: { id: this.id }}).subscribe((data: any) => {
      this.Productos = data.Productos;
      // console.log(this.Productos);
      
      let subtotal = 0;
      let iva = 0;
      let subt_acumulada = 0;
      let total = 0;
      let iva_acumulada = 0;

      this.Productos.forEach(p => {
        this.Total += parseInt(p.Total);
        subtotal = parseFloat(p.Cantidad) * parseFloat(p.Costo);
        iva = ((parseFloat(p.Cantidad) * parseFloat(p.Costo)) * (parseFloat(p.Iva)/100)); 
        subt_acumulada += subtotal;
        iva_acumulada += iva;
        total += subtotal + iva;
      });
      this.IvaFinal = this.formatMoney(iva_acumulada);
      this.SubTotalFinal = this.formatMoney(subt_acumulada);
      this.TotalFinal = this.formatMoney(total);
    });
  }

  ngOnInit() {
    this.http.get(environment.ruta+'php/comprasnacionales/actividad_orden_compra.php',{
      params : { id : this.id }
    }).subscribe((data:any)=>{
      this.Actividades=data;
      // console.log(this.Actividades);            
    });

    this.http.get(environment.ruta+'php/comprasnacionales/detalle_perfil.php', { params: { funcionario: this.user.Identificacion_Funcionario } }).subscribe((data:any) => {
      this.permiso = data.status;
    })
    this.http.get(environment.ruta+'php/comprasnacionales/detalle_rechazo.php', { params: { funcionario: this.user.Identificacion_Funcionario } }).subscribe((data:any) => {
      for (let i = 0; i < data.length; i++) {
        this.Lista_Rechazo[data[i].Id_Tipo_Rechazo] = data[i].Nombre;
        
      }
    }); 

    

  }
  EstadoAprobacion(valor, Estado){
    let datos = new FormData();
    datos.append('id', this.id);
    datos.append('estado', Estado);
    datos.append('funcionario', this.user.Identificacion_Funcionario);
    datos.append("motivo",valor)
    
    this.http.post(environment.ruta+'php/comprasnacionales/actualiza_compra.php', datos).subscribe((data:any) => {
      this.confimracionSwal.title = data.titulo;
      this.confimracionSwal.text = data.mensaje;
      this.confimracionSwal.icon = data.tipo;
      this.confimracionSwal.fire();
      this.init();
    })
  }

  init() {
    this.http.get(environment.ruta + 'php/comprasnacionales/datos_compras_nacionales.php', {params: { id: this.id }}).subscribe((data: any) => {
      this.Compra = data;
    });
    this.http.get(environment.ruta+'php/comprasnacionales/actividad_orden_compra.php',{
      params : { id : this.id }
    }).subscribe((data:any)=>{
      this.Actividades=data;
      // console.log(this.Actividades);            
    });

    this.http.get(environment.ruta+'php/comprasnacionales/detalle_perfil.php', { params: { funcionario: this.user.Identificacion_Funcionario } }).subscribe((data:any) => {
      this.permiso = data.status;
    })
  }
  formatMoney = (n,c=undefined,d=undefined,t=undefined) => {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i:any = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;

    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  }

}
