import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-adiciones-activo-fijo',
  templateUrl: './adiciones-activo-fijo.component.html',
  styleUrls: ['./adiciones-activo-fijo.component.scss']
})
export class AdicionesActivoFijoComponent implements OnInit {

  @Input() Id:any;
  public Adiciones:any = [];
  // public funcionario:any = JSON.parse(localStorage.getItem('User')).Identificacion_Funcionario;
  public reducer_total = (accumulator, currentValue) => accumulator + parseFloat(currentValue.Costo);
  envirom:any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.listarAdicionesActivo();
    this.envirom = environment
  }

  listarAdicionesActivo() {
    this.http.get(environment.ruta + 'php/activofijo/adiciones_activo.php',{params: {id: this.Id}}).subscribe((data:any) => {
      this.Adiciones = data;
    })
  }

  getTotal() {
    return this.Adiciones.reduce(this.reducer_total, 0);
  }


}
