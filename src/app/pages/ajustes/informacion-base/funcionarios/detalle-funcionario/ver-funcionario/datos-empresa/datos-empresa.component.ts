import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { consts } from 'src/app/core/utils/consts';
import { DependenciesService } from '../../../../services/dependencies.service';
import { GroupService } from '../../../../services/group.service';
import { PositionService } from '../../../../services/positions.service';
import { DatosEmpresaService } from './datos-empresa.service';

@Component({
  selector: 'app-datos-empresa',
  templateUrl: './datos-empresa.component.html',
  styleUrls: ['./datos-empresa.component.scss']
})
export class DatosEmpresaComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form: FormGroup;
  id:any;
  turnos = consts.turnTypes;
  turns:any;
  groups: any[];
  dependencies:any[];
  fixed_turns: any[];
  positions:any[];
  empresa: any = {
    company_name: '',
    group_name: '',
    dependency_name: '',
    position_name: '',
    turn_type: '',
    fixed_turn_name: ''
  };
  constructor( private fb:FormBuilder, 
                private enterpriseDataService: DatosEmpresaService,
                private activatedRoute: ActivatedRoute,  
                private _positions: PositionService,
                private _dependecies: DependenciesService,
                private _group: GroupService
            ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params.id;
    this.getEnterpriseData();
    this.getFixed_turn();
    this.getGroups();
    this.createForm();
  }

  openModal(){
    this.modal.show();
  }

  getEnterpriseData(){
    this.enterpriseDataService.getEnterpriseData(this.id)
    .subscribe( (res:any) =>{
      this.empresa = res.data;
      this.getDependencies(this.empresa.group_id);
      this.getPositions(this.empresa.dependency_id)
        this.form.patchValue({
          fixed_turn_id: this.empresa.fixed_turn_id,
          position_id: this.empresa.position_id,
          group_id: this.empresa.group_id,
          dependency_id: this.empresa.dependency_id,
          id: this.empresa.id,
          turn_type: this.empresa.turn_type
        });
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

  getFixed_turn(){
    this.enterpriseDataService.getFixed_turn().subscribe((r:any) => {
      this.fixed_turns = r.data;
      this.fixed_turns.unshift({ text: 'Seleccione una', value: '' });
    })
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

  turnChanged(turno) {
    if (turno == 'Rotativo') {
      this.form.get('fixed_turn_id').enable();
    } else {
      this.form.get('fixed_turn_id').disable();
    }
  }

  updateEnterpriseData(){
    this.form.markAllAsTouched();
    if (this.form.invalid) { return false;}
    this.enterpriseDataService.updateEnterpriseData(this.form.value)
    .subscribe( res => {
      this.getEnterpriseData();
      this.modal.hide();
    });
  }
  createForm(){
    this.form = this.fb.group({
      dependency_id: ['', Validators.required],
      position_id: ['', Validators.required],
      fixed_turn_id: ['', Validators.required],
      group_id: ['', Validators.required],
      turn_type:['', Validators.required],
      id: ['']
    }); 
  }

  get dependency_valid(){
    return (
      this.form.get('dependency_id').invalid && this.form.get('dependency_id').touched
    );
  }
  
  get turnSelected() {
    return this.form.get('turn_type').value;
  }

  get fixed_turn_valid(){
    return (
      this.form.get('fixed_turn_id').invalid && this.form.get('fixed_turn_id').touched
    );
  }

  get position_valid(){
    return (
      this.form.get('position_id').invalid && this.form.get('position_id').touched
    );
  }

  get turn_valid(){
    return (
      this.form.get('turn_type').invalid && this.form.get('turn_type').touched
    );
  }

}
