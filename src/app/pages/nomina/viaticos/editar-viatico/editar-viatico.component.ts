import { Component, OnInit } from '@angular/core';
import { VerViaticosService } from '../ver-viaticos/ver-viaticos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-viatico',
  templateUrl: './editar-viatico.component.html',
  styleUrls: ['./editar-viatico.component.scss']
})
export class EditarViaticoComponent implements OnInit {
  id : string
  data:any;
  constructor( private route:ActivatedRoute, private _viatico:VerViaticosService) { }
  
  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.getData();
  }

  getData(){
    this._viatico.getAllViaticos(this.id).subscribe( (r:any)=>{
      this.data = r.data;
    });
  }

}
