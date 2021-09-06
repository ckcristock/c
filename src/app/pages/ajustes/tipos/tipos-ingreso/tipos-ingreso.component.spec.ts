import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposIngresoComponent } from './tipos-ingreso.component';

describe('TiposIngresoComponent', () => {
  let component: TiposIngresoComponent;
  let fixture: ComponentFixture<TiposIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposIngresoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
