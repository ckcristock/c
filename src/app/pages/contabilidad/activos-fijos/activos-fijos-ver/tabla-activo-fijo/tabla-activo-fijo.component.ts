import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tabla-activo-fijo',
  templateUrl: './tabla-activo-fijo.component.html',
  styleUrls: ['./tabla-activo-fijo.component.scss']
})
export class TablaActivoFijoComponent implements OnInit {

  @ViewChild('alertSwal') alertSwal:any;
  public Activo_Fijo:any={}
  constructor(private http: HttpClient ) { }
  @Input() Id;
  ngOnInit() {
    this.DetalleActivoFijo();
  }

  DetalleActivoFijo(){
    let p = {id_activo:this.Id};
    this.http.get(environment.ruta+'php/activofijo/get_detalle_activo_fijo.php', {params:p})
    .subscribe((data:any) => {
      if (data.codigo = 'success') {
        this.Activo_Fijo=data;
      }else{
        
        this.ShowSwal(data.codigo, data.titulo, data.mensaje);
      }
    });
  }
  ShowSwal(tipo:string, titulo:string, msg:string){
    this.alertSwal.type = tipo;
    this.alertSwal.title = titulo;
    this.alertSwal.text = msg;
    this.alertSwal.show();
  }

}
