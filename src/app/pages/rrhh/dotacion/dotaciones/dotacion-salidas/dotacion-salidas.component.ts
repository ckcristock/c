import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { DotacionService } from '../../dotacion.service';

@Component({
  selector: 'app-dotacion-salidas',
  templateUrl: './dotacion-salidas.component.html',
  styleUrls: ['./dotacion-salidas.component.scss']
})
export class DotacionSalidasComponent implements OnInit {

  @Input('openSalida') open: EventEmitter<any>;
  @ViewChild('modal') modal: any;

  loading = false;

  pagination = {
    pageSize: 15,
    page: 1,
    collectionSize: 0,
  }

  filtros:any = {
    cod: ''

  }

  public Lista_Entrega_Dotacion: any = [];

  constructor( private _dotation: DotacionService) { }

  ngOnInit(): void {

      this.getDotationsProduct()

  }

  limpiar(){
    this.Lista_Entrega_Dotacion = [];
  }


  getDotationsProduct(page = 1){

    this.open.subscribe((r) => {
      if (r?.data) {

        this.modal.show();
        this.pagination.page = page;
        let params = {
        ...this.pagination,
        ...this.filtros,
           code :  r.data.code
        }
        this.loading = true;
        this._dotation.getDotationsProduct({params}).subscribe((r: any) => {
        this.Lista_Entrega_Dotacion = r.data.data;
        this.pagination.collectionSize = r.data.total;
        this.loading = false;
        })


      }
    });

  }
}


// ListarDotaciones(page = 1){
//   this.pagination.page = page;
//   let params = {
//     ...this.pagination, ...this.filtros
//   }
//   this.loading = true;
//   this._dotation.getDotations(params).subscribe((r:any) => {
//     this.Lista_Dotaciones = r.data.data;
//     this.pagination.collectionSize = r.data.total;
//     this.loading = false;
//   });
// }
