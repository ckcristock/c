import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuotationService } from '../quotation.service';
import { Permissions } from 'src/app/core/interfaces/permissions-interface';
import { PermissionService } from 'src/app/core/services/permission.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';

@Component({
  selector: 'app-view-quotation',
  templateUrl: './view-quotation.component.html',
  styleUrls: ['./view-quotation.component.scss']
})
export class ViewQuotationComponent implements OnInit {
  @ViewChild('printPDF') printPDF: ElementRef
  id: number;
  quotation: any;
  loading: boolean;
  creator: any;
  approve: any;
  public headerData: any = {
    Titulo: 'Cotización',
    Codigo: '',
    Fecha: '',
    CodigoFormato: ''
  }
  permission: Permissions = {
    menu: 'Cotizaciones',
    permissions: {
      show: true,
      approve: true,
    }
  };
  constructor(
    private route: ActivatedRoute,
    private _quotation: QuotationService,
    private _permission: PermissionService,
    private _swal: SwalService
  ) {
    this.permission = this._permission.validatePermissions(this.permission)
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getQuotation(this.id)
    })
  }

  getQuotation(id) {
    this.loading = true;
    this._quotation.getQuotation(id).subscribe((res: any) => {
      this.quotation = res.data;
      this.headerData.Codigo = res.data.code;
      this.headerData.Fecha = res.data.created_at;
      this.headerData.CodigoFormato = res.data.format_code;
      this.loading = false;
      this.creator = res?.data?.activities?.find(x => x?.status == 'Creación')?.person;
      this.approve = res?.data?.activities?.filter(x => x?.status == 'Aprobación')[0]?.person
    })
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
        this._quotation.updateQuotation(data, id).subscribe((res: any) => {
          this._swal.show({
            icon: 'success',
            text: '',
            title: res.data,
            showCancel: false,
            timer: 1000
          })
          this.getQuotation(id);
        })
      }
    })
  }

  donwloading = false;
  download() {
    this.donwloading = true;
    this._quotation.download(this.id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'cotización' + this.id;
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      this.donwloading = false;
    }),
      (error) => {
        this.donwloading = false;
      },
      () => {
        this.donwloading = false;
      };
  }
}
