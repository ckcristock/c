import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposEgresoComponent } from './tipos-egreso.component';

describe('TiposEgresoComponent', () => {
  let component: TiposEgresoComponent;
  let fixture: ComponentFixture<TiposEgresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposEgresoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposEgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
