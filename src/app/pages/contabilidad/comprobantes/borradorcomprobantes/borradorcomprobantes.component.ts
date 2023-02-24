import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from './../../../../core/services/user.service';

@Component({
  selector: 'app-borradorcomprobantes',
  templateUrl: './borradorcomprobantes.component.html',
  styleUrls: ['./borradorcomprobantes.component.scss']
})
export class BorradorcomprobantesComponent implements OnInit {

  @Input() Tipo_Comprobante: any = '';
  @Output() Borrador: EventEmitter<any> = new EventEmitter();
  Identificacion_Funcionario;
  borradores: any = [];

  constructor(
    private http: HttpClient,
    private _user: UserService
  ) {
    this.Identificacion_Funcionario = _user.user.person.id
  }

  ngOnInit() {
    this.listaBorradores();
  }

  listaBorradores() {
    let p: any = {
      Tipo_Comprobante: this.Tipo_Comprobante,
      Identificacion_Funcionario: this.Identificacion_Funcionario
    };

    this.http.get(environment.base_url + '/php/contabilidad/lista_borrador_contable.php', { params: p }).subscribe((data: any) => {
      this.borradores = data;
    })
  }

  sendDatosBorrador(id_borrador) {
    if (id_borrador != '') {
      this.http.get(environment.ruta + 'php/contabilidad/detalles_borrador_contable.php', { params: { id: id_borrador } }).subscribe((data: any) => {
        this.Borrador.emit(data);
      });
    } else {
      this.Borrador.emit('clean');
    }
  }
}
