/**
 * Authors: Dua Hasan, Scott Green
 * Date: 4 July 2025
 * File: category.service.ts
 * Description: Service for performing actions on Categories.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Category } from './category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }

  // Retrieve all categories from the database.
  getCategories() {
    return this.http.get<Category[]>(`${environment.apiBaseUrl}/api/categories`);
  }
}
