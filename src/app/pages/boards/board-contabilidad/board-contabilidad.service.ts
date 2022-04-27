import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isArray } from 'util';

@Injectable()
export class BoardContabilidadService {
  globales = {ruta: 'http://inventario.sigmaqmo.com/'}
  private _rutaBase:string = this.globales.ruta+'php/terceros/';
  private _rutaConsultaEps:string = this.globales.ruta+'php/GENERALES/eps/';
  public _subject = new Subject<string>();
  public event = this._subject.asObservable();
  private SwalObj:any = {
    type:'warning',
    title:'Alerta',
    msg:'',
    html:''
  };
  constructor(private client:HttpClient,) { }
  
  FiltrarTerceros(match:string):Observable<any>{
    let p = {coincidencia:match};
    return this.client.get(this._rutaBase+'filtrar_terceros.php', {params:p});
  }

  GetEpss():Observable<any>{
    return this.client.get(this._rutaConsultaEps+'lista_eps_radicaciones.php');
  }
  getResolucionesPorVencer() {
    return this.client.get(this.globales.ruta+'php/tablerocontabilidad/resoluciones_por_vencer.php');
  }

  public cambiarEstadoTercero(tipo:string,id:any) {
    let p:any = {
      tipo:tipo,
      id:id
    }
    return this.client.get(this.globales.ruta+'php/terceros/cambiar_estado.php',{params: p});
  }
  public ShowMessage(data:any) {
    this.SetSwalData(data);
    this._subject.next(this.SwalObj);
  }

  private SetSwalData(data:any){
    if (typeof(data) == 'object') {
      if (isArray(data)) {
        let i = 0;
        for (const key in this.SwalObj) {
          this.SwalObj[key] = data[i];
          i++;
        }
      }else{
        this.SwalObj.type = data.codigo;
        this.SwalObj.title = data.titulo;
        this.SwalObj.msg = data.mensaje;      
        this.SwalObj.html = data.html;      
      }      
    }
  }
}
