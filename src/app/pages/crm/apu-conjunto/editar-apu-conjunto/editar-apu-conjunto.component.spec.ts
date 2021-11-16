import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarApuConjuntoComponent } from './editar-apu-conjunto.component';

describe('EditarApuConjuntoComponent', () => {
  let component: EditarApuConjuntoComponent;
  let fixture: ComponentFixture<EditarApuConjuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarApuConjuntoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarApuConjuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
