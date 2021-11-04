import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeduccionesComponent } from './deducciones.component';

describe('DeduccionesComponent', () => {
  let component: DeduccionesComponent;
  let fixture: ComponentFixture<DeduccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeduccionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeduccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
