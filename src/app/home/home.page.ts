import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa o Router

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  products = [
    {
      name: 'Product 1',
      description: 'Description for product 1',
      icon: 'phone-portrait-outline',
      sku: '12345',
      quantity: 10,
      category: 'Electronics',
    },
    {
      name: 'Product 2',
      description: 'Description for product 2',
      icon: 'laptop-outline',
      sku: '67890',
      quantity: 5,
      category: 'Computers',
    },
    {
      name: 'Product 3',
      description: 'Description for product 3',
      icon: 'watch-outline',
      sku: '11223',
      quantity: 15,
      category: 'Accessories',
    },
  ];

  employees = [
    { name: 'Employee 1', position: 'Manager', id: 'E001' },
    { name: 'Employee 2', position: 'Developer', id: 'E002' },
    { name: 'Employee 3', position: 'Designer', id: 'E003' },
  ];

  constructor(private router: Router) {} // Injetando o Router

  addProduct() {
    // Redireciona para a página de criação de produtos
    this.router.navigate(['/product-creation']);
  }
}
