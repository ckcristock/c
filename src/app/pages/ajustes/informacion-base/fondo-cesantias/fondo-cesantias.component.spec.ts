import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FondoCesantiasComponent } from './fondo-cesantias.component';

describe('FondoCesantiasComponent', () => {
  let component: FondoCesantiasComponent;
  let fixture: ComponentFixture<FondoCesantiasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FondoCesantiasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FondoCesantiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
