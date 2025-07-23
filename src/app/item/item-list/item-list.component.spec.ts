/**
 * Authors: Dua Hasan, Scott Green
 * Date: 18 July 2025
 * File: item-list.component.spec.ts
 * Description: Unit tests for item-list component.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemListComponent } from './item-list.component';
import { ItemService } from '../item.service';
import { throwError } from 'rxjs';
import { Item } from '../item';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let itemService: ItemService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ItemListComponent],
      providers: [ItemService]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Tests for listing all inventory items
  it('should display records in the DOM', () => {
    const mockItems: Item[] = [
      { _id: '12345',
        categoryId: 1,
        supplierId: 3,
        name: 'Item 1',
        description: 'Description 1',
        quantity: 11,
        price: 9.99,
        dateCreated: '2024-09-04T21:39:36.605Z',
        dateModified: '2024-09-04T21:39:36.605Z'
      },
      { _id: '67890',
        categoryId: 2,
        supplierId: 4,
        name: 'Item 2',
        description: 'Description 2',
        quantity: 14,
        price: 19.99,
        dateCreated: '2024-09-05T25:35:56.605Z',
        dateModified: '2024-09-04T21:39:36.605Z'
      }
    ];

    component.items = mockItems;
    fixture.detectChanges();                  // Trigger change detection

    const itemRows = fixture.debugElement.queryAll(By.css('.item-page__table-body .item-page__table-row'));
    expect(itemRows.length).toBeGreaterThan(0); // Check that there are item rows in the DOM
  });

  it('should handle error when fetching items', () => {
    spyOn(itemService, 'getItems').and.returnValue(throwError('Error fetching items'));
    fixture.detectChanges(); // Trigger the component's constructor
    expect(component.items.length).toBe(0); // Check that there were no items returned
  });

  it('should render heading', () => {
    const fixture = TestBed.createComponent(ItemListComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.item-page__title')?.textContent).toContain('Item List');  // Check that the page heading was displayed
  });

  // Tests for deleting an item
  it('should delete an item successfully when user confirms', () => {
    const mockItem = {
      _id: 'abc123',
      name: 'Test Item',
      categoryId: 1,
      supplierId: 1,
      description: 'desc',
      quantity: 5,
      price: 10,
      dateCreated: '',
      dateModified: ''
    };

    component.items = [mockItem];
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(itemService, 'deleteItem').and.returnValue(of({}));

    component.deleteItem(mockItem._id);

    expect(itemService.deleteItem).toHaveBeenCalledWith(mockItem._id);
    expect(component.items.length).toBe(0);
    expect(component.serverMessageType).toBe('success');
    expect(component.serverMessage).toContain('deleted successfully');
  });

  it('should not delete item when user cancels confirmation', () => {
    const mockItem = { _id: 'abc123', name: 'Item X', categoryId: 1, supplierId: 1, description: '', quantity: 1, price: 1, dateCreated: '', dateModified: '' };
    component.items = [mockItem];
    spyOn(window, 'confirm').and.returnValue(false); // user cancels
    spyOn(itemService, 'deleteItem');

    component.deleteItem(mockItem._id);

    expect(itemService.deleteItem).not.toHaveBeenCalled();
    expect(component.items.length).toBe(1); // item is still there
  });

  it('should handle error during deletion', () => {
    const mockItem = { _id: 'abc123', name: 'Item Y', categoryId: 1, supplierId: 1, description: '', quantity: 1, price: 1, dateCreated: '', dateModified: '' };
    component.items = [mockItem];
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(itemService, 'deleteItem').and.returnValue(throwError(() => new Error('Deletion failed')));

    component.deleteItem(mockItem._id);

    expect(itemService.deleteItem).toHaveBeenCalledWith(mockItem._id);
    expect(component.serverMessageType).toBe('error');
    expect(component.serverMessage).toContain('Error occurred while deleting');
    expect(component.items.length).toBe(1); // item still in list
  });

  // Tests for searching for an item by category
  it('should update items when filterItems is called and service returns items', () => {
    const mockItems: Item[] = [{ // Mock an array of items
      _id: '1357ace2468abce',
      name: 'Coastal Collection',
      categoryId: 4000,
      supplierId: 4,
      description: 'Four Post Bed',
      quantity: 5,
      price: 599.99,
      dateCreated: '2024-09-04T21:39:36.605Z'
    }];

    spyOn(itemService, 'searchItems').and.returnValue(of(mockItems));
    fixture.detectChanges();  // Simulate dropdown changing

    component.filterType = '4000';
    component.filterItems();  // Call the filterItems method with a categoryId selection of 4000

    expect(itemService.searchItems).toHaveBeenCalledWith('4000'); // Check filterItems to have called searchItems
    expect(component.items).toEqual(mockItems);                   // Check that the returned array is same as the mock
  });

  it('should clear items and log error when service throws error', () => {
    spyOn(console, 'error');
    spyOn(itemService, 'searchItems').and.returnValue(throwError('Error searching items'));

    component.items = [{
      _id: '1357ace2468abce',
      name: 'Coastal Collection',
      categoryId: 4000,
      supplierId: 4,
      description: 'Four Post Bed',
      quantity: 5,
      price: 599.99,
      dateCreated: '2024-09-04T21:39:36.605Z'
     }];

    component.filterType = '4000';
    component.filterItems();

    expect(itemService.searchItems).toHaveBeenCalledWith('4000');  // Same as above but this time we expect an error
    expect(component.items).toEqual([]);                           // No items should be returned on error
    expect(console.error).toHaveBeenCalledWith('Error retrieving items by category', 'Error searching items');  // We should have an error message
  });

  it('should set items to empty array when searchItems returns no results', () => {
    spyOn(itemService, 'searchItems').and.returnValue(of([]));
    component.items = [];
    /*
    component.items = [{  // Simulate a list of items
      _id: '1357ace2468abce',
      name: 'Coastal Collection',
      categoryId: 4000,
      supplierId: 4,
      description: 'Four Post Bed',
      quantity: 5,
      price: 599.99,
      dateCreated: '2024-09-04T21:39:36.605Z'
    }];
    */

    component.filterType = '4000';
    component.filterItems();  // Search for only items with categoryId 4000

    expect(itemService.searchItems).toHaveBeenCalledWith('4000');
    expect(component.items).toEqual([]);
  });
});
