import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeAccountsPage } from './employee-accounts.page';

describe('EmployeeAccountsPage', () => {
  let component: EmployeeAccountsPage;
  let fixture: ComponentFixture<EmployeeAccountsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeAccountsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
