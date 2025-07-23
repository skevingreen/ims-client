/**
 * Authors: Dua Hasan, Scott Green
 * Date: 4 July 2025
 * File: item.service.ts
 * Description: Service for performing actions on Suppliers.
 */

import { TestBed } from '@angular/core/testing';
import { SupplierService } from './supplier.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SupplierService', () => {
  let service: SupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SupplierService]
    });

    service = TestBed.inject(SupplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
