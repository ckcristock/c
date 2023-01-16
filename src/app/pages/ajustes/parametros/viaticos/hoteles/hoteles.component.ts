import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelesService } from './hoteles.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { MatAccordion } from '@angular/material/expansion';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-hoteles',
  templateUrl: './hoteles.component.html',
  styleUrls: ['./hoteles.component.scss']
})
export class HotelesComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  matPanel = false;
  filteredOptions: Observable<string[]>;
  openClose() {
    if (this.matPanel == false) {
      this.accordion.openAll()
      this.matPanel = true;
    } else {
      this.accordion.closeAll()
      this.matPanel = false;
    }
  }
  loading: boolean = false;
  form: FormGroup;
  cities: any[] = [];
  hotels: any[] = [];
  hotel: any = {};
  title: any = '';
  pagination = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro = {
    tipo: ''
  }
  accommodations: any = ''

  constructor(
    private fb: FormBuilder,
    private _hoteles: HotelesService,
    private _swal: SwalService,
    private _validators: ValidatorsService,
    private modalService: NgbModal,
    private _modal: ModalService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getCities();
    this.getHotels();

    /* this.filteredOptions = this.form.get('city_id').valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : (<any>value).text),
        map(name => name ? this._filter(name) : this.cities.slice())
      ); */
  }

  /* private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return this.cities.filter(option => option.text.toLowerCase().indexOf(filterValue) === 0);

  }

  displayFn(country: any): string {
    return country ? country : undefined;
  } */


  closeResult = '';
  public openConfirm(confirm, titulo) {
    this.title = titulo
    this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any) {
    this.form.reset();

  }

  getAccommodation () {
    this._hoteles.getAccommodation()
      .subscribe((res:any)=>{
        if(res.status){
          this.accommodations = res.data
        }else{
          console.log('error', res.err);
        }
      })
  }

  createForm() {
    this.form = this.fb.group({
      id: [this.hotel.id],
      type: ['', Validators.required],
      name: ['', Validators.required],
      city_id: ['', Validators.required],
      landline: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      simple_rate: ['', Validators.required],
      double_rate: ['', Validators.required],
      breakfast: ['', Validators.required],
      accommodation: ['', Validators.required]
    })
  }

  getCities() {
    this._hoteles.getCities().subscribe((r: any) => {
      this.cities = r.data;
    });
  }

  getHotels(page = 1) {
    this.pagination.page = page;
    let params = {
      ...this.pagination, ...this.filtro
    }
    this.loading = true;
    this._hoteles.getHotels(params).subscribe((r: any) => {
      this.hotels = r.data.data;
      this.pagination.collectionSize = r.data.total;
      this.loading = false;
    });
  }

  getHotel(hotel) {
    this.hotel = { ...hotel };
    this.form.patchValue({
      id: this.hotel.id,
      type: this.hotel.type,
      name: this.hotel.name,
      city_id: this.hotel.city_id,
      landline: this.hotel.landline,
      address: this.hotel.address,
      phone: this.hotel.phone,
      simple_rate: this.hotel.simple_rate,
      double_rate: this.hotel.double_rate,
      breakfast: this.hotel.breakfast,
      accommodation: this.hotel.accommodation
    })
  }

  save() {
    //console.log(this.form.get('city_id').value)
    /* this.form.patchValue({
      city_id: this.form.get('city_id').value.value
    }) */
    //console.log(this.form.value)
    this._hoteles.createHotel(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
      console.log(r)
      this.getHotels();
      this.form.reset();
      this._swal.show({
        icon: 'success',
        title: r.data,
        text: '',
        timer: 1000,
        showCancel: false
      })
    })
  }

  openValues(content) {
    console.log(content)
    this.getAccommodation()
    this._modal.open(content, 'md')
  }

}
