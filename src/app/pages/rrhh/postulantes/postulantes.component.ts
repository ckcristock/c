import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
/* import { SwalComponent } from "@toverux/ngx-sweetalert2"; */
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-postulantes',
  templateUrl: './postulantes.component.html',
  styleUrls: ['./postulantes.component.scss']
})
export class PostulantesComponent implements OnInit {

  public Postulantes: any[] = [
    {
      Postulante: 'Carlos Cardona',
      Identificacion: '1234567', Grupo: 'Administrativo',
      Dependencia: 'Tecnología', Cargo: 'Analista de datos'
      , Departamento: 'Santander'
    },
    {
      Postulante: 'Carlos Cardona 2',
      Identificacion: '1234', Grupo: 'Administrativo',
      Dependencia: 'Tecnología', Cargo: 'Analista de datos'
      , Departamento: 'Santander'
    },
    {
      Postulante: 'Carlos Cardona 3',
      Identificacion: '123456887', Grupo: 'Administrativo',
      Dependencia: 'Tecnología', Cargo: 'Analista de datos'
      , Departamento: 'Santander'
    }
  ];
  public Cargando = true;
  public Hoja = {
    Id_Dependencia: '',
    Id_Cargo: '',
    Id_Grupo: '',
    Nombres: '',
    Apellidos: '',
    Identificacion: '',
    Archivo: '',
    Id_Punto_Dispensacion: '',
    Id_Departamento: '',
    Id_Postulantes: '',
  };
  public filtro_nom: any = '';
  public filtro_iden: any = '';
  public filto_grupo: any = '';
  public filtro_depen: any = '';
  public filtro_cargo: any = '';
  public filtro_dep: any = '';
  public filtro_punto: any = '';
  public Puntos: any[];
  public Departamentos: any = [];
  public Archivos: any = [];
  public Grupos: any = [];
  public Dependencias: any = [];
  public Cargos: any = [];
  public maxSize = 10;
  public TotalItems: number;
  public page = 1;


  @ViewChild('confirmacionSwal') confirmacionSwal: any;
  @ViewChild('modalNuevaHoja') modalNuevaHoja: any;
  constructor(private http: HttpClient, private router: Router, private location: Location) { }

  ngOnInit() {
    /*  this.http.get(environment.base_url + 'php/lista_generales.php', { params: { modulo: 'Grupo' } }).subscribe((data: any) => {
       this.Grupos = data;
     });
     this.http.get(environment.base_url + 'php/lista_generales.php', { params: { modulo: 'Departamento' } }).subscribe((data: any) => {
       this.Departamentos = data;
     }) */
    /*  this.ListarPostulantes(); */
  }
  ListarPostulantes() {
    this.http.get(environment.base_url + 'php/recursos_humanos/lista_postulantes.php').subscribe((data: any) => {
      this.Postulantes = data.Lista;
      this.TotalItems = data.numReg;

      this.Cargando = false;
    });
  }
  cargarPuntos(id_dep) {
    if (id_dep != "") {
      this.http.get(environment.base_url + 'php/reportes/puntos.php', { params: { id_dep: id_dep } }).subscribe((data: any) => {
        this.Puntos = data;
      })
    }
  }
  paginacion() {
    let queryString = this.getQueryString(true);

    this.location.replaceState('/postulantes', queryString);

    this.http.get(environment.base_url + 'php/recursos_humanos/lista_postulantes.php' + queryString).subscribe((data: any) => {
      this.Postulantes = data.Lista;
      this.TotalItems = data.numReg;

    });
  }

  filtros() {
    let queryString = this.getQueryString();
    this.location.replaceState('/postulantes', queryString);
    this.http.get(environment.base_url + 'php/recursos_humanos/lista_postulantes.php' + queryString).subscribe((data: any) => {
      this.Postulantes = data.Lista;
      this.TotalItems = data.numReg;
    });
  }
  getQueryString(pagination: boolean = false) {

    let params: any = {};
    let queryString = '';

    if (!pagination) {
      this.page = 1;
    }
    if (this.filtro_nom != '') {
      params.nom = this.filtro_nom;
    }
    if (this.filtro_iden != '') {
      params.iden = this.filtro_iden;
    }
    if (this.filtro_cargo != '') {
      params.cargo = this.filtro_cargo;
    }
    if (this.filtro_dep != '') {
      params.dep = this.filtro_dep;
    }
    if (this.filtro_depen != '') {
      params.depen = this.filtro_depen;
    }
    if (this.filtro_punto != '') {
      params.punto = this.filtro_punto;
    }
    params.pag = this.page;


    queryString = '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&');
    return queryString;

  }

  Grupo_Dependencia(Grupo) {
    this.http.get(environment.base_url + 'php/funcionarios/dependencias_grupo.php', { params: { id: Grupo } }).subscribe((data: any) => {
      this.Dependencias = data;
    });
  }
  Dependencia_Cargo(Dependencia) {
    this.http.get(environment.base_url + 'php/funcionarios/cargos_dependencia.php', { params: { id: Dependencia } }).subscribe((data: any) => {
      this.Cargos = data;
    });
  }

  CargaArchivo(event, i) {
    let fot = document.getElementById("archivo_visual" + i) as HTMLImageElement;
    if (event.target.files.length === 1) {
      if (this.Archivos[i] !== 'undefined') {
        this.Archivos[i] = event.target.files[0];
      } else {
        this.Archivos.push(event.target.files[0]);
      }
      // this.Soportes[i].NomArchivo=event.target.files[0].name;

    }
  }
  normalize = (function () {
    var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};

    for (var i = 0, j = from.length; i < j; i++)
      mapping[from.charAt(i)] = to.charAt(i);

    return function (str) {
      var ret = [];
      for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
          ret.push(mapping[c]);
        else
          ret.push(c);
      }
      return ret.join('');
    }

  })();

  GuardarHojaVida() {

    let hoja = this.normalize(JSON.stringify(this.Hoja));
    let datos = new FormData();
    datos.append("datos", hoja);
    datos.append("Archivo", this.Archivos[0]);
    this.http.post(environment.base_url + 'php/recursos_humanos/guardar_postulante.php', datos).subscribe((data: any) => {
      /*       this.confirmacionSwal.title = "Guardado Correctamente";
            this.confirmacionSwal.text = data.mensaje;
            this.confirmacionSwal.type = data.tipo;
            this.confirmacionSwal.show(); */
      this.modalNuevaHoja.hide();
      this.Archivos = [];
      this.Hoja = {
        Id_Dependencia: '',
        Id_Cargo: '',
        Id_Grupo: '',
        Nombres: '',
        Apellidos: '',
        Identificacion: '',
        Archivo: '',
        Id_Punto_Dispensacion: '',
        Id_Departamento: '',
        Id_Postulantes: '',
      };
      this.ListarPostulantes();

    }, error => {
      /*       this.confirmacionSwal.title = "Error";
            this.confirmacionSwal.text = "Ha ocurrido un error inesperado de conexión.";
            this.confirmacionSwal.type = "error";
            this.confirmacionSwal.show(); */
    });
  }

  EditarPostulante(pos) {
    this.Hoja.Apellidos = this.Postulantes[pos].Apellidos;
    this.Hoja.Nombres = this.Postulantes[pos].Nombres;
    this.Hoja.Id_Departamento = this.Postulantes[pos].Id_Departamento;
    this.Hoja.Id_Punto_Dispensacion = this.Postulantes[pos].Id_Punto_Dispensacion;
    this.Grupo_Dependencia(this.Postulantes[pos].Id_Grupo);
    this.Hoja.Id_Cargo = this.Postulantes[pos].Id_Cargo;
    this.Dependencia_Cargo(this.Postulantes[pos].Id_Dependencia);
    this.Hoja.Id_Dependencia = this.Postulantes[pos].Id_Dependencia;
    this.Hoja.Id_Grupo = this.Postulantes[pos].Id_Grupo;
    this.Hoja.Identificacion = this.Postulantes[pos].Identificacion;
    this.Hoja.Id_Postulantes = this.Postulantes[pos].Id_Postulante;
    this.modalNuevaHoja.show();
  }

}
