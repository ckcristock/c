import { Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from '../../pages/rrhh/vacantes/job.service';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss'],
})
export class ApplicantComponent implements OnInit {
  @ViewChild('applicantM') applicantM;
  data: any = {};
  constructor(  private _job: JobService ) {}

  ngOnInit(): void {}

  show(data) {
    this.data = data;
    this.applicantM.show();
  }

  download(id) {
    this._job.download(id).subscribe((response: BlobPart) => {
      let blob = new Blob([response], { type: 'application/pdf' });
      let link = document.createElement('a');
      const filename = 'proyeccion_pdf';
      link.href = window.URL.createObjectURL(blob);
      link.download = `${filename}.pdf`;
      link.click();
     
    }),
      (error) => {
        console.log('Error downloading the file');
      
      },
      () => {
        console.info('File downloaded successfully');
      };
  }
}
