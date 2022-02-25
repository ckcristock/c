import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCompraNacionalComponent } from './crear-compra-nacional.component';

describe('CrearCompraNacionalComponent', () => {
  let component: CrearCompraNacionalComponent;
  let fixture: ComponentFixture<CrearCompraNacionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearCompraNacionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCompraNacionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
