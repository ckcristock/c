import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbcSaludPensionComponent } from './ibc-salud-pension.component';

describe('IbcSaludPensionComponent', () => {
  let component: IbcSaludPensionComponent;
  let fixture: ComponentFixture<IbcSaludPensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IbcSaludPensionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IbcSaludPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
