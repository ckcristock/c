import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material';
import { ModalService } from 'src/app/core/services/modal.service';
import { SwalService } from '../../ajustes/informacion-base/services/swal.service';
import { QuotationService } from './quotation.service';

@Component({
  selector: 'app-cotizacion',
  templateUrl: './cotizacion.component.html',
  styleUrls: ['./cotizacion.component.scss']
})

export class CotizacionComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  quotations: any;
  quotations_cards: any;
  quotation: any;
  loading: boolean;
  loading_cards: boolean;
  view_list: boolean;
  count_pendiente = 0;
  count_aprobada = 0;
  count_no_aprobada = 0;
  count_anulada = 0;
  filters = {
    date: '',
    city: '',
    code: '',
    client: '',
    description: '',
    status: '',
  }
  pagination: any = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }
  constructor(
    private _quotations: QuotationService,
    private _swal: SwalService,
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
    this.getQuotation();
    this.getQuotationsCards();
  }

  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }

  openList(id) {
    this.view_list = true;
    this.quotation = this.quotations.find(q => q.id === id);
    this.quotations.forEach(q => q.selected = (q.id === id));
  }

  closeList() {
    this.view_list = false;
    this.quotations.forEach(q => q.selected = false);
  }

  updateStatus(status, id) {
    this._swal.show({
      icon: 'question',
      title: '¿Estás seguro(a)?',
      showCancel: true,
      text: ''
    }).then((r) => {
      if (r.isConfirmed) {
        let data = {
          status: status
        }
        this._quotations.updateQuotation(data, id).subscribe((res: any) => {
          this._swal.show({
            icon: 'success',
            text: '',
            title: res.data,
            showCancel: false,
            timer: 1000
          })
          this.getQuotation(1, id);

          this.getQuotationsCards();
        })
      }
    })


  }

  getQuotation(page = 1, id = null) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filters
    }
    this.loading = true;
    this._quotations.getQuotations(params)
      .subscribe((res: any) => {
        this.quotations = res.data.data;
        this.pagination.collectionSize = res.data.total;
        this.loading = false;
        if (this.view_list) {
          this.openList(id)
        }

      })

  }

  getQuotationsCards() {
    this.count_pendiente = 0;
    this.count_anulada = 0;
    this.count_aprobada = 0;
    this.count_no_aprobada = 0;
    this.loading_cards = true;
    this._quotations.getAllQuotations()
      .subscribe((res: any) => {
        this.loading_cards = false;
        this.quotations_cards = res.data
        this.quotations_cards.forEach(element => {
          if (element.status == 'Pendiente') {
            this.count_pendiente++;
          } else if (element.status == 'Aprobada') {
            this.count_aprobada++
          } else if (element.status == 'No aprobada') {
            this.count_no_aprobada++
          } else if (element.status == 'Anulada') {
            this.count_anulada++
          }
        });
      })
  }

  comments_quotation(content, id) {
    this._modal.open(content)
  }

}
