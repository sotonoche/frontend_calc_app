import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../services/product/product.service';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { TransferService } from '../../services/transfer/transfer.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [MatButtonModule,
            MatIconModule,
            NgFor,
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
  constructor(private productService: ProductService, private router: Router, private transferService: TransferService) {}
  products: any[] = [];
  ngOnInit(){
    //this.productService.getAll().subscribe((data: any) => this.products=data);
    this.productService.getAll().subscribe({
      next: (data: any[]) => {
        this.products = data;
      },
      complete: () => {
        console.log(this.products);
      }
    });
  }
  on_product_open(product: any){
    this.transferService.setData(product);
    this.router.navigate(['product']);
    console.log(product);
  }
}
