import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { MunicipiosService } from 'src/app/pages/ajustes/configuracion/departamentos-municipios/municipios/municipios.service';
import { SwalService } from 'src/app/pages/ajustes/informacion-base/services/swal.service';
import { Texteditor2Service } from 'src/app/pages/ajustes/informacion-base/services/texteditor2.service';
import { QuotationService } from 'src/app/pages/crm/cotizacion/quotation.service';
import { TercerosService } from 'src/app/pages/crm/terceros/terceros.service';
import { OrdenesProduccionService } from '../../services/ordenes-produccion.service';

@Component({
  selector: 'app-crear-orden-produccion',
  templateUrl: './crear-orden-produccion.component.html',
  styleUrls: ['./crear-orden-produccion.component.scss']
})
export class CrearOrdenProduccionComponent implements OnInit {
  form: FormGroup;
  thirds: any[] = [];
  quotations: any[] = [];
  third_people: any[] = [];
  last_id: number;
  cities: any[] = [];
  datosCabecera = {
    Titulo: 'Nueva orden de producción',
    Fecha: new Date(),
    Codigo: ''
  }
  constructor(
    private fb: FormBuilder,
    private _quotation: QuotationService,
    private _third_party: TercerosService,
    private _work_order: OrdenesProduccionService,
    private _city: MunicipiosService,
    public _texteditor: Texteditor2Service,
    private _swal: SwalService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getData();
  }

  getData() {
    this._work_order.getLastId().subscribe((res: any) => {
      this.datosCabecera.Codigo = 'O.P' + (res.data.id + 1)
      this.form.patchValue({
        code: this.datosCabecera.Codigo
      })
    })
    this._quotation.getAllQuotations().subscribe((res: any) => {
      this.quotations = res.data
    })
    this._third_party.getClient().subscribe((res: any) => {
      this.thirds = res.data
    })
    this._city.getAllMunicipalities().subscribe((res: any) => {
      this.cities = res.data
    })
  }

  createForm() {
    this.form = this.fb.group({
      purchase_order: ['', Validators.required],
      type: ['', Validators.required],
      third_party_id: ['', Validators.required],
      quotation_id: ['', Validators.required],
      delivery_date: ['', Validators.required],
      municipality_id: ['', Validators.required],
      observation: ['', Validators.required],
      third_party_person_id: ['', Validators.required],
      description: ['', Validators.required],
      technical_requirements: ['', Validators.required],
      legal_requirements: ['', Validators.required],
      date: [new Date(), Validators.required],
      code: ['', Validators.required],
    })
    const type = this.form.get('type')
    const third_party_id = this.form.get('third_party_id')
    type.valueChanges.subscribe(q => {
      q == 'externa' ? this.form.controls.third_party_id.enable() : this.form.controls.third_party_id.disable()
    })
    third_party_id.valueChanges.subscribe(q => {
      if (q && q.value) {
        this.getThirdPerson(q?.value)
      }
    })
  }

  getThirdPerson(third_id) {
    this._third_party.getThirdPartyPersonForThird(third_id).subscribe((res: any) => {
      this.third_people = res.data
    })
  }

  search_tercero: OperatorFunction<string, readonly { text; nit }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : this.thirds.filter((v) => v.text.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );
  formatter_tercero = (x: { text: string }) => x.text;

  search_quotation: OperatorFunction<string, readonly { name; id }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : this.quotations.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );
  formatter_quotation = (x: { name: string }) => x.name;

  search_city: OperatorFunction<string, readonly { text; value }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : this.cities.filter((v) => v.text.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );
  formatter_city = (x: { text: string }) => x.text;

  search_person_id: OperatorFunction<string, readonly { name; id }[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) =>
        term === ''
          ? []
          : this.third_people.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10),
      ),
    );
  formatter_person_id = (x: { name: string }) => x.name;

  save() {
    if (this.form.valid) {
      this._swal.show({
        icon: 'question',
        title: '¿Está seguro(a)?',
        text: 'Vamos a guardar esta orden de producción.'
      }).then(res => {
        if (res.isConfirmed) {
          this.form.patchValue({
            municipality_id: this.form.controls.municipality_id?.value.value,
            quotation_id: this.form.controls.quotation_id?.value.id,
            third_party_id: this.form.controls.third_party_id?.value.value,
            third_party_person_id: this.form.controls.third_party_person_id?.value.id,
          })
          this._work_order.saveWorkOrder(this.form.value).subscribe(r => {
            this._swal.show({
              icon: 'success',
              title: 'Correcto',
              text: 'Hemos guardado la orden de producción correctamente.',
              showCancel: false,
              timer: 100
            })
            this.router.navigate(['/manufactura/ordenes-produccion'])
          })
        }
      })
    } else {
      this._swal.show({
        icon: 'error',
        title: 'ERROR',
        text: 'Completa todos los campos y vuelve a intentarlo',
        showCancel: false
      })
    }

  }
}
