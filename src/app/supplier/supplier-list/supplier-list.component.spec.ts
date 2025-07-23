/**
 * Authors: Dua Hasan, Scott Green
 * Date: 21 July 2025
 * File: item.ts
 * Description: Unit tests for supplier-list component.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupplierListComponent } from './supplier-list.component';
import { SupplierService } from '../supplier.service';
import { throwError } from 'rxjs';
import { Supplier } from '../supplier';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('SupplierListComponent', () => {
  let component: SupplierListComponent;
  let fixture: ComponentFixture<SupplierListComponent>;
  let supplierService: SupplierService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierListComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [SupplierListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierListComponent);
    component = fixture.componentInstance;
    supplierService = TestBed.inject(SupplierService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Tests for listing all suppliers
  it('should display records in the DOM', () => {
    const currentDate = new Date().toISOString();

    const mockSuppliers: Supplier[] = [
      { _id: '12345',
        supplierId: 3,
        supplierName: 'Supplier 1',
        contactInformation: '555-555-5555',
        address: '555 55th St',
        dateCreated: currentDate,
        dateModified: currentDate
      },
      { _id: '67890',
        supplierId: 4,
        supplierName: 'Supplier 2',
        contactInformation: '444-444-4444',
        address: '444 44th St',
        dateCreated: currentDate,
        dateModified: currentDate
      }
    ];

    component.suppliers = mockSuppliers;
    fixture.detectChanges();                  // Trigger change detection

    const supplierRows = fixture.debugElement.queryAll(By.css('.supplier-page__table-body .supplier-page__table-row'));
    expect(supplierRows.length).toBeGreaterThan(0); // Check that there are item rows in the DOM
  });

  it('should handle error when fetching suppliers', () => {
    spyOn(supplierService, 'getSuppliers').and.returnValue(throwError('Error fetching items'));
    fixture.detectChanges(); // Trigger the component's constructor
    expect(component.suppliers.length).toBe(0); // Check that there were no items returned
  });

  it('should render heading', () => {
    const fixture = TestBed.createComponent(SupplierListComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.supplier-page__title')?.textContent).toContain('Supplier List');  // Check that the page heading was displayed
  });
});
