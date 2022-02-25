import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerActaRecepcionComponent } from './ver-acta-recepcion.component';

describe('VerActaRecepcionComponent', () => {
  let component: VerActaRecepcionComponent;
  let fixture: ComponentFixture<VerActaRecepcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerActaRecepcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerActaRecepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
