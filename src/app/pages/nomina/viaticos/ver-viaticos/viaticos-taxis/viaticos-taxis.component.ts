import { Component, OnInit, Input, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { helperLegalizar } from '../../legalizar/helpers-legalizar';
import { LegalizarDataService } from '../../legalizar/legalizar-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-viaticos-taxis',
  templateUrl: './viaticos-taxis.component.html',
  styleUrls: ['./viaticos-taxis.component.scss']
})
export class ViaticosTaxisComponent  implements OnInit  {
  @Input('legal') legal = false;
  @ViewChildren('file', { read: ElementRef }) file: QueryList<ElementRef>;
  taxi : any[] = []

  viaticos$: Subscription;
  data: any;
 

  constructor(private _viaticosData: LegalizarDataService) {}

  ngOnInit(): void {
    this.viaticos$ = this._viaticosData.viaticos.subscribe((r: any) => {
      this.data = r;
      this.taxi = r.expense_taxi_cities;
      
    });
  }

  onFileChanged(event, i: number, model) {
    let myFile = this.file.toArray()[i];
    helperLegalizar.getImage(event, myFile, model);
  }
  ngOnDestroy(): void {
    this.viaticos$.unsubscribe();
   /*  throw new Error('Method not implemented.'); */
  }
}
