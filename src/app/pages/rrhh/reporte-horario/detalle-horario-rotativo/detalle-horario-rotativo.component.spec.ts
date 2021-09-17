import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleHorarioRotativoComponent } from './detalle-horario-rotativo.component';

describe('DetalleHorarioRotativoComponent', () => {
  let component: DetalleHorarioRotativoComponent;
  let fixture: ComponentFixture<DetalleHorarioRotativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleHorarioRotativoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleHorarioRotativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
