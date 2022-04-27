import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MedidasService } from './medidas.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-medidas',
  templateUrl: './medidas.component.html',
  styleUrls: ['./medidas.component.scss']
})
export class MedidasComponent implements OnInit {
  @ViewChild('modal') modal:any;
  form: FormGroup;
  loading:boolean = false;
  title:any = '';
  measures:any[] = [];
  measure:any = {};
  pagination = {
    page: 1,
    pageSize: 10,
    collectionSize: 0
  }

  constructor( 
                private fb: FormBuilder,
                private _medidas: MedidasService,
                private _swal: SwalService,
                private modalService: NgbModal,
              ) { }

  ngOnInit(): void {
    this.createform();
    this.getMeasures();
  }

  createform(){
    this.form = this.fb.group({
      id: [this.measure.id],
      name: [''],
      measure: ['']
    })
  }
  closeResult = '';
public openConfirm(confirm, titulo){
  this.title = titulo;
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
private getDismissReason(reason: any): string {
  this.form.reset();
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  openModal(){
    this.modal.show();
    
  }

  getMeasure( measure ){
    this.measure = {...measure};
    //this.title = 'Actualizar medida';
    this.form.patchValue({
      id: this.measure.id,
      name: this.measure.name,
      measure: this.measure.measure
    })
  }

  getMeasures( page = 1 ){
    this.pagination.page = page;
    this.loading = true;
    this._medidas.getMeasures(this.pagination).subscribe((r:any) => {
      this.measures = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    })
  }

  save(){
    this._medidas.save(this.form.value).subscribe((r:any) => {
      this.modalService.dismissAll(); 
      this.form.reset();
      this.getMeasures();
      this._swal.show({
        icon: 'success',
        title: r.data.title,
        text: r.data.text,
        showCancel: false
      })
    })
  }

}
