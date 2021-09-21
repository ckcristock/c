import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerViaticosComponent } from './ver-viaticos.component';

describe('VerViaticosComponent', () => {
  let component: VerViaticosComponent;
  let fixture: ComponentFixture<VerViaticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerViaticosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerViaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
