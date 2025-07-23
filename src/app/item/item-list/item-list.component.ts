/**
 * Authors: Dua Hasan, Scott Green
 * Date: 15 July 2025
 * File: item-list.component.ts
 * Description: Component to display and change Items.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../item.service';
import { Item } from '../item';
import { Category } from '../../category/category';
import { CategoryService } from '../../category/category.service';

@Component({
  selector: 'app-item-list-component',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="item-page">
      <h1 class="item-page__title">Item List</h1>

      <!-- Group the dropdown and button for filtering by category together -->
      <div class="item-page__filter-container">
        <!-- save the categoryId in filterType -->
        <select [(ngModel)]="filterType" class="item-page__filter" required>
          <!-- Show "All" categories selected by default. -->
          <option value="">All Categories</option>
          <!-- Take the list of categories returned from the database and populate the filter dropdown. -->
          @for(category of categories; track category) {
            <option value="{{ category.categoryId }}">{{ category.categoryId }} - {{ category.categoryName }}</option>
          }
        </select>

        <!-- Update the list of items displayed based on the selected category. -->
        <input type="button" (click)="filterItems()" value="Filter Items" class="item-page__button" />
      </div>

      <!-- Open the add items component. -->
      <input type="button" routerLink="/items/add" value="Add Items" class="item-page__button" />

      <!-- Create the table to display results of items query. -->
      @if (items && items.length > 0) {
        <table class="item-page__table">
          <thead class="item-page__table-head">
              <tr class="item-page__table-row">
              <th class="item-page__table-header">Item Id</th>
              <th class="item-page__table-header">Category Id</th>
              <th class="item-page__table-header">Supplier Id</th>
              <th class="item-page__table-header">Name</th>
              <th class="item-page__table-header">Description</th>
              <th class="item-page__table-header">Quantity</th>
              <th class="item-page__table-header">Price</th>
              <th class="item-page__table-header">Date Created</th>
              <th class="item-page__table-header">Functions</th>
            </tr>
          </thead>

          <tbody class="item-page__table-body">
            @for (item of items; track item) {
              <tr class="item-page__table-row">
                <td class="item-page__table-cell">{{ item._id }}</td>
                <td class="item-page__table-cell">{{ item.categoryId }}</td>
                <td class="item-page__table-cell">{{ item.supplierId }}</td>
                <td class="item-page__table-cell">{{ item.name }}</td>
                <td class="item-page__table-cell">{{ item.description }}</td>
                <td class="item-page__table-cell">{{ item.quantity }}</td>

                <!-- {{ Value | Number : ‘ {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits} ‘}} -->
                <!-- https://www.bacancytechnology.com/qanda/angular/format-float-double-with-angular -->
                <td class="item-page__table-cell">{{ item.price | number: '1.2-2' }}</td>

                <td class="item-page__table-cell">{{ item.dateCreated }}</td>
                <td class="item-page__table-cell item-page__table-cell--functions">
                  <a routerLink="/items/{{ item._id }}" class="item-page__icon-link"><i class="fas fa-edit"></i></a>
                  <a (click)="deleteItem(item._id)" class="item-page__icon-link"><i class="fas fa-trash-alt"></i></a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <p class="item-page__no-items">No items found, consider adding one...</p>
      }
    </div>
  `,
  styles: `
    /* Styling for dropdown. */
    select {
      width: 90%;
      border: 1px solid rgb(112, 177, 247);
      color: rgb(112, 177, 247);
      background-color: #FFF;
    }

    /* Main container styling. */
    .item-page {
      max-width: 80%;
      margin: 0 auto; /* top/bottom, right/left */
      padding: 20px;
    }

    .item-page__title {
      text-align: center;
      color:rgb(112, 177, 247);
    }

    /* Table styling. */
    .item-page__table {
      margin-top: 3rem;
      width: 98%;
      border-collapse: collapse;
    }

    .item-page__table-header {
      background-color: rgb(112, 177, 247);
      color: #FFF;
      border: 1px solid white;
      padding: 5px;
      text-align: left;
    }

    .item-page__table-cell {
      border: 1px solid rgb(112, 177, 247);
      padding: 5px;
      text-align: left;
      color: rgb(112, 177, 247);
    }

    .item-page__table-cell--functions {
      text-align: center;
    }

    .item-page__icon-link {
      cursor: pointer;
      color: rgb(112, 177, 247);
      text-decoration: none;
      margin: 0 5px;
    }

    .item-page__icon-link:hover {
      color: rgb(28, 11, 153);
    }

    .item-page__no-items {
      text-align: center;
      color: #6c757d;
    }

    /* Server message styling. */
    .message-alert {
      padding: 15px;
      margin-bottom: 20px;
      border: 1px solid transparent;
      border-radius: 4px;
      color: #a94442;
      background-color: #f2dede;
      border-color: #ebccd1;
    }

    .message-success {
      padding: 15px;
      margin-bottom: 20px;
      border: 1px solid transparent;
      border-radius: 4px;
      color: #3c763d;
      background-color: #dﬀ0d8;
      border-color: #d6e9c6;
    }

    .message-success { padding: 15px; margin-bottom: 20px;
      border: 1px solid transparent; border-radius: 4px;
      color: #3c763d; background-color: #dﬀ0d8;
      border-color: #d6e9c6;
    }

    /* Item styling. */
    .item-page__filter-container {
      display: ﬂex;
      align-items: center;
      margin-bottom: 0rem;
    }

    .item-page__filter {
      flex: 1;
      padding: 0.5rem;
      margin-right: 0.5rem;
    }

    .item-page__button {
      background-color:rgb(112, 177, 247);
      color: #fff;
      border: none;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      margin: 10px 2px;
      cursor: pointer;
      border-radius: 5px;
      transition: background-color 0.3s;
    }

    .item-page__button:hover {
      background-color: rgb(28, 11, 153);
    }

    .item-page__highlight-info { text-align: center;
      color: #6c757d;
      margin-bottom: 1rem;
    }
  `
})
export class ItemListComponent {
  items: Item[] = [];           // Array to hold all returned items.
  categories: Category[] = [];  // Array to hold all returned categories.
  filterType: string  = '';     // Default filter setting.
  serverMessage: string | null = null;
  serverMessageType: 'success' | 'error' | null = null;

  constructor(
    private itemService: ItemService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.getAllItems(); // show all items by default

    // Retrieve a list of all categories from the database
    this.categoryService.getCategories().subscribe({
      next: (categories: any) => {
        this.categories = categories;
      }
    });
  }

  getAllItems() {
    // Retrieve a list of all items from the database
    this.itemService.getItems().subscribe({
      next: (items: Item[]) => {
        this.items = items;
      },
      error: (err: any) => {
        console.error(`Error occurred while retrieving items: ${err}`);
        this.items = [];
      }
    });
  }

  deleteItem(itemId: string) {
    if (!confirm('Are you sure you want to delete this item?')){
      return;
    }

    this.itemService.deleteItem(itemId).subscribe({
      next: () => {
        console.log(`Item with ID ${itemId} deleted successfully`);
        this.items = this.items.filter(p => p._id !== itemId);
        this.serverMessageType = 'success';
        this.serverMessage = `item with ID ${itemId} deleted successfully`;
        this.clearMessageAfterDelay();
      },
      error: (err: any) => {
        console.error(`Error occurred while deleting item with ID ${itemId}: ${err} `);
        this.serverMessageType = 'error';
        this.serverMessage = `Error occurred while deleting item with ID ${itemId}. Please try again later.`;
        this.clearMessageAfterDelay();
      }
    });
  }

  private clearMessageAfterDelay() {
    setTimeout(() => {
      this.serverMessage = null;
      this.serverMessageType = null;
    }, 3000);
  }

  filterItems() {
    if (this.filterType === '') {
      this.getAllItems();                                           // if all categories is select, show everything
    } else {
      this.itemService.searchItems(this.filterType).subscribe({
        next: (items: Item[]) => {
          this.items = items;                                       // assign the retrieved items for a specific category
        },
        error: (err: any) => {
          console.error('Error retrieving items by category', err); // note any errors
          this.items = [];                                          // clear out the list of items
        }
      });
    }
  }
}
