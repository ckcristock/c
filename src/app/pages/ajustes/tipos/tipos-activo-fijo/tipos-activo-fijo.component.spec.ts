import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposActivoFijoComponent } from './tipos-activo-fijo.component';

describe('TiposActivoFijoComponent', () => {
  let component: TiposActivoFijoComponent;
  let fixture: ComponentFixture<TiposActivoFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposActivoFijoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposActivoFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
