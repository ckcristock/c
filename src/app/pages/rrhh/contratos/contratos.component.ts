import { Component, OnInit } from '@angular/core';
import { ContratoService } from './contrato.service';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements OnInit {
  contracts:any;
  constructor( private contactService: ContratoService ) { }

  ngOnInit(): void {
  }

  getAllContracts(){
    this.contactService.getAllContracts()
    .subscribe( (res:any) => {
      this.contracts = res.data;
    });
  }

}
