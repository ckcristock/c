import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  ViewChild,
} from '@angular/core';
import { LegalizarDataService } from '../../legalizar/legalizar-data.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SwalService } from '../../../../ajustes/informacion-base/services/swal.service';
import { functionsUtils } from '../../../../../core/utils/functionsUtils';
import { consts } from '../../../../../core/utils/consts';
import { helperLegalizar } from '../../legalizar/helpers-legalizar';

@Component({
  selector: 'app-hospedaje',
  templateUrl: './hospedaje.component.html',
  styleUrls: ['./hospedaje.component.scss'],
})
export class HospedajeComponent implements OnInit, OnDestroy {
  @Input('legal') legal = false;
  @ViewChildren('file', { read: ElementRef }) file: QueryList<ElementRef>;
  data: any = [];
  hotels: any[];
  masks = consts;
  viaticos$: Subscription;
  constructor(
    private _viaticosData: LegalizarDataService,
    private _swal: SwalService
  ) { }

  ngOnInit(): void {
    this.viaticos$ = this._viaticosData.viaticos.subscribe((r: any) => {
      this.data = r;
      this.hotels = r.hotels;
    });
  }

  ngOnDestroy(): void {
    this.viaticos$.unsubscribe();
  }
  onFileChanged(event, i: number, model) {
    let myFile = this.file.toArray()[i];
    helperLegalizar.getImage(event, myFile, model);
  }
}
