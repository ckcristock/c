import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { IngenieriaService } from '../../services/ingenieria.service';
import { OrdenesProduccionService } from '../../services/ordenes-produccion.service';

@Component({
  selector: 'app-ver-ingenieria',
  templateUrl: './ver-ingenieria.component.html',
  styleUrls: ['./ver-ingenieria.component.scss']
})
export class VerIngenieriaComponent implements OnInit, OnDestroy {
  work_order_id: string;
  loading: boolean;
  work_order: any;
  days;
  hours;
  minutes;
  seconds;
  interval;
  person_id;
  constructor(
    private route: ActivatedRoute,
    private _work_order_engineering: IngenieriaService,
    private _user: UserService
  ) {
    this.person_id = _user.user.person.id
   }
  ngOnDestroy(): void {
    clearInterval(this.interval)
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.work_order_id = params.get('id');
      this.getWorkOrder();
    })
  }

  getWorkOrder() {
    this.loading = true
    this._work_order_engineering.getWorkOrder(this.work_order_id).subscribe((res: any) => {
      this.work_order = res.data;
      this.loading = false;
      if (this.work_order.status == 'proceso') {
        this.interval = setInterval(() => {
          this.getTime(this.work_order);
        }, 1000)
      }
    })
  }

  getTime(item) {
    if (item.start_time && !item.end_time) {
      let now = new Date();
      let start_time = new Date(item.start_time);
      return this.difference(now, start_time)
    } else if (item.start_time && item.end_time) {
      let end_time = new Date(item.end_time);
      let start_time = new Date(item.start_time);
      return this.difference(end_time, start_time)
    } else {
      return 'No aplica'
    }
  }

  difference(d1, d2) {
    this.seconds = Math.floor((d1.getTime() - (d2.getTime())) / 1000);
    this.minutes = Math.floor(this.seconds / 60);
    this.hours = Math.floor(this.minutes / 60);
    this.days = Math.floor(this.hours / 24);
    this.hours = this.hours - (this.days * 24);
    this.minutes = this.minutes - (this.days * 24 * 60) - (this.hours * 60);
    this.seconds = this.seconds - (this.days * 24 * 60 * 60) - (this.hours * 60 * 60) - (this.minutes * 60);
  }

}
