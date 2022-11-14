import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { SweetAlertOptions } from 'sweetalert2';
import { BodegasService } from '../bodegas.service.';
import { MatAccordion } from '@angular/material/expansion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalService } from '../../services/swal.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-grupoestiba',
  templateUrl: './grupoestiba.component.html',
  styleUrls: ['./grupoestiba.component.scss']
})
export class GrupoestibaComponent implements OnInit {

  @ViewChild('accordionGrupo') accordionGrupo: MatAccordion;
  @ViewChild('accordionEstiba') accordionEstiba: MatAccordion;
  matPanel: any = {
    accordionGrupo: false,
    accordionEstiba: false
  };
  formGrupo: FormGroup;
  formEstiba: FormGroup;
  dataFormGrupo: any;
  dataFormEstiba: any;
  closeResult = '';

  public abrirModalEstiba = new EventEmitter<any>();
  public abrirModalGrupo = new EventEmitter<any>();
  public alertOptionMapa: SweetAlertOptions = {};
  public bodega: any = {}
  public id = '' // El identificador dela Bodega
  public grupos: any = [];
  public startTime: any;
  public estibas: any = [];
  public abriendo = 0;
  public loadingEstibas = false;
  public loadingGrupos = false;
  public Interval: any
  public currentPageEstibas = 1;
  public limitEstibas = 15;
  public sizeEstibas = 0
  public currentPageGrupos = 1;
  public limitGrupos = 15;
  public sizeGrupos = 0
  public filtrosEstibas = {
    Nombre: '',
    Codigo_Barras: '',
    Estado: ''
  }
  public filtrosGrupos = {
    Nombre: '',
    Fecha_Vencimiento: '',
    Presentacion: ''
  }
  public pagination: any = {
    grupos: {
      page: 1,
      pageSize: 5,
      collectionSize: 0
    },
    estibas: {
      page: 1,
      pageSize: 5,
      collectionSize: 0
    }
  }
  public grupoSelected: any = {
    id: null,
    nombre: ''
  };
  public tituloFormulario: any = '';

  constructor(
    private route: ActivatedRoute,
    private _bodegas: BodegasService,
    private _swal: SwalService,
    private _modal: ModalService,
    private fb: FormBuilder) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getBodega();
    this.getGrupos();
    this.createFormGrupo();
  }

  createFormGrupo() {
    this.formGrupo = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      idBodega: [this.id, Validators.required],
      fechaVencimiento: ['', Validators.required],
      presentacion: ['', Validators.required]
    });
  }

  createFormEstiba(){
    this.formEstiba = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      idBodega: [this.id, Validators.required],
      idGrupo: [this.grupoSelected.id, Validators.required],
      codigoBarras: ['', Validators.required],
      estado: ['Disponible', Validators.required]
    });
  }

  openCloseGrupo() {
    (!this.matPanel.accordionGrupo)?this.accordionGrupo.openAll():this.accordionGrupo.closeAll();
    this.matPanel.accordionGrupo=!this.matPanel.accordionGrupo;
  }

  openCloseEstiba() {
    (!this.matPanel.accordionEstiba)?this.accordionEstiba.openAll():this.accordionEstiba.closeAll();
    this.matPanel.accordionEstiba=!this.matPanel.accordionEstiba;
  }

  public openConfirm(confirm, titulo, modulo = '') {
    this.tituloFormulario = titulo;
    this._modal.open(confirm);
    if(modulo== 'grupo'){
      this.formGrupo.reset();
      this.formGrupo.get("idBodega").setValue(this.id);
    }else if(modulo== 'estiba'){
      this.formEstiba.reset();
      this.formEstiba.get("idBodega").setValue(this.id);
      this.formEstiba.get("idGrupo").setValue(this.grupoSelected.id);
    }
  }

  calcularClick(grupo) {
    this.startTime = new Date();
    this.abriendo = 40;
    this.Interval = setInterval(() => {
      this.abriendo += 20
      if (this.abriendo >= 100) {
        this.abrirModalGrupo.emit({ Grupo: grupo, Tipo: 'Editar' })
        clearInterval(this.Interval);
        setTimeout(() => {
          this.abriendo = 0
        }, 1000);
      }
    }, 120);

  }

  selected(model, value) {
    model = model.map(m => {
      m.selected = m.Id_Grupo_Estiba == value ? true : false;
    })
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

  setearEstibas() {
    this.currentPageEstibas = 1;
    this.sizeEstibas = 0;
    this.estibas = [];
  }

  getBodega() {
    this._bodegas.getBodega(this.id).subscribe((res: any) => {
      this.bodega = res.data;
      this.alertOptionMapa = {
        title: "Mapa de la bodega " + this.bodega.Nombre,
        text: "Ubicación de las Estibas",
        imageUrl: res.data.Mapa,
        imageWidth: 700,
        width: 800,
      }
    })
  }

  getGrupo(data) {
    this.dataFormGrupo = { ...data };
    this.formGrupo.patchValue({
      id: this.dataFormGrupo.Id_Grupo_Estiba,
      nombre: this.dataFormGrupo.Nombre,
      idBodega: this.id,
      fechaVencimiento: this.dataFormGrupo.Fecha_Vencimiento,
      presentacion: this.dataFormGrupo.Presentacion
    });
  }

  getEstiba(data) {
    this.dataFormEstiba = { ...data };
    this.formEstiba.patchValue({
      id: this.dataFormEstiba.Id_Estiba,
      nombre: this.dataFormEstiba.Nombre,
      idBodega: this.id,
      idGrupo: this.dataFormEstiba.Id_Grupo_Estiba,
      codigoBarras: this.dataFormEstiba.Codigo_Barras,
      estado: this.dataFormEstiba.Estado
    });
  }

  getGrupos(page = 1) {
    this.pagination.grupos.page = page;
    let params = {
      ...this.pagination.grupos, ...this.filtrosGrupos
    }
    this.loadingGrupos = true;
    this._bodegas.getGruposBodega(this.id, params).subscribe((res: any) => {
      this.grupos = res.data.data;
       this.loadingGrupos = false;
      this.pagination.grupos.collectionSize = res.data.total;
    })
  }

  getEstibas(grupo, page = 1) {
    this.pagination.estibas.page = page;
    let params = {
      ...this.pagination.estibas, ...this.filtrosEstibas
    }
    this.loadingEstibas = true;
    this._bodegas.getEstibasGrupo(grupo, params).subscribe((res: any) => {
      this.estibas = res.data.data;
      this.loadingEstibas = false;
      this.pagination.estibas.collectionSize = res.data.total;
    })
  }

  createGrupo(){
    this._bodegas.createGrupo(this.formGrupo.value)
      .subscribe((res: any) => {
        this.getGrupos(this.pagination.grupos.page);
        this._modal.close();
        this._swal.show({
          icon: 'success',
          title: res.data,
          text: 'Se ha agregado el grupo con éxito.',
          timer: 1000,
          showCancel: false
        })
      }, err => {
        this._swal.show({
          title: 'ERROR',
          text: 'Aún no puedes editar una bodega con el mismo código, estamos trabajando en esto.',
          icon: 'error',
          showCancel: false,
        })
      }
      );
  }

  createEstiba(){
    this._bodegas.createEstiba(this.formEstiba.value)
      .subscribe((res: any) => {
        this.getEstibas(this.grupoSelected.id, this.pagination.estibas.page);
        this._modal.close();
        this._swal.show({
          icon: 'success',
          title: res.data,
          text: 'Se ha agregado la estiba con éxito.',
          timer: 1000,
          showCancel: false
        })
      }, err => {
        this._swal.show({
          title: 'ERROR',
          text: 'Aún no puedes editar una bodega con el mismo código, estamos trabajando en esto.',
          icon: 'error',
          showCancel: false,
        })
      }
      );
  }

  cambiarEstado(grupo, state) {
    let data = {
      id: grupo.Id_Grupo_Estiba,
      modulo: 'grupo',
      state
    }
    this._swal.show({
      title: '¿Estás seguro(a)?',
      text: (grupo.Estado == 'Activo' ? '¡El grupo de estibas será desactivado!' : '¡El grupo de estibas será activado!'),
      icon: 'question',
      showCancel: true
    })
    .then((result) => {
      if (result.isConfirmed) {
        this._bodegas.activarInactivar(data).subscribe((r: any) => {
          this.getGrupos(this.pagination.grupos.page);
        })
        this._swal.show({
          icon: 'success',
          title: 'Tarea completada con éxito!',
          text: (grupo.Estado == 'Inactivo' ? 'El grupo de estibas ha sido activado con éxito.' : 'El grupo de estibas ha sido desactivado con éxito.'),
          timer: 1000,
          showCancel: false
        })
      }
    })
  }
}
