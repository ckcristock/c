import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporteTerrestreComponent } from './transporte-terrestre.component';

describe('TransporteTerrestreComponent', () => {
  let component: TransporteTerrestreComponent;
  let fixture: ComponentFixture<TransporteTerrestreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransporteTerrestreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransporteTerrestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
