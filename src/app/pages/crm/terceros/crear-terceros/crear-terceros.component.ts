import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { consts } from 'src/app/core/utils/consts';

@Component({
  selector: 'app-crear-terceros',
  templateUrl: './crear-terceros.component.html',
  styleUrls: ['./crear-terceros.component.scss'],
})
export class CrearTercerosComponent implements OnInit {
  loading: boolean = true
  @ViewChild('stepper') stepper: MatHorizontalStepper;
  goBack() {
    this.stepper.previous();
  }

  goForward() {
    this.stepper.next();
  }

  form: FormGroup;
  masks = consts;
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
    { clave: 'De contado', valor: '1' },
    { clave: '30 días', valor: '2' },
    { clave: '60 días', valor: '3' },
    { clave: '90 días', valor: '4' },
    { clave: '120 días', valor: '5' },
  ];
  file: any = '';
  fileString: any = '';
  rutString: any = '';
  rutFile: any = '';
  typeRut: any = '';
  typeImage: any = '';
  field: any;
  searchActividad: any
  filteredCountries: any[] = [];
  filteredDepartment: any[] = [];
  filteredMunicipality: any[] = [];
  filteredDianDirection: any[] = [];
  reload: boolean;
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private _terceros: TercerosService,
    public router: Router,
    private _swal: SwalService,
    private actRoute: ActivatedRoute,
    private _validators: ValidatorsService,
    private sanitizer: DomSanitizer
  ) {
    this.id = this.actRoute.snapshot.params.id;
  }

  ciiu: any[] = [];
  async ngOnInit(): Promise<void> {
    this.createForm();
    this.getZones();
    await this.getAccountPlan();
    this.getTypeDocuments();
    await this.getFields();
    await this.getCountriesWith();
    this.getWinningLists();
    this.getCiiuCodeLists();
    this.getDianAddress();
    this.getTitle();
    this.getRegimeType();
    this.getFiscalResponsibility();
  }

  async reloadData() {
    this.reload = true;
    this.getZones();
    this.getCountriesWith();
    this.getWinningLists();
    this.getCiiuCodeLists();
    this.getDianAddress();
    this.getAccountPlan();
    this.getTypeDocuments();
    this.getFields();
    this.getRegimeType();
    await this.getFiscalResponsibility();
    this.reload = false
  }



  createForm() {
    this.form = this.fb.group({
      id: [''],
      document_type: ['', this._validators.required],
      nit: ['', this._validators.required],
      dv: [''],
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
      department_id: ['', Validators.required],
      municipality_id: ['', this._validators.required],
      country_id: ['', this._validators.required],
      image: [''],
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
      reteiva_account_id: [''],
      reteiva_percentage: [0],
      condition_payment: [''],
      assigned_space: [''],
      fiscal_responsibility: [''],
      discount_prompt_payment: [''],
      discount_days: [''],
      state: ['Activo', this._validators.required],
      rut: [''],
      typeRut: [''],
      typeImage: [''],
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

  async getFiscalResponsibility() {
    await this._terceros.getFiscalResponsibility().toPromise().then((r: any) => {
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
      name: ['', Validators.required],
      n_document: [''],
      landline: [''],
      cell_phone: [''],
      email: ['', Validators.required],
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

  async getCountriesWith() {
    await this._terceros.getCountriesWith().toPromise().then((res: any) => {
      this.countries = res.data
      this.filteredCountries = res.data.slice()
    })
    if (this.id) {
      this.filterDepartments(this.third.country_id)
    }
  }

  filterDepartments(id) {
    this.departments = []
    this.countries.forEach(country => {
      if (country.id == id) {
        this.departments = country.departments
        this.filteredDepartment = country.departments.slice()
      }
    });
    if (this.id) {
      this.filterMunicipalities(this.third.department_id)
    }
  }

  filterMunicipalities(id) {
    this.municipalities = []
    this.departments.forEach(department => {
      if (department.id == id) {
        this.municipalities = department.municipalities
        this.filteredMunicipality = department.municipalities.slice()
      }
    });
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

  async getFields() {
    await this._terceros.getFields().toPromise().then((r: any) => {
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
      } else {
        this.loading = false
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


  getWinningLists() {
    this._terceros.getWinningList().subscribe((r: any) => {
      this.winnigLists = r.data;
    })
  }

  getCiiuCodeLists() {
    this._terceros.getCiiuCodesList().subscribe((r: any) => {
      this.ciiuCodes = r.data;
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
    })
  }

  getDianAddress() {
    this._terceros.getDianAddress().subscribe((r: any) => {
      this.address = r.data;
      this.filteredDianDirection = r.data
    })
  }

  async getAccountPlan() {
    await this._terceros.getAccountPlan().toPromise().then((r: any) => {
      this.accountPlan = r.data;
    })
  }
  nitSelected: any;
  getTypeDocuments() {
    this._terceros.getTypeDocuments().subscribe((r: any) => {
      this.documentTypes = r.data;
      this.documentTypes.forEach(type => {
        if (type.code == 'NIT') {
          this.nitSelected = type.value
        }
      });
    })
  }
  dv: any;
  validarDV(myNit) {
    if (this.nitSelected == this.form.get('document_type').value && this.form.get('country_id').value == 1) {
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
      this.dv = (y > 1) ? 11 - y : y;
      this.form.patchValue({
        dv: this.dv
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
        (forma.dian_address ? (forma.dian_address + ' ') : '') +
        (forma.address_one ? (forma.address_one + ' ') : '') +
        (forma.address_two ? (forma.address_two + ' ') : '') +
        (forma.address_three ? (forma.address_three + ' ') : '') +
        (forma.address_four ? (forma.address_four + ' ') : '');
      this.form.patchValue({
        cod_dian_address
      });
    }, 50);
  }


  getThirdParty() {
    this.loading = true
    this._terceros.editThirdParty(this.id).subscribe((r: any) => {
      this.third = r.data;
      let thirdPartyType = [];
      if (this.third.is_client) {
        thirdPartyType.push('Cliente');
      }
      if (this.third.is_supplier) {
        thirdPartyType.push('Proveedor');
      }
      this.third.third_party_type = thirdPartyType;
      this.form.patchValue({
        id: this.third.id,
        document_type: this.third.document_type,
        nit: this.third.nit,
        dv: this.third.dv,
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
        contact_payments: this.third.contact_payments,
        phone_payments: this.third.phone_payments,
        email_payments: this.third.email_payments,
        regime: this.third.regime,
        encourage_profit: this.third.encourage_profit,
        ciiu_code_id: this.third.ciiu_code_id,
        withholding_agent: this.third.withholding_agent,
        withholding_oninvoice: this.third.withholding_oninvoice,
        reteica_type: this.third.reteica_type,
        reteica_account_id: this.accountPlan.find(x => x.id == this.third.reteica_account_id),
        retefuente_account_id: this.accountPlan.find(x => x.id == this.third.retefuente_account_id),
        reteiva_account_id: this.accountPlan.find(x => x.id == this.third.reteiva_account_id),
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
      if (this.id) {
        this.personType();
        this.filterDepartments(this.third.country_id)
      }
      this.loading = false
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
    console.log(this.form.value)
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

}
