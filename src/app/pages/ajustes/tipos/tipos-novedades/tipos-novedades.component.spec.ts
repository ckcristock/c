import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposNovedadesComponent } from './tipos-novedades.component';

describe('TiposNovedadesComponent', () => {
  let component: TiposNovedadesComponent;
  let fixture: ComponentFixture<TiposNovedadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposNovedadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposNovedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
