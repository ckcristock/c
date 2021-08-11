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
  @ViewChild('modal') modal :any
  grupos: any[]
  dependecies: any[]
  positions: any[]

  constructor(
    private _group: GroupService,
    private _dependecies: DependenciesService,
    private _position: PositionService
  ) { }
  ngOnInit(): void {
    this._group.getGroup().subscribe((r: any) => {
      console.log(r);
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

  openModal(tipo){

    if (tipo == 'dependencias') {
      console.log(this.grupos.find(r=>r.selected==true));
    }
    if (tipo == 'cargos') {
      console.log(this.dependecies.find(r=>r.selected==true));
    }

    this.modal.show()
  }


}
