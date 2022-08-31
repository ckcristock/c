import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { TercerosService } from '../terceros.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { functionsUtils } from '../../../../core/utils/functionsUtils';
import { ValidatorsService } from '../../../ajustes/informacion-base/services/reactive-validation/validators.service';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-crear-terceros',
  templateUrl: './crear-terceros.component.html',
  styleUrls: ['./crear-terceros.component.scss'],
})
export class CrearTercerosComponent implements OnInit {

  @ViewChild('stepper') stepper: MatHorizontalStepper;
  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }
  goBack() {
    this.stepper.previous();
  }

  goForward() {
    this.stepper.next();
  }

  form: FormGroup;
  //floatLabelControl = new FormControl('nacional');
  date: Date = new Date();
  id: number;
  third: any;
  zones: any[] = [];
  title: string = '';
  municipalities: any[] = [];
  countries: any[] = [];
  departments: any[] = [];
  winnigLists: any[] = [];
  ciiuCodes: any[] = [];
  ciiuCodesJson: any[] = [];
  show: boolean;
  address: any[] = [];
  accountPlan: any[] = [];
  documentTypes: any[] = [];
  regimes: any[] = [];
  fiscalResponsibility: any[] = [];
  fields: any[] = [];
  newField: any = '';
  selected: any;
  parametro: any;
  previsualizacionFoto: any;
  previsualizacionRut: any;
  retePercentage: any = {
    reteica: 0,
    reteiva: 0,
    retefuente: 0
  }
  pagos: any = [
    { clave: 'De Contado', valor: 1 },
    { clave: '30 Días', valor: 2 },
    { clave: '60 Días', valor: 3 },
    { clave: '90 Días', valor: 4 },
    { clave: '120 Días', valor: 5 },
  ];
  file: any = '';
  fileString: any = '';
  rutString: any = '';
  rutFile: any = '';
  typeRut: any = '';
  typeImage: any = '';
  field: any;
  searchActividad: any
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private _terceros: TercerosService,
    public router: Router,
    private _swal: SwalService,
    private actRoute: ActivatedRoute,
    private _validators: ValidatorsService,
    private sanitizer: DomSanitizer
  ) { }

  ciiu: any[] = [];
  ngOnInit(): void {
    //this.getCiiu();
    this.createForm();
    this.getZones();
    this.getDepartments();
    //this.getMunicipalitites();
    this.getCountries();
    this.id = this.actRoute.snapshot.params.id;
    this.getWinningLists();
    this.getCiiuCodeLists();
    this.getDianAddress();
    this.getAccountPlan();
    this.getTypeDocuments();
    this.getTitle();
    this.getFields();
    this.getRegimeType();
    this.getFiscalResponsibility();
    
  }



  regresar() {
    this.location.back();
  }

  createForm() {
    this.form = this.fb.group({
      /* Inicia Datos Básicos */
      id: [''],
      location: ['', this._validators.required],
      document_type: ['', this._validators.required],
      nit: ['', this._validators.required],
      person_type: ['', this._validators.required],
      third_party_type: ['', this._validators.required],
      first_name: ['', this._validators.required],
      second_name: [''],
      first_surname: ['', this._validators.required],
      second_surname: [''],
      social_reason: ['', this._validators.required],
      tradename: [''],
      dian_address: ['', this._validators.required],
      address_one: [''],
      address_two: [''],
      address_three: [''],
      address_four: [''],
      cod_dian_address: ['', this._validators.required],
      landline: ['', this._validators.required],
      cell_phone: [''],
      email: ['', [this._validators.required, Validators.email]],
      zone_id: [''],
      department_id: [''],
      municipality_id: ['', this._validators.required],
      country_id: ['', this._validators.required],
      city_id: ['', this._validators.required],
      image: [''],
      /* Termina Datos Básicos */
      /* Inicia Datos Comerciales */
      //winning_list_id: [''],
      //apply_iva: [''],
      contact_payments: [''],
      phone_payments: [''],
      email_payments: ['', Validators.email],
      regime: [''],
      encourage_profit: [''],
      ciiu_code_id: [],
      withholding_agent: [''],
      withholding_oninvoice: [''],
      reteica_type: [''],
      reteica_account_id: [''],
      reteica_percentage: [0],
      retefuente_account_id: [''],
      retefuente_percentage: [0],
      //g_contribut: [''],
      reteiva_account_id: [''],
      reteiva_percentage: [0],
      condition_payment: [''],
      assigned_space: [''],
      fiscal_responsibility: [''],
      discount_prompt_payment: [''],
      discount_days: [''],
      state: ['', this._validators.required],
      rut: [''],
      typeRut: [''],
      typeImage: [''],
      /* Termina Datos Comerciales */
      person: this.fb.array([])
    });
    this.valueChanges();
  }

  inputFormatListValue(value: any) {
    if (value.code)
      return value.code
    return value;
  }

  resultFormatListValue(value: any) {
    return value.code;
  }

  getRegimeType() {
    this._terceros.getRegimeType().subscribe((r: any) => {
      this.regimes = r.data;
    })
  }

  getFiscalResponsibility() {
    this._terceros.getFiscalResponsibility().subscribe((r: any) => {
      this.fiscalResponsibility = r.data;
    })
  }

  search: OperatorFunction<string, readonly { code }[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter((term) => term.length >= 3),
      map((term) =>
        this.accountPlan
          .filter((state) => new RegExp(term, 'mi').test(state.code))
          .slice(0, 10)
      )
    );

  personControl() {
    let group = this.fb.group({
      name: [''],
      n_document: [''],
      landline: [''],
      cell_phone: [''],
      email: [''],
      position: [''],
      observation: ['']
    });
    return group;
  }

  get personList() {
    return this.form.get('person') as FormArray;
  }

  createPerson() {
    let person = this.personList;
    person.push(this.personControl());
  }

  deletePerson(i) {
    let person = this.personList;
    person.removeAt(i);
  }

  locationCountry(){
    if (this.form.get('country_id').value == this.getColombia){
      this.form.patchValue({
        location: 'nacional'
      })
      this.form.get('municipality_id').enable();
      this.form.get('department_id').enable();
      this.form.get('city_id').disable();
    } else {
      this.form.patchValue({
        location: 'internacional'
      })
      this.form.get('municipality_id').disable();
      this.form.get('department_id').disable();
      this.form.get('city_id').enable();
    }
  }
  cities: any;
  getCities(){
    this._terceros.getCities(this.form.value.country_id).subscribe((r: any) => {
      this.cities = r.data;
    })
  }
  
  locationThird(){
    if (this.form.get('location').value == 'nacional') {
      this.form.patchValue({
        country_id: this.getColombia
      })
      this.form.get('country_id').disable();
    } else {
      this.form.get('country_id').enable();
    }    
  }

  personType() {
    let tipo = this.form.get('person_type').value;
    if (tipo == 'natural') {
      this.form.get('social_reason').disable();
      this.form.get('first_name').enable();
      this.form.get('second_name').enable();
      this.form.get('first_surname').enable();
      this.form.get('second_surname').enable();
    } else if (tipo == 'juridico') {
      this.form.get('first_name').disable();
      this.form.get('second_name').disable();
      this.form.get('first_surname').disable();
      this.form.get('second_surname').disable();
      this.form.get('social_reason').enable();
      this.form.patchValue({
        document_type: this.nitSelected
      })
    }
  }

  getFields() {
    this._terceros.getFields().subscribe((r: any) => {
      this.fields = r.data;
      this.fields.forEach((field: any) => {
        let field_name = field.name;
        this.field = field_name;
        this.form.addControl(field_name, this.fb.control(''));
        this.form.patchValue({
          field_name
        });
      });
      if (this.id) {
        this.getThirdParty();
      }
    })
  }

  getTitle() {
    if (this.actRoute.snapshot.params.id) {
      this.title = 'Editar tercero';
    } else {
      this.title = 'Nuevo tercero';
    }
  }

  getZones() {
    this._terceros.getZones().subscribe((r: any) => {
      this.zones = r.data;
    })
  }

  getDepartments() {
    this._terceros.getDepartments().subscribe((r: any) => {
      this.departments = r.data;
    })
  }
  getColombia: any
  getCountries() {
    this._terceros.getCountries().subscribe((r: any) => {
      this.countries = r.data;
      for (let i in this.countries) {
        if (this.countries[i].text == 'Colombia') {
          this.getColombia = this.countries[i].value
        }
      }
      this.form.patchValue({
        country_id: this.getColombia
      });
      this.locationCountry()      
      //console.log(this.getColombia)
    })
  }

  getMunicipalitites() {
    this._terceros.getMunicipalities(this.form.get('department_id').value).subscribe((r: any) => {
      this.municipalities = r.data;
    })
  }

  getWinningLists() {
    this._terceros.getWinningList().subscribe((r: any) => {
      this.winnigLists = r.data;
    })
  }

  getCiiuCodeLists() {
    this._terceros.getCiiuCodesList().subscribe((r: any) => {
      this.ciiuCodes = r.data;
      console.log(this.ciiuCodes)
    })
  }
  jsonCiiu: any[] = []
  getCiiu() {
    this._terceros.getCiiuCodes().subscribe((data: any) => {
      this.ciiuCodesJson = Object.entries(data);
      for (let i in this.ciiuCodesJson) {
        let aux: any[] = Object.entries(this.ciiuCodesJson[i][1].divisiones)
        for (let j in aux) {
          let aux2: any[] = Object.entries(aux[j][1].subdivisiones)
          for (let k in aux2) {
            let aux3: any[] = Object.entries(aux2[k][1].actividades)
            for (let l in aux3) {
              this.jsonCiiu.push({
                title: aux[j][1].titulo,
                subtitle: aux2[k][1].titulo,
                value: Number(aux3[l][0]),
                text: aux3[l][0] + ' - ' + aux3[l][1]
              })
            }
          }
        }
      }
      //console.log(this.jsonCiiu)
    })
  }

  getDianAddress() {
    this._terceros.getDianAddress().subscribe((r: any) => {
      this.address = r.data;
    })
  }

  getAccountPlan() {
    this._terceros.getAccountPlan().subscribe((r: any) => {
      this.accountPlan = r.data;
    })
  }
  nitSelected: any;
  getTypeDocuments() {
    this._terceros.getTypeDocuments().subscribe((r: any) => {
      this.documentTypes = r.data;
      for (let i in this.documentTypes) {
        if (this.documentTypes[i].code == 31) {
          this.nitSelected = this.documentTypes[i].value
        }
      }
    })
  }
  dv: any;
  validarDV(myNit) {
    if (this.nitSelected == this.form.get('document_type').value) {
      var vpri, x, y, z;
      myNit = myNit.replace(/\s/g, ""); 
      myNit = myNit.replace(/,/g, "");
      myNit = myNit.replace(/\./g, "");
      myNit = myNit.replace(/-/g, "");
      vpri = new Array(16);
      z = myNit.length;
      vpri[1] = 3;
      vpri[2] = 7;
      vpri[3] = 13;
      vpri[4] = 17;
      vpri[5] = 19;
      vpri[6] = 23;
      vpri[7] = 29;
      vpri[8] = 37;
      vpri[9] = 41;
      vpri[10] = 43;
      vpri[11] = 47;
      vpri[12] = 53;
      vpri[13] = 59;
      vpri[14] = 67;
      vpri[15] = 71;
      x = 0;
      y = 0;
      for (var i = 0; i < z; i++) {
        y = (myNit.substr(i, 1));
        x += (y * vpri[z - i]);
      }
      y = x % 11;
      console.log((y > 1) ? 11 - y : y);
      this.dv = (y > 1) ? 11 - y : y;
      this.form.patchValue({
        nit: this.form.get('nit').value + '-' + this.dv
      }) 
    }
  }

  searchAccount(tipo) {
    switch (tipo) {
      case 'Reteica':
        let reteica = this.form.get('reteica_account_id').value;
        this.retePercentage.reteica = (reteica.percent.replace(',', '.') / 100).toFixed(2);
        break;
      case 'Reteiva':
        let reteiva = this.form.get('reteiva_account_id').value;
        this.retePercentage.reteiva = (reteiva.percent.replace(',', '.') / 100).toFixed(2);
        break;
      case 'Retefuente':
        let retefuente = this.form.get('retefuente_account_id').value;
        this.retePercentage.retefuente = (retefuente.percent.replace(',', '.') / 100).toFixed(2);
        break;
      default:
        break;
    }
  }

  valueChanges() {
    this.form.get('withholding_agent').valueChanges.subscribe(value => {
      if (value == 'No') {
        this.form.get('retefuente_account_id').disable();
      } else {
        this.form.get('retefuente_account_id').enable();
      }
    });
    /* this.form.get('g_contribut').valueChanges.subscribe(value => {
      if (value == 'Si') {
        this.form.get('reteiva_account_id').disable();
      } else {
        this.form.get('reteiva_account_id').enable();
      }
    }); */
    this.form.get('dian_address').valueChanges.subscribe(value => {
      this.addressConcat();
    });
    this.form.get('address_one').valueChanges.subscribe(value => {
      this.addressConcat();
    });
    this.form.get('address_two').valueChanges.subscribe(value => {
      this.addressConcat();
    });
    this.form.get('address_three').valueChanges.subscribe(value => {
      this.addressConcat();
    });
    this.form.get('address_four').valueChanges.subscribe(value => {
      this.addressConcat();
    });
  }

  addressConcat() {
    setTimeout(() => {
      let forma = this.form.value;
      let cod_dian_address =
        forma.dian_address + ' ' +
        forma.address_one + ' ' +
        forma.address_two + ' ' +
        forma.address_three + ' ' +
        forma.address_four;
      this.form.patchValue({
        cod_dian_address
      });
    }, 50);
  }


  getThirdParty() {
    this._terceros.showThirdParty(this.id).subscribe((r: any) => {
      this.third = r.data;
      this.form.patchValue({
        id: this.third.id,
        location: this.third.location,
        document_type: this.third.document_type,
        nit: this.third.nit,
        person_type: this.third.person_type,
        first_name: this.third.first_name,
        second_name: this.third.second_name,
        first_surname: this.third.first_surname,
        second_surname: this.third.second_surname,
        social_reason: this.third.social_reason,
        tradename: this.third.tradename,
        dian_address: this.third.dian_address,
        address_one: this.third.address_one,
        address_two: this.third.address_two,
        address_three: this.third.address_three,
        address_four: this.third.address_four,
        cod_dian_address: this.third.cod_dian_address,
        landline: this.third.landline,
        cell_phone: this.third.cell_phone,
        email: this.third.email,
        zone_id: this.third.zone_id,
        department_id: this.third.department_id,
        municipality_id: this.third.municipality_id,
        country_id: this.third.country_id,
        city_id: this.third.city_id,
        //winning_list_id: this.third.winning_list_id,
        //apply_iva: this.third.apply_iva,
        contact_payments: this.third.contact_payments,
        phone_payments: this.third.phone_payments,
        email_payments: this.third.email_payments,
        regime: this.third.regime,
        encourage_profit: this.third.encourage_profit,
        ciiu_code_id: this.third.ciiu_code_id,
        withholding_agent: this.third.withholding_agent,
        withholding_oninvoice: this.third.withholding_oninvoice,
        reteica_type: this.third.reteica_type,
        reteica_account_id: this.third.reteica_account_id,
        retefuente_account_id: this.third.retefuente_account_id,
        //g_contribut: this.third.g_contribut,
        reteiva_account_id: this.third.reteiva_account_id,
        condition_payment: this.third.condition_payment,
        assigned_space: this.third.assigned_space,
        fiscal_responsibility: this.third.fiscal_responsibility,
        discount_prompt_payment: this.third.discount_prompt_payment,
        discount_days: this.third.discount_days,
        state: this.third.state,
        third_party_type: this.third.third_party_type,
        image: this.third.image,
        rut: this.third.rut
      });
      this.previsualizacionFoto = this.third.image;
      this.previsualizacionRut = this.third.rut;
      this.fileString = this.third.image
      this.rutString = this.third.rut
      this.retePercentage.retefuente = this.third.retefuente_percentage;
      this.retePercentage.reteiva = this.third.reteiva_percentage;
      this.retePercentage.reteica = this.third.reteica_percentage;
      this.fields.forEach((field: any) => {
        let field_name = field.name;
        this.field = field_name;
        let p: any = {}
        p[field_name] = this.third[field_name]
        this.form.patchValue(p);
      });
      this.third.third_party_person.forEach(third => {
        this.personList.push(this.fb.group({
          id: third.id,
          name: third.name,
          n_document: third.n_document,
          landline: third.landline,
          cell_phone: third.cell_phone,
          email: third.email,
          position: third.position,
          observation: third.observation
        }));
      });
      this.personType();
      this.locationCountry();
      this.getCities();
      this.getMunicipalitites();
    })
  }

  //subir archivos

  fileAttr = 'Selecciona foto';
  //fin subir archivos
  onFileChanged(event) {
    if (event.target.files[0]) {
      this.previsualizacionFoto = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(event.target.files[0])
      );
      this.fileAttr = event.target.files[0].name;
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = { ext: this.fileString };
        this.typeImage = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
      });
    }
  }
  fileAttr2 = 'Selecciona RUT'
  rutChange(event) {
    if (event.target.files[0]) {
      this.previsualizacionRut = this.sanitizer.bypassSecurityTrustUrl(
        window.URL.createObjectURL(event.target.files[0])
      );
      this.fileAttr2 = event.target.files[0].name;
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.rutString = (<FileReader>event.target).result;
        const type = { ext: this.rutString };
        this.typeRut = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.rutFile = base64;
      });
    }
  }

  saveInformation() {
    let image = this.fileString;
    let rut = this.rutString;
    let typeRut = this.typeRut;
    let typeImage = this.typeImage;
    this.form.patchValue({
      image,
      rut,
      typeRut,
      typeImage,
      reteica_percentage: this.retePercentage.reteica,
      reteiva_percentage: this.retePercentage.reteiva,
      retefuente_percentage: this.retePercentage.retefuente
    })
    this.form.markAllAsTouched()
    if (this.form.invalid) {
      return this._swal.show({
        icon: 'error',
        title: '¡Incorrecto!',
        text: 'Por favor completa los campos requeridos.',
        showCancel: false
      })
    }
    if (!this.id) {
      this._swal.show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'Se agregará un nuevo tercero.',
        showCancel: true
      }).then((r) => {
        if (r.isConfirmed) {
          this.values();
          this._terceros.saveInformation(this.form.value).subscribe((r: any) => {
            this._swal.show({
              icon: 'success',
              title: 'Creado con éxito',
              text: 'El tercero ha sido creado con éxito.',
              showCancel: false,
              timer: 1000
            })
            this.location.back();
          });
        }
      });
    } else {
      this._swal.show({
        icon: 'question',
        title: '¿Estás seguro(a)?',
        text: 'El tercero será acualizado.',
        showCancel: true
      }).then((r) => {
        console.log(r)
        if (r.isConfirmed) {
          this.values()
          this._terceros.updateThirdParties(this.form.value, this.third.id).subscribe((r: any) => {
            this._swal.show({
              icon: 'success',
              title: 'Actualizado con éxito',
              text: 'El tercero ha sido actualizado con éxito.',
              showCancel: false,
              timer: 1000
            })
            this.location.back();
          });
        }
      });
    }
  }

  values() {
    let reteica_account_id = this.form.value.reteica_account_id?.id;
    let retefuente_account_id = this.form.value.retefuente_account_id?.id;
    let reteiva_account_id = this.form.value.reteiva_account_id?.id;
    this.form.patchValue({
      reteica_account_id,
      retefuente_account_id,
      reteiva_account_id
    })
  }

  get nit_valid() {
    return this.form.get('nit').invalid && this.form.get('nit').touched
  }

  get location_valid() {
    return this.form.get('location').invalid && this.form.get('location').touched
  }

  get document_type_valid() {
    return this.form.get('document_type').invalid && this.form.get('document_type').touched
  }

  get country_valid() {
    return this.form.get('country_id').invalid && this.form.get('country_id').touched
  }
  
  get city_valid() {
    return this.form.get('city_id').invalid && this.form.get('city_id').touched
  }

  get person_type_valid() {
    return this.form.get('person_type').invalid && this.form.get('person_type').touched
  }

  get third_party_type_valid() {
    return this.form.get('third_party_type').invalid && this.form.get('third_party_type').touched
  }

  get first_name_valid() {
    return this.form.get('first_name').invalid && this.form.get('first_name').touched
  }

  get first_surname_valid() {
    return this.form.get('first_surname').invalid && this.form.get('first_surname').touched
  }

  get social_reason_valid() {
    return this.form.get('social_reason').invalid && this.form.get('social_reason').touched
  }

  get state_valid() {
    return this.form.get('state').invalid && this.form.get('state').touched
  }

  get cod_dian_address_valid() {
    return this.form.get('cod_dian_address').invalid && this.form.get('cod_dian_address').touched
  }

  get dian_address_valid() {
    return this.form.get('dian_address').invalid && this.form.get('dian_address').touched
  }

  /*  get cell_phone_valid() {
     return this.form.get('cell_phone').invalid && this.form.get('cell_phone').touched
   } */

  get landline_valid() {
    return this.form.get('landline').invalid && this.form.get('landline').touched
  }

  get municipality_valid() {
    return this.form.get('municipality_id').invalid && this.form.get('municipality_id').touched
  }
  get email_valid() {
    return this.form.get('email').invalid && this.form.get('email').touched
  }

}
