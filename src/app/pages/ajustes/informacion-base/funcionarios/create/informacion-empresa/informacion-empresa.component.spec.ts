import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionEmpresaComponent } from './informacion-empresa.component';

describe('InformacionEmpresaComponent', () => {
  let component: InformacionEmpresaComponent;
  let fixture: ComponentFixture<InformacionEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformacionEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
