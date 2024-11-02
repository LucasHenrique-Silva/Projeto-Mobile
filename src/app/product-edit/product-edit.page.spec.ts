import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCreationPage } from './product-creation.page';

describe('ProductCreationPage', () => {
  let component: ProductCreationPage;
  let fixture: ComponentFixture<ProductCreationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
