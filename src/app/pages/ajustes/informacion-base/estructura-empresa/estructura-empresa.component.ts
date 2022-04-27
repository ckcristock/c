import { Component, OnInit, ViewChild } from '@angular/core';
import { GroupService } from '../services/group.service';
import { DependenciesService } from '../services/dependencies.service';
import { PositionService } from '../services/positions.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-estructura-empresa',
  templateUrl: './estructura-empresa.component.html',
  styleUrls: ['./estructura-empresa.component.scss']
})
export class EstructuraEmpresaComponent implements OnInit {
  @ViewChild('deleteSwal') deleteSwal: any;
  @ViewChild('modal') modal: any
  grupos: any[]
  dependecies: any[]
  positions = []
  loading: boolean = false;
  name = ''
  tipo = ''
  constructor(
    private _group: GroupService,
    private _dependecies: DependenciesService,
    private _position: PositionService,
    private modalService: NgbModal,
  ) { }
  ngOnInit(): void {
    this.getGroups();
  }
  getGroups() {
    this._group.getGroup().subscribe((r: any) => {
      this.grupos = r.data
      if (this.grupos) {
        this.getDependencies(this.grupos[0].value)
        this.grupos[0].selected = true;
      }      
    })
    
  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  grupoSelcted:any;
  getDependencies(group_id) {
    this.grupoSelcted = group_id
    console.log(group_id)  
    this._dependecies.getDependencies({ group_id })
      .subscribe((r: any) => {
        this.dependecies = r.data;  
            
        if (this.dependecies.length != 0) {
          this.getPosition(this.dependecies[0].value)
          this.dependecies[0].selected = true;
        }
        else{
          this.positions = []
        }
      })
  }

  selected(model, value) {
    model = model.map(m => {
      m.selected = m.value == value ? true : false;
    })
  }
  dependenceSelected:any;
  getPosition(dependency_id) {
    this.dependenceSelected = dependency_id
    this.loading = true;
    this._position.getPositions({ dependency_id }).subscribe((r: any) => {
      this.positions = r.data
      this.loading = false;
    })
  }

  openModal(tipo, add) {
    this.name = ''
    this.id = '';
    this.operation = 'guardar';
    this.tipo = tipo;
    this.openConfirm(add)
  }

  delete(tipo, id){
    if(tipo == 'dependencias'){
      this._dependecies.delete(id).subscribe(r => {
        this.getDependencies(1)
        this.deleteSwal.show();
      })
    }
    if(tipo == 'cargos'){
      this._position.delete(id).subscribe(r =>{
        this.getDependencies(1)
        this.deleteSwal.show();
      })
    }
    if(tipo == 'grupos'){
      this._group.delete(id).subscribe(r =>{
        this.getGroups()
        this.deleteSwal.show();
      })      
    }
  }

  save() {
    if (this.tipo == 'dependencias') {
      let selected = this.grupos.find(r => r.selected == true);
      console.warn(selected.value)
      let params: any = { group_id: selected.value, name: this.name }
      params ? params.id = this.id : ''
      params ? params.id = this.id : ''

      this.saveDependency(params)
    }
    if (this.tipo == 'cargos') {
      let selected = this.dependecies.find(r => r.selected == true);
      console.warn(selected.value)
      let params: any = { dependency_id: selected.value, name: this.name }
      params ? params.id = this.id : ''
      this.savePosition(params)
    }

    if (this.tipo == 'grupos') {
      let params: any = { name: this.name }
      params ? params.id = this.id : ''
      this.saveGroup(params);
    }
  }

  saveGroup(params) {
    this._group.save(params).subscribe(r => {
      this.getGroups()
      this.modalService.dismissAll(); 
    })
  }
  saveDependency(params) {
    this._dependecies.save(params).subscribe(r => {
      this.getDependencies(params.group_id)
      this.modalService.dismissAll(); 
    })
  }
  savePosition(params) {
    this._position.save(params).subscribe(r => {
      this.getDependencies(params.dependency_id)
      this.modalService.dismissAll(); 
    })
  }
  id = '';
  operation = ''

  editar(tipo, modelo, add) {
    this.name = modelo.text
    this.openConfirm(add)
    this.tipo = tipo
    this.operation = 'editar';
    this.id = modelo.value
  }


}
