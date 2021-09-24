import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupService } from '../services/group.service';
import { DependenciesService } from '../services/dependencies.service';
import { PositionService } from '../services/positions.service';

@Component({
  selector: 'app-estructura-empresa',
  templateUrl: './estructura-empresa.component.html',
  styleUrls: ['./estructura-empresa.component.scss']
})
export class EstructuraEmpresaComponent implements OnInit {
  @ViewChild('modal') modal: any
  grupos: any[]
  dependecies: any[]
  positions: any[]
  name = ''
  tipo = ''
  constructor(
    private _group: GroupService,
    private _dependecies: DependenciesService,
    private _position: PositionService
  ) { }
  ngOnInit(): void {
    this.getGroups()
  }
  getGroups(){
    this._group.getGroup().subscribe((r: any) => {
      this.grupos = r.data
      if (this.grupos) {
        this.getDependencies(this.grupos[0].value)
        this.grupos[0].selected = true;
      }
    })
  }
  
  getDependencies(group_id) {
    this._dependecies.getDependencies({ group_id })
      .subscribe((r: any) => {
        this.dependecies = r.data;
        if (this.dependecies) {
          this.getPosition(this.dependecies[0].value)
          this.dependecies[0].selected = true;
        }
      })
  }

  selected(model, value) {
    model = model.map(m => {
      m.selected = m.value == value ? true : false;
    })
  }
  getPosition(dependency_id) {
    this._position.getPositions({ dependency_id }).subscribe((r: any) => {
      this.positions = r.data
    })
  }

  openModal(tipo) {
    this.id = '';
    this.operation = 'guardar';
    this.tipo = tipo;
    this.modal.show()
  }

  save() {
    
    
    if (this.tipo == 'dependencias') {
      let selected = this.grupos.find(r => r.selected == true);
      let params :any = {group_id:selected.value,name: this.name}
      params ? params.id = this.id : ''
      params ? params.id = this.id : ''
      
      this.saveDependency(params)
    }
    if (this.tipo == 'cargos') {
      let selected = this.dependecies.find(r => r.selected == true);
      let params:any = {dependency_id:selected.value,name: this.name}
      params ? params.id = this.id : ''
      this.savePosition( params )
    }

    if (this.tipo == 'grupos' ) {
      let params:any = { name: this.name }
      params ? params.id = this.id : ''
      this.saveGroup( params );
    }

  }

  saveGroup( params ) {
    this._group.save( params ).subscribe(r=>{
      this.getGroups()
      this.modal.hide()
    })
  }
  saveDependency( params ) {
    this._dependecies.save( params ).subscribe(r=>{
      this.getDependencies( params.group_id )
      this.modal.hide()
    })
  }
  savePosition( params ) {
    this._position.save( params ).subscribe(r=>{
      this.getDependencies( params.dependency_id )
      this.modal.hide()
    })
  }
  id='';
  operation=''

  editar(tipo , modelo){
    this.name = modelo.text
    this.modal.show()
    this.tipo = tipo
    this.operation = 'editar';
    this.id=modelo.value
  }


}
