/**
 * Authors: Dua Hasan, Scott Green
 * Date: 4 July 2025
 * File: home.component.ts
 * Description: Component to display Home page content.
 */

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <h2>Welcome to the Inventory Management System</h2>
      <p>
        The idea of the Inventory Management System was inspired by the need for businesses to manage their inventory efficiently.
        whether you are a small business owner looking to keep track of stack levels or a warehouse manager needing to organize inventory,
        the Inventory management System is designed to cater your needs.
      </p>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 600px;
      margin: 60px auto;
      padding: 30px;
      background-color: #ffffff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-radius: 12px;
    }

    p {
      color: rgb(112, 177, 247);
    }

    h2 {
      font-size: 20px;
      margin-bottom: 16px;
      color: rgb(112, 177, 247);
      text-align: center;
    }

    .server-message-box {
      background-color: #f0f8ff;
      border-left: 4px solid #007bff;
      padding: 16px;
      font-size: 15px;
      color: #004085;
      border-radius: 6px;
    }
  `]
})
export class HomeComponent {
  serverMessage: string = '';

  constructor(private http: HttpClient) {}
}
