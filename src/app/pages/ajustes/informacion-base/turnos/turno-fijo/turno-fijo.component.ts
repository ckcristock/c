import { Component, OnInit } from '@angular/core';
import { FixedTurnService } from './turno-fijo.service';

@Component({
  selector: 'app-turno-fijo',
  templateUrl: './turno-fijo.component.html',
  styleUrls: ['./turno-fijo.component.scss']
})
export class TurnoFijoComponent implements OnInit {
  turnosFijos = []
  hours:any = []
  loading = false;

  constructor(private _turnFixed: FixedTurnService) { }

  ngOnInit(): void {
    this.getTunrs();
  }

  getTunrs() {
    this.loading = true;
    this._turnFixed.getFixedTurns().subscribe((r: any) => {
      this.turnosFijos = r.data
      this.loading = false;
    })
  }

  findHours( fixed_turn_id , modal ){
    console.log(fixed_turn_id);
    
    this._turnFixed.getFixedTurnHours( {fixed_turn_id} ).subscribe( (r:any)=>{
      this.hours = r.data
    })
  }

  editTurn(id) { }
  deleteTurn(id) { }
}
