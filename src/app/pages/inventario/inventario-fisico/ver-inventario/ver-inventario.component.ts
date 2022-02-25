import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-ver-inventario',
  templateUrl: './ver-inventario.component.html',
  styleUrls: ['./ver-inventario.component.scss']
})
export class VerInventarioComponent implements OnInit {
  inventario:any=[];
  id_inventario ;
  grupo;
  fecha_realizado;
  Cargando=false;

  constructor(private route:ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.id_inventario = this.route.snapshot.params['idInventario'];
    this.Cargando=true;
    this.getInventarioFisicoTerminado(this.id_inventario).subscribe((res:any)=>{
      if (res.Tipo=="success") {

        this.inventario=res.Inventario;
        this.fecha_realizado=res.Inventario[0]['Fecha_Realizado'];
        this.grupo=res.Inventario[0]['Nombre_Grupo']
      }
      this.Cargando=false;
    })
  }


  getInventarioFisicoTerminado(p: string){
    return this.http.get(environment.ruta + 'php/inventariofisico/estiba/ver_inventario_terminado.php?Id_Inventario_Fisico_Nuevo=' + p);
  }

}
