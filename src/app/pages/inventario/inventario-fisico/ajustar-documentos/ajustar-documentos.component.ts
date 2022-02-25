import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal,{ SweetAlertOptions } from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ajustar-documentos',
  templateUrl: './ajustar-documentos.component.html',
  styleUrls: ['./ajustar-documentos.component.scss']
})
export class AjustarDocumentosComponent implements OnInit {

  public DatosCabecera: any = {
    Titulo: 'Inventario Fisico Estibas.',
    Fecha: new Date(),
    Codigo: ''
  };

  productos: any = {};
  Id_Estiba;
  Funcionario_Autoriza;
  public alertOpt  : SweetAlertOptions = {}
  @ViewChild('respuestaSwal') respuestaSwal: any;
  @ViewChild('respuestaRedirectSwal') respuestaRedirectSwal: any;
  constructor(public router: Router, private route: ActivatedRoute, private http: HttpClient) {
  this.alertOpt = {
    title:'Guardar Inventario Final',
    text:'¿Está Seguro que desea guardar el inventario?',
    confirmButtonText:'Si, Terminar el inventario',
    showCancelButton:true,
    cancelButtonText:'No, Dejame Comprobar!',
    icon:'question',
    preConfirm:()=>{
      this.guardarFinal();
    },
    allowOutsideClick: () => !swal.isLoading()
    }
  }

  ngOnInit() {
    this.Id_Estiba = this.route.snapshot.params['idEstiba'];

    let params = this.route.snapshot.queryParams;
    if (params.func != undefined) {
      this.Funcionario_Autoriza = params.func;
    }

    let param: any = {};
    param.Id_Estiba = this.Id_Estiba;

    this.GetDocumentosParaAjustar(params).subscribe((res: any)=> {

      if (res.tipo != 'error') {
        this.productos = res.data.productos;

        this.respuestaSwal.icon = res.icon;
        this.respuestaSwal.title = res.titulo;
        this.respuestaSwal.text = res.mensaje;
        this.respuestaSwal.fire();
      } else {
        this.respuestaRedirectSwal.icon = res.tipo;
        this.respuestaRedirectSwal.title = res.titulo;
        this.respuestaRedirectSwal.text = res.mensaje;
        this.respuestaRedirectSwal.fire();
      }
    })
  }

  GetDocumentosParaAjustar(p:any){
    console.log(p);
    return this.http.get(environment.ruta + 'php/inventariofisico/estiba/documentos_para_ajustar.php',{ params: p });
  }

  guardarFinal() {
    let listado = JSON.stringify(this.productos);
    console.log(listado, 'listado');

    let datos = new FormData();
    datos.append('listado_inventario', listado);
    datos.append('id_funcionario', this.Funcionario_Autoriza);
    datos.append('productos', listado);
    this.SaveInventarioFinalEstiba(datos).subscribe((res: any)=> {
        if (res.tipo=='success') {
          this.respuestaRedirectSwal.icon = res.tipo;
          this.respuestaRedirectSwal.title = res.titulo;
          this.respuestaRedirectSwal.text = res.mensaje;
          this.respuestaRedirectSwal.fire();
        }
    })
  }
  SaveInventarioFinalEstiba(data: FormData){
    return this.http.post(environment.ruta + 'php/inventariofisico/estiba/guardar_inventario_final.php', data);

  }

  editarProducto(producto){
    producto.editar = true;

  }
}
