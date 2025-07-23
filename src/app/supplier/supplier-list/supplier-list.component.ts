/**
 * Authors: Dua Hasan, Scott Green
 * Date: 21 July 2025
 * File: supplier.ts
 * Description: Component to display and manipulate suppliers.
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Supplier } from '../../supplier/supplier';
import { SupplierService } from '../../supplier/supplier.service';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="supplier-page">
      <h1 class="supplier-page__title">Supplier List</h1>

      <!-- Open the add suppliers component. -->
      <input type="button" routerLink="/suppliers/add" value="Add suppliers" class="supplier-page__button" />

      <!-- Create the table to display results of suppliers query. -->
      @if (suppliers && suppliers.length > 0) {
        <table class="supplier-page__table">
          <!-- Table headings -->
          <thead class="supplier-page__table-head">
              <tr class="supplier-page__table-row">
              <th class="supplier-page__table-header">Supplier Id</th>
              <th class="supplier-page__table-header">Supplier Name</th>
              <th class="supplier-page__table-header">Contact Information</th>
              <th class="supplier-page__table-header">Address</th>
              <th class="supplier-page__table-header">Date Created</th>
              <th class="supplier-page__table-header">Functions</th>
            </tr>
          </thead>

          <!-- One table row per supplier -->
          <tbody class="supplier-page__table-body">
            @for (supplier of suppliers; track supplier) {
              <tr class="supplier-page__table-row">
                <td class="supplier-page__table-cell">{{ supplier.supplierId }}</td>
                <td class="supplier-page__table-cell">{{ supplier.supplierName }}</td>
                <td class="supplier-page__table-cell">{{ supplier.contactInformation }}</td>
                <td class="supplier-page__table-cell">{{ supplier.address }}</td>
                <td class="supplier-page__table-cell">{{ supplier.dateCreated }}</td>
                <td class="supplier-page__table-cell supplier-page__table-cell--functions">
                  <a routerLink="/suppliers/{{ supplier._id }}" class="supplier-page__icon-link"><i class="fas fa-edit"></i></a>
                </td>
              </tr>
            }
          </tbody>
        </table>
      } @else {
        <p class="supplier-page__no-suppliers">No suppliers found, consider adding one...</p>
      }
    </div>
  `,
  styles: `
      /* Main container styling. */
    .supplier-page {
      max-width: 80%;
      margin: 0 auto; /* top/bottom, right/left */
      padding: 20px;
    }

    .supplier-page__title {
      text-align: center;
      color:rgb(112, 177, 247);
    }

    /* Table styling. */
    .supplier-page__table {
      margin-top: 3rem;
      width: 98%;
      border-collapse: collapse;
    }

    .supplier-page__table-header {
      background-color: rgb(112, 177, 247);
      color: #FFF;
      border: 1px solid white;
      padding: 5px;
      text-align: left;
    }

    .supplier-page__table-cell {
      border: 1px solid rgb(112, 177, 247);
      padding: 5px;
      text-align: left;
      color: rgb(112, 177, 247);
    }

    .supplier-page__table-cell--functions {
      text-align: center;
    }

    .supplier-page__icon-link {
      cursor: pointer;
      color: rgb(112, 177, 247);
      text-decoration: none;
      margin: 0 5px;
    }

    .supplier-page__icon-link:hover {
      color: rgb(28, 11, 153);
    }

    .supplier-page__no-suppliers {
      text-align: center;
      color: #6c757d;
    }

    /* supplier styling. */
    .supplier-page__filter-container {
      display: ﬂex;
      align-suppliers: center;
      margin-bottom: 0rem;
    }

    .supplier-page__filter {
      flex: 1;
      padding: 0.5rem;
      margin-right: 0.5rem;
    }

    .supplier-page__button {
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

    .supplier-page__button:hover {
      background-color: rgb(28, 11, 153);
    }

    .supplier-page__highlight-info { text-align: center;
      color: #6c757d;
      margin-bottom: 1rem;
    }
  `
})
export class SupplierListComponent {
  suppliers: Supplier[] = [];  // Array to hold all returned suppliers.

  constructor(
    private supplierService: SupplierService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Retrieve a list of all categories from the database
    this.supplierService.getSuppliers().subscribe({
      next: (suppliers: any) => {
        this.suppliers = suppliers;
      },
      error: (err: any) => {  // Log any errors to the console
        console.error(`Error occurred while retrieving items: ${err}`);
        this.suppliers = [];  // Set list of suppliers to empty array
      }
    });
  }
}
