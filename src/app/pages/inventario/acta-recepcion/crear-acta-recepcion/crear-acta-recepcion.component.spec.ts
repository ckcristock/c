import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearActaRecepcionComponent } from './crear-acta-recepcion.component';

describe('CrearActaRecepcionComponent', () => {
  let component: CrearActaRecepcionComponent;
  let fixture: ComponentFixture<CrearActaRecepcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearActaRecepcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearActaRecepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
