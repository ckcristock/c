import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-eps',
  templateUrl: './eps.component.html',
  styleUrls: ['./eps.component.scss']
})
export class EpsComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required])
  });
  pagination = {
    pageSize: 5,
    page: 1,
    collectionSize: 0
  }

  constructor() { }

  ngOnInit(): void {
  }

  createEps(){

  }

}
