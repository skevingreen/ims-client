/**
 * Authors: Dua Hasan, Scott Green
 * Date: 18 July 2025
 * File: item.service.spec.ts
 * Description: Unit tests for item.service.
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemService } from './item.service';
import { Item, UpdateItemDTO } from './item';
import { environment } from '../../environments/environment';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemService]
    });

    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a list of items from the API', () => {
    const mockItems: Item[] = [ // mock two inventoryItems
      {
        _id: '1',
        categoryId: 1,
        supplierId: 1,
        name: 'test 1',
        description: 'test this one',
        quantity: 1,
        price: 1.11,
        dateCreated: '2021-01-01T00:00:00.000Z',
        dateModified: '2021-01-01T00:00:00.000Z'
      },
      {
        _id: '2',
        categoryId: 2,
        supplierId: 2,
        name: 'test 2',
        description: 'test that one',
        quantity: 2,
        price: 2.22,
        dateCreated: '2022-02-02T00:00:00.000Z',
        dateModified: '2022-02-02T00:00:00.000Z'
      }
    ];

    service.getItems().subscribe(items => { // "search" for the items
      expect(items.length).toBe(2);         // two items should be found
      expect(items).toEqual(mockItems);     // the items returned should match the mockItems
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/items`);    // simulate the backend api call
    expect(req.request.method).toBe('GET');                                   // this should be a GET call
    req.flush(mockItems);
  });

  it('should update an existing item via the API', () => {
    const updatedItem: UpdateItemDTO = {  // created the updates to be made
      categoryId: 9999,
      supplierId: 9000,
      name: 'Wall Clock',
      description: 'Decorative Digital Clock',
      quantity: 21,
      price: 37.77,
    };

    const mockResponse: Item = {  // mock the response received, which should nw include _id
      _id: '3f',
      ...updatedItem  // expand updated item
    };

    service.updateItem('1', updatedItem).subscribe(item => {  // "call" the updateItem service method
      expect(item).toEqual(mockResponse);                     // the response should match above mock
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/items/1`);  // mock the http call to the api

    expect(req.request.method).toBe('PATCH');                                 // it should have been called as a PATCH
    expect(req.request.body).toEqual(updatedItem);                            // the body of the request should match our updatedItem
    req.flush(mockResponse);
  });

  it('should retrieve an array of items by categoryId via the API', () => {
    const mockItems: Item[] = [ // create an array of items containing one item
      {
        _id: '2',
        categoryId: 2,
        supplierId: 2,
        name: 'test 2',
        description: 'test that one',
        quantity: 2,
        price: 2.22,
        dateCreated: '2022-02-02T00:00:00.000Z',
        dateModified: '2022-02-02T00:00:00.000Z'
      }
    ];

    service.searchItems('2').subscribe(items => { // "search" for the item with the specified id
      expect(items.length).toBe(1);               // one item should be found
      expect(items).toEqual(mockItems);           // that item should match our mocked item
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/items/bycategory/2`); // "call" the search api
    expect(req.request.method).toBe('GET');                                             // the method used should be a GET
    req.flush(mockItems);
  });
});
