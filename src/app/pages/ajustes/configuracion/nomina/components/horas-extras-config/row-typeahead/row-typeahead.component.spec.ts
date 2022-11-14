import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowTypeaheadComponent } from './row-typeahead.component';

describe('RowTypeaheadComponent', () => {
  let component: RowTypeaheadComponent;
  let fixture: ComponentFixture<RowTypeaheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RowTypeaheadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RowTypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
