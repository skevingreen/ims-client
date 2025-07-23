import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { SupplierAddComponent } from './supplier-add.component';
import { SupplierService } from '../supplier.service';
import { AddSupplierDTO, Supplier } from '../supplier';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('SupplierAddComponent', () => {
  let component: SupplierAddComponent;
  let fixture: ComponentFixture<SupplierAddComponent>;
  let supplierService: SupplierService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule, SupplierAddComponent],
      providers: [
        SupplierService,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierAddComponent);
    component = fixture.componentInstance;
    supplierService = TestBed.inject(SupplierService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled correctly', () => {
    component.supplierForm.controls['supplierName'].setValue('Test Supplier');
    component.supplierForm.controls['contactInformation'].setValue('123456789012');
    component.supplierForm.controls['address'].setValue('123 Test Address');
    component.supplierForm.controls['dateCreated'].setValue('2024-09-04T21:39:36.605Z');

    expect(component.supplierForm.valid).toBeTrue();
  });

  it('should call addSupplier and navigate on successful form submission', () => {
    const addSupplierDTO: AddSupplierDTO = {
      supplierName: 'Test Supplier',
      contactInformation: '123456789012',
      address: '123 Test Address',
      dateCreated: '2024-09-04T21:39:36.605Z'
    };

    const mockSupplier: Supplier = {
      _id: '1',
      supplierId: 1,
      supplierName: 'Test Supplier',
      contactInformation: '123456789012',
      address: '123 Test Address',
      dateCreated: '2024-09-04T21:39:36.605Z'
    };

    spyOn(supplierService, 'addSupplier').and.returnValue(of(mockSupplier));
    spyOn(router, 'navigate');

    component.supplierForm.controls['supplierName'].setValue(addSupplierDTO.supplierName);
    component.supplierForm.controls['contactInformation'].setValue(addSupplierDTO.contactInformation);
    component.supplierForm.controls['address'].setValue(addSupplierDTO.address);
    component.supplierForm.controls['dateCreated'].setValue(addSupplierDTO.dateCreated);

    component.onSubmit();

    expect(supplierService.addSupplier).toHaveBeenCalledWith(addSupplierDTO);
    expect(router.navigate).toHaveBeenCalledWith(['/suppliers']);
  });

  it('should handle error on form submission failure', () => {
    spyOn(supplierService, 'addSupplier').and.returnValue(throwError('Error creating supplier'));
    spyOn(console, 'error');

    component.supplierForm.controls['supplierName'].setValue('Test Supplier');
    component.supplierForm.controls['contactInformation'].setValue('123456789012');
    component.supplierForm.controls['address'].setValue('123 Test Address');
    component.supplierForm.controls['dateCreated'].setValue('2024-09-04T21:39:36.605Z');

    component.onSubmit();

    expect(supplierService.addSupplier).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error creating supplier', 'Error creating supplier');
  });
});
