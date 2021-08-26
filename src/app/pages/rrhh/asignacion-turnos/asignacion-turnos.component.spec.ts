import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionTurnosComponent } from './asignacion-turnos.component';

describe('AsignacionTurnosComponent', () => {
  let component: AsignacionTurnosComponent;
  let fixture: ComponentFixture<AsignacionTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignacionTurnosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
