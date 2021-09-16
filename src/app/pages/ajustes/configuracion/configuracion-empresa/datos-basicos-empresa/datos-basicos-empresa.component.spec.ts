import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosBasicosEmpresaComponent } from './datos-basicos-empresa.component';

describe('DatosBasicosEmpresaComponent', () => {
  let component: DatosBasicosEmpresaComponent;
  let fixture: ComponentFixture<DatosBasicosEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosBasicosEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosBasicosEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
