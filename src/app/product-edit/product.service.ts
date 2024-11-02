// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://projeto-mobile-api.vercel.app/api/v1';

  constructor(private http: HttpClient) {}

  // Método para buscar o produto pelo ID
  getProductById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/product/findId/${id}`);
  }

  // Método para atualizar o produto
  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/stock/update/${id}`, productData);
  }
}
