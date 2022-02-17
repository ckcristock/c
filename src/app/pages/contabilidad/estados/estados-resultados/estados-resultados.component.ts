import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-estados-resultados',
  templateUrl: './estados-resultados.component.html',
  styleUrls: ['./estados-resultados.component.scss']
})
export class EstadosResultadosComponent implements OnInit {
  envirom:any;
  public datosCabecera:any = {
    Titulo: 'Estados Resultados',
    Fecha: new Date()
  }

  public EstResultadoModel:any = {
    Fecha_Inicial: '',
    Fecha_Final: '',
    Tipo: 'Pcga',
    Nivel: '4',
    Centro_Costo: ''
  };

  public Centro_Costos: Array<any>;
  public Centro_Costo:any = '';

  public Cuenta:any = {
    Inicial: '',
    Final: ''
  }

  queryParams:string = '';

  public Tipo:string = '';
  public Niveles = [1,2,3,4,5,6,7,8,9,10,11];
  Cuentas: any = [];
  Cuenta_Inicial:any = '';
  Cuenta_Final:any = '';
  Discriminado:any = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.ListarCentroCostos();
    this.envirom = environment;
  }

  ListarCentroCostos() {

    this.http.get(environment.ruta+'php/contabilidad/balanceprueba/lista_centro_costos.php').subscribe((data:any)=>{
      this.Centro_Costos = data;
    })
    
  }

  setQueryParams() {

    let params:any = {};
      
    if (this.EstResultadoModel.Fecha_Inicial != '') {
      params.Fecha_Inicial = this.EstResultadoModel.Fecha_Inicial
    }
    if (this.EstResultadoModel.Fecha_Final != '') {
      params.Fecha_Final = this.EstResultadoModel.Fecha_Final
    }
    if (this.EstResultadoModel.Centro_Costo != '') {
      params.Centro_Costo = this.EstResultadoModel.Centro_Costo
    }
    if (this.EstResultadoModel.Tipo != '') {
      params.Tipo = this.EstResultadoModel.Tipo
    }
    if (this.EstResultadoModel.Nivel != '') {
      params.Nivel = this.EstResultadoModel.Nivel
    }

    this.queryParams = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    
    
  }
}
