import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryStockComponent } from './category-stock.component';

describe('CategoryStockComponent', () => {
  let component: CategoryStockComponent;
  let fixture: ComponentFixture<CategoryStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
