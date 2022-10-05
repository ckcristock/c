import { Component, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { SweetAlertOptions } from 'sweetalert2';


@Component({
  selector: 'app-grupoestiba',
  templateUrl: './grupoestiba.component.html',
  styleUrls: ['./grupoestiba.component.scss']
})
export class GrupoestibaComponent {
   
  public abrirModalEstiba = new EventEmitter<any>(); 
  public abrirModalGrupo = new EventEmitter<any>(); 

  public alertOptionMapa:SweetAlertOptions = {};
  public bodega : any = {}
  public idBodega = ''
  public grupos:any = [];
  public startTime:any ;
  public estibas:any = [];
  public abriendo = 0;

  public loadingEstibas=false;
  public loadingGrupos=false;
  public Interval :any
  
  public currentPageEstibas = 1;
  public limitEstibas = 15;
  public sizeEstibas = 0

  public currentPageGrupos = 1;
  public limitGrupos = 15;
  public sizeGrupos = 0


  public filtrosEstibas = {
    Nombre:'',
    Codigo_Barras:'',
    Estado:''
  }
  public filtrosGrupos = {
    Nombre:'',
    Fecha_Vencimiento:'',
    Presentacion:''
  }

  public grupoSelected:any ;

  constructor(private route : ActivatedRoute) { 
    this.idBodega = this.route.snapshot.paramMap.get('idBodega');
    /* this.getBodega();
    this.getGrupos(); */
  }

  calcularClick(grupo){
    this.startTime = new Date();
    this.abriendo=40;
    this.Interval = setInterval(() => {
      this.abriendo +=20
      if (this.abriendo >= 100) {
        this.abrirModalGrupo.emit({Grupo:grupo,Tipo:'Editar'})
        clearInterval(this.Interval);
        setTimeout(() => {
          this.abriendo = 0
        }, 1000);
      }
    }, 120 );

  }

  /* opercacionGrupo(grupo){
    clearInterval(this.Interval);
    this.abriendo=0;

    let endTime:any = new Date();
    var timeDiff:any = endTime - this.startTime; //en ms
  
    if(timeDiff<600){
      let grupoAnterior = this.grupos.find(g=>g.Selected==true)
      if (grupoAnterior) {
       grupoAnterior.Selected=false;
      }
       grupo.Selected=true;
     
       this.buscarEstibas(grupo.Id_Grupo_Estiba,true);
    }
  } */

  /* buscarEstibas(id_grupo,filtros=false){
    if (filtros) {
      this.setearEstibas();
    }
    
    this.loadingEstibas=true;
    
    this.grupoSelected = id_grupo;
    let params = {
      Filtros : (JSON.stringify(this.filtrosEstibas)),
      Id_Grupo_Estiba : id_grupo,
      currentPage : this.currentPageEstibas.toString(),
      limit : this.limitEstibas.toString()
    }

    this.http.get(this.globales.ruta+'php/bodega_nuevo/get_estibas.php',{params})
      .subscribe(res=>{
        this.estibas=res['data'];
        this.loadingEstibas=false;
        this.sizeEstibas = res['numReg'];
      });

  } */


 /*  getGrupos(porFiltros=false){
    
    if (porFiltros) {
      this.currentPageGrupos=1;
      this.sizeGrupos=0;
    } 
    this.loadingGrupos = true;

    let params = {
      filtros : (JSON.stringify(this.filtrosGrupos)),
      id_bodega_nuevo : this.idBodega,
      currentPage : this.currentPageGrupos.toString(),
      limit : this.limitGrupos.toString()
    }

    this.http.get(this.globales.ruta+'php/grupo_estiba/get_grupos_bodega.php',{params})
    .subscribe(res=>{
      this.grupos=res['Grupos'];
      this.setearEstibas();
      this.loadingGrupos = false
      this.sizeGrupos = res['numReg'];
    });
  } */

  setearEstibas(){
    this.currentPageEstibas = 1;
    this.sizeEstibas=0;
    this.estibas=[];
  }

  /* getBodega(){

    this.http.get(this.globales.ruta + 'php/bodega_nuevo/get_bodega.php', {
      params: { Id_Bodega_Nuevo: this.idBodega }
    }).subscribe((data: any) => {
       console.log(data);
       this.bodega = data.Bodega;
      let mapaUrl = `${this.globales.ruta}IMAGENES/MAPABODEGA/${data.Bodega.Mapa}`;
      //Modal Mapa Bodega
      console.log(mapaUrl);
      this.alertOptionMapa = {
        title: "Mapa de la Bodega "+ this.bodega.Nombre,
        text: "Ubicación de las Estibas",
        imageUrl: mapaUrl,
        imageWidth: 700,
        width: 800,
      }
    
    })
    
  } */
}
