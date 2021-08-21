import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgpComponent } from './rgp.component';

describe('RgpComponent', () => {
  let component: RgpComponent;
  let fixture: ComponentFixture<RgpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RgpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
