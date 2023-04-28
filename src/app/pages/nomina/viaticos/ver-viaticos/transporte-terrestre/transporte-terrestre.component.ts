import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { LegalizarDataService } from '../../legalizar/legalizar-data.service';
import { Subscription } from 'rxjs';
import { helperLegalizar } from '../../legalizar/helpers-legalizar';
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-transporte-terrestre',
  templateUrl: './transporte-terrestre.component.html',
  styleUrls: ['./transporte-terrestre.component.scss'],
})
export class TransporteTerrestreComponent implements OnInit, OnDestroy {
  @Input('legal') legal = false;
  @ViewChildren('file', { read: ElementRef }) file: QueryList<ElementRef>;
  viaticos$: Subscription;
  data: any;
  masks = consts;
  transports: any[];

  constructor(private _viaticosData: LegalizarDataService) { }

  ngOnInit(): void {
    this.viaticos$ = this._viaticosData.viaticos.subscribe((r: any) => {
      this.data = r;
      this.transports = r.transports;
    });
  }

  onFileChanged(event, i: number, model) {
    let myFile = this.file.toArray()[i];
    helperLegalizar.getImage(event, myFile, model);
  }
  ngOnDestroy(): void {

    this.viaticos$.unsubscribe();

  }
}
