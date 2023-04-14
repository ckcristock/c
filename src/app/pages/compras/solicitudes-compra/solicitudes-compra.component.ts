import { Component, OnInit, ViewChild } from '@angular/core';
import { SolicitudesCompraService } from './solicitudes-compra.service';
import { PaginatorService } from 'src/app/core/services/paginator.service';
import { MatAccordion, PageEvent } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-solicitudes-compra',
  templateUrl: './solicitudes-compra.component.html',
  styleUrls: ['./solicitudes-compra.component.scss']
})
export class SolicitudesCompraComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  solicitudesCompra: any[] = [];
  
  loading = false;
  paginationMaterial: any;
  pagination: any = {
    page: 1,
    pageSize: 10,
  }
  matPanel: boolean;
  formFilters: FormGroup;

  constructor(
    private _solicitudesCompra: SolicitudesCompraService,
    private _paginator: PaginatorService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  this.getPurchaseRequest();
  this.createFormFilters();
  }

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination)
    this.getPurchaseRequest()
  }


  getPurchaseRequest(){
    this.loading = true;
    let params = {
      ...this.pagination,
      /* ...this.formFilters.value */
    }
    this._solicitudesCompra.getPurchaseRequest(params).subscribe((res: any) =>{
      this.solicitudesCompra= res.data.data;
      this.loading = false;
      this.paginationMaterial = res.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getPurchaseRequest()
      }
    });
  }

  openClose() {
    this.matPanel = !this.matPanel;
    this.matPanel ? this.accordion.openAll() : this.accordion.closeAll();
  }

  createFormFilters() {
    this.formFilters =this.fb.group({
      purchase_request_id: '',
      purchase_request_date: '',
      status: '',
      funcionario: '',
    })
  } 
  }

