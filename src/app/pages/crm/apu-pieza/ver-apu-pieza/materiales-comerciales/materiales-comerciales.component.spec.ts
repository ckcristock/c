import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialesComercialesComponent } from './materiales-comerciales.component';

describe('MaterialesComercialesComponent', () => {
  let component: MaterialesComercialesComponent;
  let fixture: ComponentFixture<MaterialesComercialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialesComercialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialesComercialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
