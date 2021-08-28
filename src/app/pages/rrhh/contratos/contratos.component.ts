import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DependenciesService } from '../../ajustes/informacion-base/services/dependencies.service';
import { GroupService } from '../../ajustes/informacion-base/services/group.service';
import { PositionService } from '../../ajustes/informacion-base/services/positions.service';
import { ContratoService } from './contrato.service';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements OnInit {
  contracts:any;
  groups: any[];
  dependencies:any[];
  positions:any[];
  filtros:any = {
    company: '',
    person: ''
  }

  contratos:any = [
    {
      name: 'Néstor Eduardo Lima Rojas',
      position: 'Full Stack',
      time: 'Hace 12 Dias'
    },
    {
      name: 'Julio Andres Perez Medina',
      position: 'Frontend',
      time: 'Hace 10 Dias'
    }
  ]
  constructor( 
              private contactService: ContratoService,
              private _group: GroupService,
              private _positions: PositionService,
              private _dependecies: DependenciesService
              ) { }

  ngOnInit(): void {
    this.getGroups();
  }

  getAllContracts(){
    this.contactService.getAllContracts()
    .subscribe( (res:any) => {
      this.contracts = res.data;
    });
  }

  
  getGroups() {
    this._group.getGroup().subscribe((r: any) => {
      this.groups = r.data
      this.groups.unshift({ text: 'Seleccione uno', value: '' });
    })
  }

  getDependencies(group_id) {
    this._dependecies.getDependencies({ group_id }).subscribe((d: any) => {
      this.dependencies = d.data;
      this.dependencies.unshift({ text: 'Seleccione una', value: '' });
    });
  }
  
  getPositions(dependency_id) {
    if (dependency_id) {
      this._positions.getPositions({ dependency_id }).subscribe((d: any) => {
        this.positions = d.data;
        this.positions.unshift({ text: 'Seleccione una', value: '' });
      });
    }
  }

}
