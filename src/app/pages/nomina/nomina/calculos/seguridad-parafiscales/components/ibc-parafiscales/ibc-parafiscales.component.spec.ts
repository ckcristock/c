import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbcParafiscalesComponent } from './ibc-parafiscales.component';

describe('IbcParafiscalesComponent', () => {
  let component: IbcParafiscalesComponent;
  let fixture: ComponentFixture<IbcParafiscalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IbcParafiscalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IbcParafiscalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
