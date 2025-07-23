/**
 * Authors: Dua Hasan, Scott Green
 * Date: 4 July 2025
 * File: item-add.component.spec.ts
 * Description: Unit tests for item-add component.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ItemAddComponent } from './item-add.component';
import { ItemService } from '../item.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AddItemDTO, Item } from '../item';

describe('ItemAddComponent', () => {
  let component: ItemAddComponent;
  let fixture: ComponentFixture<ItemAddComponent>;
  let itemService: ItemService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, RouterTestingModule, ItemAddComponent],
      providers: [
        ItemService,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemAddComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Create inventory item tests
  it('should have a valid form when all fields are filled correctly', () => {
    component.itemForm.controls['category'].setValue('Electronics');  // Fill in the form
    component.itemForm.controls['supplier'].setValue('Tech Tonic');
    component.itemForm.controls['name'].setValue('Test');
    component.itemForm.controls['description'].setValue('Truly delightful');
    component.itemForm.controls['quantity'].setValue('88');
    component.itemForm.controls['price'].setValue('29.99');

    expect(component.itemForm.valid).toBeTrue();                      // Validate the form
  });

  it('should call addItem and navigate on successful form submission', () => {
    const date = new Date().toISOString();  // Get the current date

    const addItemDTO: AddItemDTO = {        // Create the item to be added
      categoryId: 11,
      supplierId: 12,
      name: 'whizgig',
      description: 'hot new item',
      quantity: 5,
      price: 15.45,
      dateCreated: date
    };

    const mockItem: Item = {
      _id: '1',
      categoryId: 11,
      supplierId: 12,
      name: 'whizgig',
      description: 'hot new item',
      quantity: 5,
      price: 15.45,
      dateCreated: date
    };

    spyOn(itemService, 'addItem').and.returnValue(of(mockItem));
    spyOn(router, 'navigate');

    component.itemForm.controls['category'].setValue(addItemDTO.categoryId);  // Fill in the form details with the DTO properties
    component.itemForm.controls['supplier'].setValue(addItemDTO.supplierId);
    component.itemForm.controls['name'].setValue(addItemDTO.name);
    component.itemForm.controls['description'].setValue(addItemDTO.description);
    component.itemForm.controls['quantity'].setValue(addItemDTO.quantity);
    component.itemForm.controls['price'].setValue(addItemDTO.price);
    component.onSubmit();                                                     // Call the addItem service

    expect(itemService.addItem).toHaveBeenCalled();                           // Check that the addItem service was called

    const calledArg = (itemService.addItem as jasmine.Spy).calls.mostRecent().args[0];
    expect(calledArg.categoryId).toBe(addItemDTO.categoryId);                 // Check that the addItem service was called with the details of the DTO
    expect(calledArg.supplierId).toBe(addItemDTO.supplierId);
    expect(calledArg.name).toBe(addItemDTO.name);
    expect(calledArg.description).toBe(addItemDTO.description);
    expect(calledArg.quantity).toBe(addItemDTO.quantity);
    expect(calledArg.price).toBe(addItemDTO.price);

    expect(typeof calledArg.dateCreated).toBe('string');
    expect(Date.parse(calledArg.dateCreated)).not.toBeNaN();

    expect(router.navigate).toHaveBeenCalledWith(['/items']);                 // Navigate back to Item List upon success
  });

  it('should handle error on form submission failure', () => {
    spyOn(itemService, 'addItem').and.returnValue(throwError('Error creating item')); // Simulate an error
    spyOn(console, 'error');

    component.itemForm.controls['category'].setValue('Electronics');                  // Add some data to the form
    component.itemForm.controls['supplier'].setValue('Tech Tonic');
    component.itemForm.controls['name'].setValue('Test');
    component.itemForm.controls['description'].setValue('Truly delightful');
    component.itemForm.controls['quantity'].setValue('88');
    component.itemForm.controls['price'].setValue('29.99');
    component.onSubmit();                                                             // Submit the form

    expect(itemService.addItem).toHaveBeenCalled();                                   // Check for an error message
    expect(console.error).toHaveBeenCalledWith('Error creating item', 'Error creating item');
  });
});
