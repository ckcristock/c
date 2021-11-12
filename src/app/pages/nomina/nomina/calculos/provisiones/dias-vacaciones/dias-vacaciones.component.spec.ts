import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiasVacacionesComponent } from './dias-vacaciones.component';

describe('DiasVacacionesComponent', () => {
  let component: DiasVacacionesComponent;
  let fixture: ComponentFixture<DiasVacacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiasVacacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiasVacacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
