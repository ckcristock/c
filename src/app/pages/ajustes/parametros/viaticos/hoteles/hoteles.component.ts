import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelesService } from './hoteles.service';
import { SwalService } from '../../../informacion-base/services/swal.service';
import { MatAccordion } from '@angular/material/expansion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from '../../../informacion-base/services/reactive-validation/validators.service';
import { Observable } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { AccommodationsComponent } from './accommodations/accommodations.component';
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-hoteles',
  templateUrl: './hoteles.component.html',
  styleUrls: ['./hoteles.component.scss']
})
export class HotelesComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(AccommodationsComponent) childAlojamiento: AccommodationsComponent;
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
  paginationHotel = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  paginationAccomodations = {
    page: 1,
    pageSize: 5,
    collectionSize: 0
  }
  filtro = {
    tipo: ''
  }
  accommodationsPaginate: any = {}
  accommodations: any[] = []
  masksMoney = consts

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
    this.getAccommodation();

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
    if (titulo == 'Ver hotel') {
      this._modal.open(
        confirm,
        'md',
        true
      );
    }else {
      this.modalService.open(confirm, { ariaLabelledBy: 'modal-basic-title', size: 'md', scrollable: true }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  private getDismissReason(reason: any) {
    this.form.reset();
    this.form.removeControl('alojamientos')
    this.form.setControl('alojamientos', this.fb.array([]))
  }

  getAccommodation(page = 1) {
    this.paginationAccomodations.page = page;
    let params = {
      ...this.paginationAccomodations, ...this.filtro
    }
    this._hoteles.getAccommodationPaginate(params)
      .subscribe((res: any) => {
        if (res.status) {
          this.accommodationsPaginate = res.data.data
          this.paginationAccomodations.collectionSize = res.data.total
        } else {
          console.log('error', res.err);
        }
      })
    this._hoteles.getAccommodation()
      .subscribe((res: any) => {
        if (res.status) {
          this.accommodations = res.data
        } else {
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
      breakfast: ['', Validators.required],
      accommodation: ['', Validators.required],
      alojamientos: this.fb.array([])
    })
    const accommodation = this.form.get('accommodation')
    accommodation.valueChanges.subscribe(r => {

    })
  }

  /**
   * se recibe solo el evento, porque el objeto como tal no señala si fue checked o no
   */
  selectAccommodation(e) {
    if (e._selected) {
      let subItems = this.form.get('alojamientos') as FormArray
      let elem = this.accommodations.find(ele=>ele.id==e.value)
      subItems.push(this.patchValues(elem.id,elem.name, null))
    } else {
      this.form.controls.alojamientos.value.forEach((element, index) => {
        if (element.id == e.value) {
          let a = this.form.get('alojamientos') as FormArray;
          a.removeAt(index)
        }
      });
    }
  }

  patchValues(id, name, price) {
    return this.fb.group({
      id: [id],
      name: name,
      price: [price ? price : ''],
    })
  }

  getCities() {
    this._hoteles.getCities().subscribe((r: any) => {
      this.cities = r.data;
    });
  }

  getHotels(page = 1) {
    this.paginationHotel.page = page;
    let params = {
      ...this.paginationHotel, ...this.filtro
    }
    this.loading = true;
    this._hoteles.getHotels(params).subscribe((r: any) => {
      this.hotels = r.data.data;
      this.paginationHotel.collectionSize = r.data.total;
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
      accommodation: this.hotel.accommodations.map((x: any) => x.id),
    })
    this.hotel.accommodations.forEach(element => {
      let subItems = this.form.get('alojamientos') as FormArray
      subItems.push(this.patchValues(element.id, element.name, element.pivot.price))
    });
  }

  save() {
    this._hoteles.createHotel(this.form.value).subscribe((r: any) => {
      this.modalService.dismissAll();
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

  //el event está enviando el this.form del hijo
  saveAccommodation($event) {
    this._hoteles.createUpdateAccomodation($event.value)
      .subscribe((res: any) => {
        if (res.status) {
          this._swal.show({
            title: 'Alojamiento',
            text: res.data,
            icon: 'success',
            showCancel: false
          })
          this.getAccommodation();
          $event.reset();
        } else {
          this._swal.show({
            title: 'Alojamiento',
            text: res.err,
            icon: 'error',
            showCancel: false
          })
        }
      })
  }

  deleteAccommodation($event) {
    if ($event.action == 'Inactivo') {
      this._hoteles.deleteAccommodation($event.value.id)
        .subscribe((res: any) => {
          if (res.status) {
            this._swal.show({
              title: 'Alojamiento',
              text: res.data,
              icon: 'success',
              showCancel: false
            })
            this.getAccommodation();
          } else {
            this._swal.show({
              title: 'Alojamiento',
              text: res.err,
              icon: 'error',
              showCancel: false
            })
          }
        })
    } else {
      this._hoteles.restoreAccommodation($event.value)
        .subscribe((res: any) => {
          if (res.status) {
            this._swal.show({
              title: 'Alojamiento',
              text: res.data,
              icon: 'success',
              showCancel: false
            })
            this.getAccommodation();
          } else {
            this._swal.show({
              title: 'Alojamiento',
              text: res.err,
              icon: 'error',
              showCancel: false
            })
          }
        })
    }
  }

  openValues(content) {
    this._modal.open(content, 'md')
  }

}
