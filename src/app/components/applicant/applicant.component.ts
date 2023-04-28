import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { JobService } from '../../pages/rrhh/vacantes/job.service';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss'],
})
export class ApplicantComponent implements OnInit {
  @ViewChild('applicantM') applicantM;
  data: any = {};
  donwloading: boolean = false;
  constructor(
    private _job: JobService,
    private modalService: NgbModal,
    private _swal: SwalService

  ) { }

  ngOnInit(): void { }

  show(data) {
    this.data = data;
    this.openConfirm(this.applicantM)
    //this.applicantM.show();
  }

  public openConfirm(confirm) {
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'lg', scrollable: true })
  }

  download(id) {
    this.donwloading = true
    this._job.download(id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'proyeccion_pdf';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
      this.donwloading = false
    },
      (err: any) => {
        this._swal.show(
          {
            title: 'Error',
            text: "Ha ocurrido un error descargando este archivo",
            icon: "error",
            showCancel: false
          })
        this.donwloading = false
      },
      () => {
        this.donwloading = false
      }
    )
  }
}
