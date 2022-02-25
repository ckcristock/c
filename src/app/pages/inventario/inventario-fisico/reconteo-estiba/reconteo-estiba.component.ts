import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import swal,{ SweetAlertOptions } from 'sweetalert2';
import { functionsUtils } from 'src/app/core/utils/functionsUtils';
import { environment } from 'src/environments/environment';
import { InventariofisicoService } from '../../services/inventariofisico.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reconteo-estiba',
  templateUrl: './reconteo-estiba.component.html',
  styleUrls: ['./reconteo-estiba.component.scss']
})
export class ReconteoEstibaComponent implements OnInit {


  public DatosCabecera: any = {
    Titulo: 'Reconteo Inventario Fisico Estibas',
    Fecha: new Date(),
    Codigo: ''
  };
  public Id_Inventario = this.route.snapshot.params['idInventarioEstiba'];

  public Inventario_Diferencial: any = [];
  public Inventario_Sin_Diferencia: any = [];
  public Inventarios: any = '';
  public alertOptionInventario: SweetAlertOptions = {};
  public Funcionario_Autoriza: '';
  public Productos = {};

  @ViewChild('confirmacionSalir') confirmacionSalir: any;
  @ViewChild('respuestaSwal') respuestaSwal: any;
  constructor(private _swalService: SwalService, private http: HttpClient,

    // private inventariofisico: InventariofisicoService,
    public router: Router,
    private route: ActivatedRoute, ) {
    this.alertOptionInventario = {
      title: "¿Está Seguro?",
      text: "Se dispone a registrar el inventario final",
      showCancelButton: true,
      cancelButtonText: "No, Dejame Comprobar!",
      confirmButtonText: 'Si, Guardar',
      showLoaderOnConfirm: true,
      focusCancel: true,
      icon: 'info',
      preConfirm: () => {
        return new Promise((resolve) => {
          this.guardarInventarioFinal();
        })
      },
      allowOutsideClick: () => !swal.isLoading()
    }
  }

  ngOnInit() {
    let param: any = {};

    this.ValidarInventario();

    let params = this.route.snapshot.queryParams;
    if (params.func != undefined) {
      this.Funcionario_Autoriza = params.func;
    }


  }

  ValidarInventario() {

    this.ValidarInventarioEstiba(this.Id_Inventario).subscribe(async (data: any) => {
      if (data.tipo == 'success') {

        this.Inventario_Diferencial = data.Productos;

        this.Inventario_Sin_Diferencia=data.Productos_Sin_Diferencia;
        this.Inventarios=data.Inventarios;
        //cambiar estado para que no puedan entrar
        let datos=new FormData();
        datos.append("Id_Doc_Inventario_Fisico",this.Id_Inventario);
        datos.append("tipo_accion", 'Haciendo Segundo Conteo');
        await this.GestionarEstado(datos).toPromise();



      } else {
        this.respuestaSwal.type=data.tipo;
        this.respuestaSwal.title=data.titulo;
        this.respuestaSwal.text=data.mensaje;

        this.respuestaSwal.fire();

      }
    });
  }

  ValidarInventarioEstiba(p: string){
    return this.http.get(environment.ruta + 'php/inventariofisico/estiba/validar_inventario.php?inv=' + p);
  }

  public GestionarEstado(data:FormData) {
    return this.http.post(environment.ruta + 'php/inventariofisico/estiba/gestion_de_estado.php', data);
  }


  ListarProductosSinDiferencia(inventarios) {
    this.GetProductosSinDiferencia(inventarios).subscribe((data: any) => {
      this.Inventario_Sin_Diferencia = data
      localStorage.setItem('Productos_Sin_Diferencia', functionsUtils.normalize(JSON.stringify(data)));
    })
  }

  GetProductosSinDiferencia(p: any){
    return this.http.get(environment.ruta + 'php/inventariofisico/inventario_sin_diferencia_barrido.php?inv=' + p);
  }

  guardarLocalStg() {
    //// console.log(this.Inventario_Diferencial);

    localStorage.setItem('Productos_Diferencia', functionsUtils.normalize(JSON.stringify(this.Inventario_Diferencial)));
  }

  guardarInventarioFinal() {
    let listado = JSON.stringify(this.Inventario_Diferencial);
    let datos = new FormData();
    datos.append('listado_inventario', listado);
    datos.append('id_funcionario', this.Funcionario_Autoriza);
    datos.append('inventarios', this.Inventarios);
    console.log(this.Inventarios,'inventario');

    this.SaveReconteo(datos).subscribe((data: any) => {
      if (data.tipo == 'success') {
        this.respuestaSwal.title = data.titulo;
        this.respuestaSwal.text = data.mensaje;
        this.respuestaSwal.type = data.tipo;
        this.respuestaSwal.fire();

        this.Inventario_Diferencial = [];
        this.Inventario_Sin_Diferencia = [];


      } else{

      }
    });
  }

  SaveReconteo(data: FormData) {
    return this.http.post(environment.ruta + 'php/inventariofisico/estiba/guardar_reconteo.php', data);
  }


  VerPantallaLista() {
    this.router.navigate(['/ajusteinventariofisico']);
  }

  DecargarInforme() {
    let data = new FormData();
    let info = JSON.stringify(this.Inventario_Diferencial);

     data.append('productos', info);
    // data.append('id_doc_inventario', this.Inventarios);
 /*    this.inventariofisico.DescargarInformeEstiba(data).subscribe((data: any) => {

    });
 */
    var form = document.createElement("form");
    form.target = "_blank";
    form.method = "POST";
    form.action = environment.ruta + 'php/inventariofisico/estiba/descargar_excel_diferencias.php';
    form.style.display = "none";


        var input = document.createElement("input");
        input.type = "hidden";
        input.name = 'producto';
        input.value = info;
        form.appendChild(input);


    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

  }

  async getInventario() {


  }
}
