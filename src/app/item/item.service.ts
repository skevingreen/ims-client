/**
 * Authors: Dua Hasan, Scott Green
 * Date: 15 July 2025
 * File: item.service.ts
 * Description: Service for performing actions on Items.
 */

import { AddItemDTO, Item, UpdateItemDTO } from './item';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  constructor(private http: HttpClient) { }

  // Retrieve all items from the database.
  getItems() {
    return this.http.get<Item[]>(`${environment.apiBaseUrl}/api/items`);
  }

  // Retrieves a particular item from the database
  getItem(inventoryItemId: string) {
    return this.http.get<Item>(`${environment.apiBaseUrl}/api/items/${inventoryItemId}`);
  }

  // Creates a new item in the database
  addItem(item: AddItemDTO) {
    return this.http.post<Item>(`${environment.apiBaseUrl}/api/items`, item);
  }

  // Updates an existing item in the database
  updateItem(inventoryItemId: string, updateItem: UpdateItemDTO) {
    return this.http.patch<Item>(`${environment.apiBaseUrl}/api/items/${inventoryItemId}`, updateItem);
  }

  // Removes an existing item from the database
  deleteItem(inventoryItemId: string) {
    return this.http.delete(`${environment.apiBaseUrl}/api/items/${inventoryItemId}`);
  }

  // Search for inventory items based on the provided category type
  searchItems(categoryId: string) {
    return this.http.get<Item[]>(`${environment.apiBaseUrl}/api/items/bycategory/${categoryId}`);
  }
}
