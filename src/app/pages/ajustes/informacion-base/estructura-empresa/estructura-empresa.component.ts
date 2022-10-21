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
  grupos = []
  dependencies = []
  positions = []
  loading: any = {
    grupos: false,
    dependencies: false,
    positions: false
  };
  name = ''
  tipo = ''
  constructor(
    private _group: GroupService,
    private _dependencies: DependenciesService,
    private _position: PositionService,
    private modalService: NgbModal,
  ) { }
  ngOnInit(): void {
    this.getGroups();
  }
  getGroups() {
    this.loading.grupos = true;
    this._group.getGroup().subscribe((r: any) => {
      this.grupos = r.data
      if (this.grupos) {
        this.getDependencies(this.grupos[0].value)
        this.grupos[0].selected = true;
      }
      this.loading.grupos = false;
    })

  }
  closeResult = '';
  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any) {

  }
  grupoSelcted:any;
  getDependencies(group_id) {
    this.grupoSelcted = group_id
    this.loading.dependencies = true;
    this._dependencies.getDependencies({ group_id })
      .subscribe((r: any) => {
        this.dependencies = r.data;

        if (this.dependencies.length != 0) {
          this.getPosition(this.dependencies[0].value)
          this.dependencies[0].selected = true;
        }
        else{
          this.positions = []
        }
        this.loading.dependencies = false;
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
    this.loading.positions = true;
    this._position.getPositions({ dependency_id }).subscribe((r: any) => {
      this.positions = r.data
      this.loading.positions = false;
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
      this._dependencies.delete(id).subscribe(r => {
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
      let selected = this.dependencies.find(r => r.selected == true);
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
    this._dependencies.save(params).subscribe(r => {
      this.getDependencies(params.group_id)
      this.modalService.dismissAll();
    })
  }
  savePosition(params) {
    this._position.save(params).subscribe(r => {
      this.getPosition(params.dependency_id)
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
