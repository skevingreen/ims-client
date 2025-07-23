/**
 * Authors: Richard Krasso, Dua Hasan, Scott Green
 * Date: 4 July 2025
 * File: app.component.spec.ts
 * Description: Component to display shared content such as header, nav, footer.
 */

import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="container">
      <header>
        <h1>Inventory Management System</h1>
      </header>
      <nav>
        <ul>
          <li><a routerLink="/"><i class="fas fa-home"></i>&nbsp;Home</a></li>
          <li><a routerLink="/suppliers"><i class="fas fa-truck"></i>&nbsp;Suppliers</a></li>
          <li><a routerLink="/items"><i class="fas fa-box"></i>&nbsp;Items</a></li>
        </ul>
      </nav>
      <main>
        <section>
          <router-outlet />
        </section>
      </main>
      <footer>
        <p>&copy; 2025 Inventory Management System</p>
      </footer>
    </div>
  `,
  styles: `

    .container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-family: 'Segoe UI', sans-serif;
      background-color: #f5f5f5;
    }

    header {
      background-color:rgb(112, 177, 247);
      color: white;
      padding: 20px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    header h1 {
      margin: 0;
      font-size: 28px;
      text-align: center;
    }

    nav {
      background-color:rgb(242, 243, 244);
      padding: 10px 0;
      display: flex;
      justify-content: center;
    }

    nav ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
      display: flex;
      gap: 20px;
    }

    nav ul li a {
      color:rgb(112, 177, 247);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }

    nav ul li a:hover {
      color:rgb(28, 11, 153);
    }

    main {
      flex: 1;
      padding: 20px;
      background-color: #ffffff;
    }

    /* this creates a card effect in the middle third of the page */
    /*
    section {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    }
    */

    footer {
      background-color:rgb(112, 177, 247);
      padding: 12px 0;
      border-top: 1px solid #dee2e6;
      font-size: 14px;
      color:rgb(246, 249, 253);
      text-align: center;
    }
  `
})
export class AppComponent {
  title = 'ims-client';
}
