import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DatePipe, PlatformLocation } from '@angular/common';
import { ApusService } from 'src/app/pages/crm/apus/apus.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';
import { PageEvent } from '@angular/material';
import { PaginatorService } from 'src/app/core/services/paginator.service';

@Component({
  selector: 'app-get-apus',
  templateUrl: './get-apus.component.html',
  styleUrls: ['./get-apus.component.scss']
})
export class GetApusComponent implements OnInit {
  @Input('filter') filter: any;
  @ViewChild('modal') modal: any;
  @Output('sendApus') sendApus = new EventEmitter()
  loading = false;
  apus: any[] = [];
  state: any[] = [];
  datePipe = new DatePipe('es-CO');
  date: any;
  form_filters: FormGroup;
  paginationMaterial: any;
  pagination = {
    page: 1,
    pageSize: 100,
  }
  public href: string = "";
  closeResult = '';
  multiple: boolean = true;

  constructor(
    private platformLocation: PlatformLocation,
    private _apu: ApusService,
    private _swal: SwalService,
    private _modal: ModalService,
    private fb: FormBuilder,
    private _paginator: PaginatorService,
  ) { }
  ngOnInit(): void {
    this.href = (this.platformLocation as any).location.origin;
  }

  openConfirm(multiple = true) {
    this.createFormFilters();
    this.loading = true;
    this.state = []
    this.multiple = multiple;
    this.getApus();
    this._modal.open(this.modal, 'xl');
  }

  selectedDate(fecha) {
    if (fecha.value) {
      this.form_filters.patchValue({
        date_one: this.datePipe.transform(fecha.value.begin._d, 'yyyy-MM-dd'),
        date_two: this.datePipe.transform(fecha.value.end._d, 'yyyy-MM-dd')
      })
    } else {
      this.form_filters.patchValue({
        date_one: '',
        date_two: ''
      })
    }
    this.getApus();
  }

  createFormFilters() {
    this.form_filters = this.fb.group({
      code: '',
      date_one: '',
      date_two: '',
      name: '',
      city: '',
      client: '',
      line: '',
      type: '',
      description: '',
      set_name: '',
      machine_name: ''
    })
    this.form_filters.valueChanges.pipe(
      debounceTime(500),
    ).subscribe(r => {
      this.getApus();
    })
  }

  handlePageEvent(event: PageEvent) {
    this._paginator.handlePageEvent(event, this.pagination)
    this.getApus()
  }

  getApus() {
    this.loading = true;
    let params = {
      ...this.pagination,
      ...this.filter,
      ...this.form_filters.value
    }
    this._apu.getApus(params).subscribe((r: any) => {
      this.apus = r.data.data
      this.apus.forEach(apu => {
        this.state.forEach(sta => {
          if (sta.apu_id == apu.apu_id && sta.type == apu.type) {
            apu.selected = true
          }
        });
      });
      this.paginationMaterial = r.data
      if (this.paginationMaterial.last_page < this.pagination.page) {
        this.paginationMaterial.current_page = 1
        this.pagination.page = 1
        this.getApus()
      }
      this.loading = false;
    })
  }

  openNewTab(type, id) {
    let uri = ''
    switch (type) {
      case 'P':
        uri = '/crm/apu/ver-apu-pieza';
        break;
      case 'C':
        uri = '/crm/apu/ver-apu-conjunto';
        break;
      case 'S':
        uri = '/crm/apu/ver-apu-pieza';
        break;
      default:
        break;
    }
    const url = this.href + `${uri}/${id}`;

    window.open(url, '_blank');
  }

  /* setState(apu) {
    apu.selected = !apu.selected
    const index = this.state.findIndex(x => (x.apu_id == apu.apu_id && x.type == apu.type))
    if (index >= 0 && !apu.selected) {
      this.state.splice(index, 1)
    } else {
      this.state.push(apu)
    }
  } */

  setState(apu, event) {
    if (apu.selected && !this.multiple && this.state.length === 1) {
      apu.selected = false
      this._swal.show({
        icon: 'error',
        title: 'Error',
        text: 'Solo puedes seleccionar un APU',
        showCancel: false
      });
    } else {
      const index = this.state.findIndex(x => (x.apu_id === apu.apu_id && x.type === apu.type));
      if (apu.selected) {
        if (!this.multiple) {
          this.state.forEach(item => item.selected = false);
        }
        if (index === -1) {
          this.state.push(apu);
          apu.selected = true
        }
      } else {
        if (index !== -1) {
          this.state.splice(index, 1);
          apu.selected = false
        }
      }
    }
    event.checked = apu.selected
    event.source._checked = apu.selected
  }

  send() {
    this.sendApus.emit(this.state)
    this._modal.close();
  }
}
