import { AfterContentChecked, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ConsecutivosService } from 'src/app/pages/ajustes/configuracion/consecutivos/consecutivos.service';
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
  @Input('action') action: string;
  form: FormGroup;
  loading: boolean;
  work_order;
  id: number;
  thirds: any[] = [];
  quotations: any[] = [];
  third_people: any[] = [];
  last_id: number;
  today = new Date();
  cities: any[] = [];
  datosCabecera = {
    Titulo: 'Nueva orden de producción',
    Fecha: new Date(),
    Codigo: '',
    CodigoFormato: ''
  }
  filterPart = { type_multiple: 'pieza' };
  filterSet = { type_multiple: 'conjunto' };
  filterService = { type_multiple: 'servicio' };
  constructor(
    private fb: FormBuilder,
    private _quotation: QuotationService,
    private _third_party: TercerosService,
    private _work_order: OrdenesProduccionService,
    private _city: MunicipiosService,
    public _texteditor: Texteditor2Service,
    private _swal: SwalService,
    public router: Router,
    public _consecutivos: ConsecutivosService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    })
    this.createForm();
    this.getData();
    if (this.id) {
      this.getWorkOrder(this.id)
    }
  }

  getConsecutivo() {
    this._consecutivos.getConsecutivo('work_orders').subscribe((r: any) => {
      this.datosCabecera.CodigoFormato = r.data.format_code
      this.form.patchValue({ format_code: this.datosCabecera.CodigoFormato })
      if (this.action != 'editar') {
        let con = this._consecutivos.construirConsecutivo(r.data);
        this.datosCabecera.Codigo = con
      }
    })
  }

  getData() {
    this.loading = true;
    this.getConsecutivo();
    this._quotation.getAllQuotations().subscribe((res: any) => {
      this.quotations = res.data
    })
    this._third_party.getClient().subscribe((res: any) => {
      this.thirds = res.data
    })
    this._city.getAllMunicipalities().subscribe((res: any) => {
      this.cities = res.data
      this.loading = false
    })
  }

  getWorkOrder(id) {
    this.loading = true
    this._work_order.getWorkOrder(id).subscribe((res: any) => {
      this.work_order = res.data;
      this.loading = false
      this.form.patchValue({
        id: this.action == 'edit' ? res.data.id : '',
        purchase_order: this.work_order.purchase_order,
        name: this.work_order.name,
        type: this.work_order.type,
        third_party_id: this.work_order.third_party,
        expected_delivery_date: this.work_order.expected_delivery_date,
        municipality_id: this.work_order.city,
        observations: this.work_order.observations,
        third_party_person_id: this.work_order.third_party_person,
        description: this.work_order.description,
        technical_requirements: this.work_order.technical_requirements,
        legal_requirements: this.work_order.legal_requirements,
        date: this.action == 'edit' ? this.work_order.date : new Date(),
      });
      if (this.action == 'edit') {
        this.form.patchValue({
          code: this.work_order.code
        })
        this.datosCabecera.Codigo = this.work_order.code
      }
    })
  }

  createForm() {
    this.form = this.fb.group({
      id: [''],
      code: ['', [Validators.required, Validators.maxLength(250)]],
      name: ['', [Validators.required, Validators.maxLength(250)]],
      purchase_order: ['', [Validators.required, Validators.maxLength(250)]],
      class: ['Repuesto', Validators.required],
      type: ['V', Validators.required],
      expected_delivery_date: ['', Validators.required],
      third_party_id: ['', Validators.required],
      municipality_id: ['', Validators.required],
      third_party_person_id: ['', Validators.required],
      observations: ['', Validators.maxLength(65535)],
      format_code: ['', Validators.maxLength(250)],
      description: ['', Validators.maxLength(4294967295)],
      technical_requirements: ['', Validators.maxLength(4294967295)],
      legal_requirements: ['', Validators.maxLength(4294967295)],
    });
    const classFormControl = this.form.get('class');
    const third_party_id = this.form.get('third_party_id');
    classFormControl.valueChanges.subscribe(value => {
      if (value == 'Interna') {
        this.form.controls.third_party_id.disable();
        this.form.controls.third_party_person_id.disable();
      } else {
        this.form.controls.third_party_id.enable();
        this.form.controls.third_party_person_id.enable();
      }
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
        title: '¿Estás seguro(a)?',
        text: 'Vamos a guardar esta orden de producción.'
      }).then(res => {
        if (res.isConfirmed) {
          this.form.patchValue({
            municipality_id: this.form.controls.municipality_id?.value.value,
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
      this._swal.incompleteError();
    }

  }
}
