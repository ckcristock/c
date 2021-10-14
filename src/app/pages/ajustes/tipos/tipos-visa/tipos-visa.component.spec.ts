import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposVisaComponent } from './tipos-visa.component';

describe('TiposVisaComponent', () => {
  let component: TiposVisaComponent;
  let fixture: ComponentFixture<TiposVisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiposVisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposVisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
