import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableInventaryComponent } from './table-inventary.component';

describe('TableInventaryComponent', () => {
  let component: TableInventaryComponent;
  let fixture: ComponentFixture<TableInventaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableInventaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableInventaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
