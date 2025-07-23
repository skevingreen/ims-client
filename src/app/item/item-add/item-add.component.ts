/**
 * Authors: Dua Hasan, Scott Green
 * Date: 15 July 2025
 * File: item-add.component.ts
 * Description: Component for adding an item to the database.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemService } from '../item.service';
import { Category } from '../../category/category';
import { Supplier } from '../../supplier/supplier';
import { AddItemDTO } from '../item';
import { CategoryService } from '../../category/category.service';
import { SupplierService } from '../../supplier/supplier.service';
@Component({
  selector: 'app-item-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="item-add-page">
      <h1 class="item-add-page__title">Add New Item Page</h1>
      <h4 class="item-add-page__subtitle">Fill in the details to add a new item.</h4>

      <div class="item-add-page__card">
        <form [formGroup]="itemForm" class="item-add-page__form">
          <div class="item-add-page__form-row">
            <div class="item-add-page__form-group">
              <label for="category" class="item-add-page__form-label">Category</label>
              <select id="category" class="item-add-page__form-control" formControlName="category">
                <!-- Populate the category drop down -->
                @for(category of categories; track category) {
                    <option value="{{ category.categoryId }}">{{ category.categoryName }}</option>
                  }
              </select>
            </div>

            <div class="item-add-page__form-group">
              <label for="supplier" class="item-add-page__form-label">Supplier</label>
              <select id="supplier" class="item-add-page__form-control" formControlName="supplier">
                <!-- Populate the supplier drop down -->
                @for(supplier of suppliers; track supplier) {
                    <option value="{{ supplier.supplierId }}">{{ supplier.supplierName }}</option>
                  }
              </select>
            </div>
          </div>

          <!-- Populate remaining form fields -->
          <div class="item-add-page__form-row">
            <div class="item-add-page__form-group">
              <label for="name" class="item-add-page__form-label">Name</label>
              <input type="text" id="name" class="item-add-page__form-control" formControlName="name">
            </div>

            <div class="item-add-page__form-group">
              <label for="description" class="item-add-page__form-label">Description</label>
              <input type="text" id="description" class="item-add-page__form-control" formControlName="description">
            </div>
          </div>

          <div class="item-add-page__form-row">
            <div class="item-add-page__form-group">
              <label for="quantity" class="item-add-page__form-label">Quantity</label>
              <input type="text" id="quantity" class="item-add-page__form-control" formControlName="quantity">
            </div>

            <div class="item-add-page__form-group">
              <label for="price" class="item-add-page__form-label">Price</label>
              <input type="text" id="price" class="item-add-page__form-control" formControlName="price">
            </div>
          </div>

          <!-- Add Item button should call onSubmit() -->
          <button type="submit" (click)="onSubmit()" class="item-add-page__btn">Add Item</button>
        </form>
      </div>

      <br />
      <a class="item-add-page__link" routerLink="/items">Return</a>
    </div>
  `,
  styles: `
    select {
      border: 1px solid rgb(112, 177, 247);
      color: rgb(112, 177, 247);
      background-color: #FFF;
      width: 10%;
    }

    /*
    .item-page__icon-link:hover {
      color: rgb(28, 11, 153);
    }
    */

    /* .item-add styles */
    .item-add-page {
      max-width: 80%;
      margin: 0 auto;
      padding: 20px;
    }

    .item-add-page__title {
      text-align: center;
      color: rgb(112, 177, 247);
    }

    .item-add-page__subtitle {
      text-align: center;
      color: rgb(112, 177, 247);;
      font-size: 0.9rem;
      font-style: italic;
      margin-bottom: 20px;
    }

    .item-add-page__form {
      display: ﬂex;
      ﬂex-direction: column;
    }

    .item-add-page__form-group {
      margin-bottom: 15px;
    }

    .item-add-page__form-label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: rgb(112, 177, 247);
    }

    .item-add-page__form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }

    .item-add-page__btn {
      padding: 10px 15px;
      background-color: rgb(112, 177, 247);
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      align-self: ﬂex-start;
    }

    .item-add-page__btn:hover {
      background-color: rgb(28, 11, 153);
    }

    .item-add-page__link {
      color: rgb(112, 177, 247);
      text-decoration: none;
      display: block;
    }

    .item-add-page__link:hover {
      text-decoration: underline;
    }
  `
})
export class ItemAddComponent {
  categories: Category[] = [];  // Holder for list of categories
  suppliers: Supplier[] = [];   // Holder for list of suppliers

  itemForm: FormGroup = this.fb.group({ // Form validations
    category: [null, Validators.required],
    supplier: [null, Validators.required],
    name: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
    description: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
    quantity: [null, Validators.required],
    price: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private itemService: ItemService
   ){
      // Call the category service to retrieve a list of categories for the drop-down
      this.categoryService.getCategories().subscribe({
        next: (categories: any) => {
          this.categories = categories;
        }
      });

      // Call the supplier service to retrieve a list of suppliers for the drop-down
      this.supplierService.getSuppliers().subscribe({
        next: (suppliers: any) => {
          this.suppliers = suppliers;
        }
      });
  }

  // Save the new inventoryItem
  onSubmit() {
    if (this.itemForm.valid) {
      const dateNow = new Date().toISOString();                         // Item is new so set the date to now

      const newItem: AddItemDTO = {                                     // Created the AddItemDTO to be added to the database
        categoryId: parseInt(this.itemForm.controls['category'].value), // Set the categoryId to the integer form of the selected category's id
        supplierId: parseInt(this.itemForm.controls['supplier'].value), // Set the supplierId to the integer form of the selected supplier's id
        name: this.itemForm.controls['name'].value,                     // Set the name based on form name
        description: this.itemForm.controls['description'].value,       // Set the description based on form description
        quantity: parseInt(this.itemForm.controls['quantity'].value),   // Set the quantity to the integer version of the form's quantity
        price: parseFloat(this.itemForm.controls['price'].value),       // Set the price to the float version of the form's price
        dateCreated: dateNow                                            // Use the variable created above to set the date
      }

      this.itemService.addItem(newItem).subscribe({                     // Call the addItem function of the itemService to add the new item to the database
        next: (result: any) => {
          this.router.navigate(['/items']);                             // Automatically return to the item details page
        },
        error: (err: any) => {
          console.error('Error creating item', err);                    // Catch any errors and log them to the console
        }
      });
    } else {
      alert('Please complete all fields.');
    }
  }
}
