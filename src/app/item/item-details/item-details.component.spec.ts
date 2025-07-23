/**
 * Authors: Dua Hasan, Scott Green
 * Date: 11 July 2025
 * File: item-details.component.spec.ts
 * Description: Unit tests for item-details.component.spec.ts.
 */

import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ItemDetailsComponent } from './item-details.component';
import { ItemService } from '../item.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Item, UpdateItemDTO } from '../item';

describe('ItemDetailsComponent', () => {
  let component: ItemDetailsComponent;
  let fixture: ComponentFixture<ItemDetailsComponent>;
  let itemService: ItemService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule, ItemDetailsComponent],
      providers: [
        ItemService,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemDetailsComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute); fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Tests for updating an inventory item
  it ('should have a valid form when all fields to be updated are filled correctly', () => {
    component.itemForm.controls['category'].setValue('Electronics');  // Add form details
    component.itemForm.controls['supplier'].setValue('Tech Tonic');
    component.itemForm.controls['name'].setValue('Apple Watch');
    component.itemForm.controls['description'].setValue('Smartwatch designed to work with Apple ecosystem');
    component.itemForm.controls['quantity'].setValue('19');
    component.itemForm.controls['price'].setValue('300.01');

    expect(component.itemForm.valid).toBeTruthy();                    // Check that the form is valid
  });

  it('should call updateItem and navigate on successful form submission', () => {
    const updateItemDTO: UpdateItemDTO = {  // Create a DTO representing the data to be updated
      categoryId: 21,
      supplierId: 22,
      name: 'Othello',
      description: 'Board Game',
      quantity: 10,
      price: 12.45
    };

    const mockItem: Item = {
      _id: '1',
      categoryId: 21,
      supplierId: 22,
      name: 'Othello',
      description: 'Board Game',
      quantity: 15,
      price: 12.45,
    };

    spyOn(itemService, 'updateItem').and.returnValue(of(mockItem));
    spyOn(router, 'navigate');

    component.itemForm.controls['category'].setValue(updateItemDTO.categoryId); // Populate the form
    component.itemForm.controls['supplier'].setValue(updateItemDTO.supplierId);
    component.itemForm.controls['name'].setValue(updateItemDTO.name);
    component.itemForm.controls['description'].setValue(updateItemDTO.description);
    component.itemForm.controls['quantity'].setValue(updateItemDTO.quantity);
    component.itemForm.controls['price'].setValue(updateItemDTO.price);
    component.onSubmit();                                                       // Submit the form

    expect(itemService.updateItem).toHaveBeenCalledWith('1', updateItemDTO);    // Check that updateItem was called with DTO
    expect(router.navigate).toHaveBeenCalledWith(['/items']);                   // Check that navigation back to Item List occurs on success
  });

  it('should handle error on form submission (save changes) failure', fakeAsync(() => {
    spyOn(console, 'error');
    spyOn(itemService, 'updateItem').and.returnValue(throwError('Error updating item'));  // Simulate an error

    component.itemForm.controls['category'].setValue('44');                               // Put some data in the form
    component.itemForm.controls['supplier'].setValue('57');
    component.itemForm.controls['name'].setValue('RangeMaster 3000');
    component.itemForm.controls['description'].setValue('Full size oven');
    component.itemForm.controls['quantity'].setValue('14');
    component.itemForm.controls['price'].setValue('309.99');
    component.onSubmit();                                                                 // Submit the form
    tick();

    expect(itemService.updateItem).toHaveBeenCalled();                                    // Check that updateItem was called and an error was thrown
    expect(console.error).toHaveBeenCalledWith('Error updating item', 'Error updating item');
  }));

  //  tests for getItem by ID
  it('should call getItem and populate the form with item data after component init', () => {
    const mockItem: Item = {  // mock an item
      _id: '1',
      categoryId: 10,
      supplierId: 20,
      name: 'Test Item',
      description: 'Test Description',
      quantity: 5,
      price: 100.50
    };

    spyOn(itemService, 'getItem').and.returnValue(of(mockItem));

    fixture = TestBed.createComponent(ItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(itemService.getItem).toHaveBeenCalledWith('1');  // Check that itemService was called
    expect(component.itemForm.value).toEqual({              // Returned item should be same as the mocked item
      category: 10,
      supplier: 20,
      name: 'Test Item',
      description: 'Test Description',
      quantity: 5,
      price: 100.50
    });
  });

  it('should handle error if getItem fails', () => {
    spyOn(itemService, 'getItem').and.returnValue(throwError(() => 'Item not found'));  // Simulate an error
    const errorSpy = spyOn(console, 'error');

    fixture = TestBed.createComponent(ItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(itemService.getItem).toHaveBeenCalledWith('1');  // Check that the getItem service was called
  });
});

describe('ItemDetailsComponent - Missing ID Scenario', () => {  // This test needs to be in a separate describe since we are modifying the test bed
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule, ItemDetailsComponent],
      providers: [
        ItemService,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '' } } } }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
  });

  it('should navigate to /items if inventoryItemId param is missing', () => {
    const navSpy = spyOn(router, 'navigate');
    const fixture = TestBed.createComponent(ItemDetailsComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(navSpy).toHaveBeenCalledWith(['/items']);  // Check that we routed back to the Item List page
  });
});

