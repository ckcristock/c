import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
// import { Globales } from '../shared/globales/globales';

// import { Http, ResponseContentType } from '@angular/http';
import { User } from 'src/app/core/models/users.model';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-remision',
  templateUrl: './remision.component.html',
  styleUrls: ['./remision.component.scss']
})
export class RemisionComponent implements OnInit {

  public remision: any = {};

  public userF: User;
  public productos: any[] = [];
  public env: any;
  public origen: any = [];
  public destino: any = [];
  public Actividades: any[] = [];
  public fecha = new Date();
  public id: any;
  public reducer = (accumulator, currentValue) => accumulator + parseInt(currentValue.Cantidad_Formulada);
  public reducer2 = (accumulator, currentValue) => accumulator + parseInt(currentValue.Cantidad_Entregada);
  public cant_formulada = 0;
  public cant_entregada = 0;
  public cant_diferencia = 0;
  constructor(private route: ActivatedRoute, private http: HttpClient, private _user: UserService) {
    this.env = environment
  }

  ngOnInit() {
    this.userF = this._user.user;
    this.id = this.route.snapshot.params["id"];
    this.http.get(environment.ruta + 'php/remision/remision.php', {
      params: { id: this.id }
    }).subscribe((data: any) => {
      this.remision = data.Remision;
      this.origen = data.Origen;
      this.destino = data.Destino;
    });
    this.http.get(environment.ruta + 'php/remision/productos_remision.php', {
      params: { id: this.id }
    }).subscribe((data: any) => {
      this.productos = data;
    });
    this.http.get(environment.ruta + 'php/remision/actividades_remision.php', {
      params: { id: this.id }
    }).subscribe((data: any) => {
      this.Actividades = data;
    });
  }
  action(act) {
    if (act == 'imprimir') {
      window.open(
        this.env.ruta +
        '/php/archivos/descarga_pdf.php?tipo=Remision&id=' +
        this.id,
        '_blank'
      );
    } else if (act == 'imprimirconprecio') {
      window.open(
        this.env.ruta +
        '/php/archivos/descarga_pdf_price.php?tipo=Remision&id=' +
        this.id
      );
    }
  }
}
