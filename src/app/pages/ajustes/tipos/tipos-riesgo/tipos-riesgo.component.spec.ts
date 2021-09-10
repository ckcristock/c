import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposRiesgoComponent } from './tipos-riesgo.component';

describe('TiposRiesgoComponent', () => {
  let component: TiposRiesgoComponent;
  let fixture: ComponentFixture<TiposRiesgoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposRiesgoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposRiesgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
