import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargoComponent } from './descargo.component';

describe('DescargoComponent', () => {
  let component: DescargoComponent;
  let fixture: ComponentFixture<DescargoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescargoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
