import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCalculoComponent } from './base-calculo.component';

describe('BaseCalculoComponent', () => {
  let component: BaseCalculoComponent;
  let fixture: ComponentFixture<BaseCalculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseCalculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseCalculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
