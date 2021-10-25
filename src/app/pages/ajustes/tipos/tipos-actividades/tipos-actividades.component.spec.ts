import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposActividadesComponent } from './tipos-actividades.component';

describe('TiposActividadesComponent', () => {
  let component: TiposActividadesComponent;
  let fixture: ComponentFixture<TiposActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposActividadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
