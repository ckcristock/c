import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiesgoArlConfigComponent } from './riesgo-arl-config.component';

describe('RiesgoArlConfigComponent', () => {
  let component: RiesgoArlConfigComponent;
  let fixture: ComponentFixture<RiesgoArlConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiesgoArlConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiesgoArlConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
