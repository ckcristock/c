import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseCalculosComponent } from './base-calculos.component';

describe('BaseCalculosComponent', () => {
  let component: BaseCalculosComponent;
  let fixture: ComponentFixture<BaseCalculosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseCalculosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseCalculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
