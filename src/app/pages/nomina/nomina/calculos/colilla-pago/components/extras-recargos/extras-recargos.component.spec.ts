import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtrasRecargosComponent } from './extras-recargos.component';

describe('ExtrasRecargosComponent', () => {
  let component: ExtrasRecargosComponent;
  let fixture: ComponentFixture<ExtrasRecargosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtrasRecargosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtrasRecargosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
