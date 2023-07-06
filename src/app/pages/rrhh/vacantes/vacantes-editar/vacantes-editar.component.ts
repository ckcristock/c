import { Component, OnInit } from '@angular/core';
import { JobService } from '../job.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vacantes-editar',
  templateUrl: './vacantes-editar.component.html',
  styleUrls: ['./vacantes-editar.component.scss']
})
export class VacantesEditarComponent implements OnInit {
  id: any;
  job: any[] = [];
  loading: boolean;
  constructor(
    private _job: JobService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params?.get('id');
      this.getJob(params?.get('id'));
    })
  }

  getJob(id: any) {
    this.loading = true;
    this._job.getJob(id).subscribe((r: any) => {
      this.job = r.data;
      this.loading = false;
    })
  }

}
