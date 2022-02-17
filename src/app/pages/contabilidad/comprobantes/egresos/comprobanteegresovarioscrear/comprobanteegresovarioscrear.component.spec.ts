import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteegresovarioscrearComponent } from './comprobanteegresovarioscrear.component';

describe('ComprobanteegresovarioscrearComponent', () => {
  let component: ComprobanteegresovarioscrearComponent;
  let fixture: ComponentFixture<ComprobanteegresovarioscrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComprobanteegresovarioscrearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprobanteegresovarioscrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
