import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://127.0.0.1:8000/'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAll() : Observable<any>{
    return this.http.get<any>(API_URL + 'products/');
  }
  getFirstByCategoryId(id: number) : Observable<any>{
    return this.http.get<any>(API_URL + 'get_product_selected_category/' + id);
  }
  create(product:any) : Observable<any>{
    return this.http.post<any>(API_URL + 'products/', product)
  }

  update(product:any) : Observable<any>{
    return this.http.put<any>(API_URL + 'products/' + product.id, product)
  }

  delete(id:any) : Observable<any>{
    return this.http.delete<any>(API_URL + 'products/' + id)
  }
}
