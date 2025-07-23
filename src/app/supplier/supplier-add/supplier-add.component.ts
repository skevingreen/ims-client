import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupplierService } from '../supplier.service';
import { AddSupplierDTO } from '../supplier';

@Component({
  selector: 'app-supplier-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  template: `
    <div class="supplier-add-page">
      <h1 class="supplier-add-page__title">Add New Supplier</h1>
      <h4 class="supplier-add-page__subtitle">Fill in the details to create a new supplier.</h4>

      <div class="supplier-add-page__card">
        <form [formGroup]="supplierForm" class="supplier-add-page__form">
          <div class="supplier-add-page__form-group">
            <label for="supplierName" class="supplier-add-page__form-label">Supplier Name</label>
            <input type="text" id="supplierName" class="supplier-add-page__form-control" formControlName="supplierName" />
          </div>

          <div class="supplier-add-page__form-group">
            <label for="contactInformation" class="supplier-add-page__form-label">Contact Information</label>
            <input type="text" id="contactInformation" class="supplier-add-page__form-control" formControlName="contactInformation" />
          </div>

          <div class="supplier-add-page__form-group">
            <label for="address" class="supplier-add-page__form-label">Address</label>
            <input type="text" id="address" class="supplier-add-page__form-control" formControlName="address" />
          </div>

          <div class="supplier-add-page__form-group">
            <label for="dateCreated" class="supplier-add-page__form-label">Date Created</label>
            <input type="datetime-local" id="dateCreated" class="supplier-add-page__form-control" formControlName="dateCreated" />
          </div>

          <button type="submit" class="supplier-add-page__btn" (click)="onSubmit()">Add Supplier</button>
        </form>
      </div>

      <br />
      <a class="supplier-add-page__link" routerLink="/suppliers">Return</a>
    </div>
  `,
  styles: `
     /* .supplier-add styles */
    .supplier-add-page {
      max-width: 80%;
      margin: 0 auto;
      padding: 20px;
    }

    .supplier-add-page__title {
      text-align: center;
      color: rgb(112, 177, 247);
    }

    .supplier-add-page__subtitle {
      text-align: center;
      color: rgb(112, 177, 247);
      font-size: 0.9rem;
      font-style: italic;
      margin-bottom: 20px;
    }

    .supplier-add-page__form {
      display: flex;
      flex-direction: column;
    }

    .supplier-add-page__form-group {
      margin-bottom: 15px;
    }

    .supplier-add-page__form-label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: rgb(112, 177, 247);
    }

    .supplier-add-page__form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }

    .supplier-add-page__btn {
      padding: 10px 15px;
      background-color: rgb(112, 177, 247);
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      align-self: flex-start;
    }

    .supplier-add-page__btn:hover {
      background-color: rgb(28, 11, 153);
    }

    .supplier-add-page__link {
      color: rgb(112, 177, 247);
      text-decoration: none;
      display: block;
    }

    .supplier-add-page__link:hover {
      text-decoration: underline;
    }
  `
})
export class SupplierAddComponent {
  supplierForm: FormGroup = this.fb.group({
    supplierName: [null, [Validators.required, Validators.minLength(1)]],
    contactInformation: [null, [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
    address: [null, [Validators.required, Validators.minLength(3)]],
    dateCreated: [new Date().toISOString().substring(0, 16), Validators.required] // 👈 pre-filled ISO datetime for datetime-local input
  });

  constructor(private fb: FormBuilder, private router: Router, private supplierService: SupplierService) {}

  onSubmit() {
    if (this.supplierForm.valid) {
      const dateCreated = new Date(this.supplierForm.controls['dateCreated'].value).toISOString();

      const newSupplier: AddSupplierDTO = {
        supplierName: this.supplierForm.controls['supplierName'].value,
        contactInformation: this.supplierForm.controls['contactInformation'].value,
        address: this.supplierForm.controls['address'].value,
        dateCreated: dateCreated
      };

      console.log('Creating Supplier', newSupplier);

      this.supplierService.addSupplier(newSupplier).subscribe({
        next: (result: any) => {
          console.log(`Supplier created successfully: ${result.message}`);
          this.router.navigate(['/suppliers']);
        },
        error: (error) => {
          console.error('Error creating supplier', error);
        }
      });
    } else {
      alert('Please complete all fields.');
    }
  }
}
