import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { TercerosService } from '../terceros.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { SwalService } from '../../../ajustes/informacion-base/services/swal.service';
import { functionsUtils } from '../../../../core/utils/functionsUtils';
import { ValidatorsService } from '../../../ajustes/informacion-base/services/reactive-validation/validators.service';

@Component({
  selector: 'app-crear-terceros',
  templateUrl: './crear-terceros.component.html',
  styleUrls: ['./crear-terceros.component.scss']
})
export class CrearTercerosComponent implements OnInit {
  form: FormGroup;
  date:Date = new Date();
  id: number;
  third:any;
  zones:any[] = [];
  title:string = '';
  municipalities:any[] = [];
  departments:any[] = [];
  winnigLists:any[] = [];
  ciiuCodes:any[] = [];
  show:boolean;
  address:any[] = [];
  accountPlan:any[] = [];
  fields:any[] = [];
  newField:any = '';
  selected:any;
  parametro:any;
  retePercentage:any = {
    reteica: 0,
    reteiva: 0,
    retefuente: 0
  }
  pagos:any = [
    { clave: 'De Contado', valor: 1 },
    { clave: '30 Días', valor: 2 },
    { clave: '60 Días', valor: 3 },
    { clave: '90 Días', valor: 4 },
    { clave: '120 Días', valor: 5 },
  ];
  file: any = '';
  fileString: any = '';
  rutString:any = '';
  rutFile:any = '';
  typeRut:any = '';
  typeImage:any = '';
  field:any;
  constructor( 
               private location: Location,
               private fb: FormBuilder,
               private _terceros: TercerosService,
               public router: Router,
               private _swal: SwalService,
               private actRoute: ActivatedRoute,
               private _validators: ValidatorsService
              ) { }

  ngOnInit(): void {
    this.createForm();
    this.getZones();
    this.getDepartments();
    this.getMunicipalitites();
    this.id = this.actRoute.snapshot.params.id;
    this.getThirdParty();
    this.getWinningLists();
    this.getCiiuCodeLists();
    this.getDianAddress();
    this.getAccountPlan();
    this.getTitle();
    this.getFields();
  }

  regresar(){
    this.location.back();
  }

  createForm() {
    this.form = this.fb.group({
      /* Inicia Datos Básicos */
      id: [''],
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
      cell_phone: ['', this._validators.required],
      email: [''],
      zone_id: [''],
      department_id: [''],
      municipality_id: ['', this._validators.required],
      image: [''],
      /* Termina Datos Básicos */
      /* Inicia Datos Comerciales */
      winning_list_id: [''],
      apply_iva: [''],
      contact_payments: [''],
      phone_payments:[''],
      email_payments: [''],
      regime: [''],
      encourage_profit: [''],
      ciiu_code_id: [''],
      withholding_agent: [''],
      withholding_oninvoice:  [''],
      reteica_type: [''],
      reteica_account_id: [''],
      retefuente_account_id: [''],
      g_contribut: [''],
      reteiva_account_id: [''],
      condition_payment: [''],
      assigned_space: [''],
      discount_prompt_payment: [''],
      discount_days: [''],
      state: [''],
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

  personControl(){
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

  get personList(){
    return this.form.get('person') as FormArray;
  }

  createPerson(){
    let person = this.personList;
    person.push(this.personControl());
  }
  
  deletePerson(i){
    let person = this.personList;
    person.removeAt(i);
  }

  personType(){
    let tipo = this.form.get('person_type').value;
    if(tipo == 'natural'){
      this.form.get('social_reason').disable();
      this.form.get('first_name').enable();
      this.form.get('second_name').enable();
      this.form.get('first_surname').enable();
      this.form.get('second_surname').enable();
    } else if(tipo == 'juridico') {
      this.form.get('first_name').disable();
      this.form.get('second_name').disable();
      this.form.get('first_surname').disable();
      this.form.get('second_surname').disable();
      this.form.get('social_reason').enable();
    }
  }

  getFields(){
    this._terceros.getFields().subscribe((r:any) => {
      this.fields = r.data;
      this.fields.forEach((field:any) => {
        let field_name = field.name
        this.field = field_name;
        this.form.addControl(field_name, this.fb.control(''));
        /* console.log(this.third.field_name);
        this.form.patchValue({
          nueva_fecha: this.third.nueva_fecha
        }) */
      });
    })
  }

  getTitle(){
    if (this.actRoute.snapshot.params.id) {
      this.title = 'Editar Tercero';
    } else {
      this.title = 'Nuevo Tercero';
    }
  }

  getZones(){
    this._terceros.getZones().subscribe( (r:any) =>{
      this.zones = r.data;
    })
  }

  getDepartments(){
    this._terceros.getDepartments().subscribe( (r:any) => {
      this.departments = r.data;
    })
  }

  getMunicipalitites() {
    this._terceros.getMunicipalities().subscribe( (r:any) => {
      this.municipalities = r.data;
    })
  }

  getWinningLists(){
    this._terceros.getWinningList().subscribe((r:any) => {
      this.winnigLists = r.data;
    })
  }

  getCiiuCodeLists(){
    this._terceros.getCiiuCodesList().subscribe((r:any) => {
      this.ciiuCodes = r.data;
    })
  }
  
  getDianAddress(){
    this._terceros.getDianAddress().subscribe((r:any) => {
        this.address = r.data;
    })
  }

  getAccountPlan(){
    this._terceros.getAccountPlan().subscribe((r:any) => {
        this.accountPlan = r.data;
    })
  }

  searchAccount(tipo){
    switch (tipo) {
      case 'Reteica':
        let reteica = this.form.get('reteica_account_id').value;
        this.retePercentage.reteica = (reteica.percent.replace(',','.') * 100).toFixed(2);
        break;
      case 'Reteiva':
        let reteiva = this.form.get('reteiva_account_id').value;
        this.retePercentage.reteiva = (reteiva.percent.replace(',','.') * 100).toFixed(2);
        break;
      case 'Retefuente':
        let retefuente = this.form.get('retefuente_account_id').value;
        this.retePercentage.retefuente = (retefuente.percent.replace(',','.') * 100).toFixed(2);
        break;
      default:
        break;
    }
  }

  valueChanges(){
    this.form.get('withholding_agent').valueChanges.subscribe( value => {
      if (value == 'No') {
        this.form.get('retefuente_account_id').disable();
      } else {
        this.form.get('retefuente_account_id').enable();
      }
    });
    this.form.get('g_contribut').valueChanges.subscribe( value => {
      if (value == 'Si') {
        this.form.get('reteiva_account_id').disable();
      } else {
        this.form.get('reteiva_account_id').enable();
      }
    });
    this.form.get('dian_address').valueChanges.subscribe( value => {
      this.addressConcat();
    });
    this.form.get('address_one').valueChanges.subscribe( value => {
      this.addressConcat();
    });
    this.form.get('address_two').valueChanges.subscribe( value => {
      this.addressConcat();
    });
    this.form.get('address_three').valueChanges.subscribe( value => {
      this.addressConcat();
    });
    this.form.get('address_four').valueChanges.subscribe( value => {
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


  getThirdParty(){
    this._terceros.showThirdParty(this.id).subscribe( (r:any) => {
      this.third = r.data;
      this.form.patchValue({
        id: this.third.id,
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
        winning_list_id: this.third.winning_list_id,
        apply_iva: this.third.apply_iva,
        contact_payments: this.third.contact_payments,
        phone_payments: this.third.phone_payments,
        email_payments: this.third.email_payments,
        regime: this.third.regime,
        encourage_profit: this.third.encourage_profit,
        ciiu_code_id: this.third.ciiu_code_id,
        withholding_agent: this.third.withholding_agent,
        withholding_oninvoice:  this.third.withholding_oninvoice,
        reteica_type: this.third.reteica_type,
        reteica_account_id: this.third.reteica_account_id,
        retefuente_account_id: this.third.retefuente_account_id,
        g_contribut: this.third.g_contribut,
        reteiva_account_id: this.third.reteiva_account_id,
        condition_payment: this.third.condition_payment,
        assigned_space: this.third.assigned_space,
        discount_prompt_payment: this.third.discount_prompt_payment,
        discount_days: this.third.discount_days,
        state: this.third.state,
        third_party_type: this.third.third_party_type,
        image: this.third.image,
        rut: this.third.rut,
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
    })
  }

  onFileChanged(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.fileString = (<FileReader>event.target).result;
        const type = {ext:this.fileString};
        this.typeImage = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.file = base64;
      });
    }
  }

  rutChange(event) {
    if (event.target.files[0]) {
      let file = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.rutString = (<FileReader>event.target).result;
        const type = {ext:this.rutString};
        this.typeRut = type.ext.match(/[^:/]\w+(?=;|,)/)[0];
      };
      functionsUtils.fileToBase64(file).subscribe((base64) => {
        this.rutFile = base64;
      });
    }
  }

  saveInformation(){
    let image = this.fileString;
    let rut = this.rutString;
    let typeRut = this.typeRut;
    let typeImage = this.typeImage;
    this.form.patchValue({
      image,
      rut,
      typeRut,
      typeImage
    })
    this.form.markAllAsTouched()
    if (this.form.invalid) {
      return this._swal.show({
        icon: 'error',
        title: '¡Incorrecto!',
        text: 'Por favor, complete los campos requeridos.',
        showCancel: false
      })
    }
    if (this.form.value.id == "") {
      this._swal.show({
        icon: 'question',
        title: '¿Estas seguro?',
        text: 'Se agregará un nuevo tercero.',
        showCancel: true
      }).then((r) => {
        if (r.isConfirmed) {
          this.values();
          this._terceros.saveInformation(this.form.value).subscribe((r:any) => {
            this._swal.show({
              icon: 'success',
              title: 'Proceso Satisfactorio',
              text: 'El tercero ha sido creado con éxito.',
              showCancel: false
            })
            this.location.back();
          });
        }
      });
    } else {
      this._swal.show({
        icon: 'question',
        title: '¿Estas Seguro?',
        text: 'El tercero será acualizado.',
        showCancel: true
      }).then((r) => {
        if (r.isConfirmed) {
          this.values()
          this._terceros.updateThirdParties(this.form.value, this.third.id).subscribe((r:any) => {
            this._swal.show({
              icon: 'success',
              title: 'Actualizado con éxito',
              text: 'El tercero ha sido actualizado con éxito.',
              showCancel: false
            })
            this.location.back();
          });
        }
      });
    }
  }

  values(){
    let reteica_account_id = this.form.value.reteica_account_id?.id;
    let retefuente_account_id = this.form.value.retefuente_account_id?.id;
    let reteiva_account_id = this.form.value.reteiva_account_id?.id;
    this.form.patchValue({
    reteica_account_id,
    retefuente_account_id,
    reteiva_account_id
    })
  }

  get nit_valid(){
    return this.form.get('nit').invalid && this.form.get('nit').touched
  }

  get person_type_valid(){
    return this.form.get('person_type').invalid && this.form.get('person_type').touched
  }
  
  get third_party_type_valid(){
    return this.form.get('third_party_type').invalid && this.form.get('third_party_type').touched
  }

  get first_name_valid(){
    return this.form.get('first_name').invalid && this.form.get('first_name').touched
  }

  get first_surname_valid(){
    return this.form.get('first_surname').invalid && this.form.get('first_surname').touched
  }

  get social_reason_valid(){
    return this.form.get('social_reason').invalid && this.form.get('social_reason').touched
  }

  get cod_dian_address_valid(){
    return this.form.get('cod_dian_address').invalid && this.form.get('cod_dian_address').touched
  }

  get dian_address_valid(){
    return this.form.get('dian_address').invalid && this.form.get('dian_address').touched
  }

  get cell_phone_valid(){
    return this.form.get('cell_phone').invalid && this.form.get('cell_phone').touched
  }

  get landline_valid(){
    return this.form.get('landline').invalid && this.form.get('landline').touched
  }

  get municipality_valid(){
    return this.form.get('municipality_id').invalid && this.form.get('municipality_id').touched
  }

}
