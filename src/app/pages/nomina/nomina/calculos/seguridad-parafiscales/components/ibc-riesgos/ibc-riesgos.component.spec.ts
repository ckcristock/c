import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IbcRiesgosComponent } from './ibc-riesgos.component';

describe('IbcRiesgosComponent', () => {
  let component: IbcRiesgosComponent;
  let fixture: ComponentFixture<IbcRiesgosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IbcRiesgosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IbcRiesgosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
