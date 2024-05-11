import { Component } from '@angular/core';
import { TransferService } from '../../services/transfer/transfer.service';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';
import { CategoriesService } from '../../services/categories/categories.service';
import { ProductService } from '../../services/product/product.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ReactiveFormsModule,
            FormsModule,
            NgFor,
            MatButtonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  productForm : FormGroup;
  product : any = null;
  isAdmin = false
  categories : any[] = [];
  isFirstProductOfCategory = false

  constructor(private transferService: TransferService, private categoryService: CategoriesService, private productService: ProductService, private router: Router) {
    this.productForm = new FormGroup({
      id : new FormControl(null),
      name : new FormControl("", [Validators.required]),
      price : new FormControl(0, [Validators.required]),
      description : new FormControl("", [Validators.required]),
      image: new FormControl(),
      image_file : new FormControl(null, [Validators.required]),
      characteristics : new FormArray([]),
      category : new FormControl(null, [Validators.required])
    });
  }
  ngOnInit(){
    this.product = this.transferService.getData();
    if (this.product){
      this.load_data(this.product);
    }
    console.log(this.product);
    this.categoryService.getAll().subscribe({
      next: (data:any) => this.categories = data,
      complete: () => {
        if (this.product != null) {
          this.productForm.patchValue({
            category : this.categories.find((c) => c.id === this.product.product_category)
          })
          this.productForm.get("image_file")?.clearValidators()
          this.productForm.get("image_file")?.updateValueAndValidity()
        }
        else {
          this.productForm.patchValue({
            category : this.categories[0]
          })
          this.on_category_change()
        }
      }           
    });
    
    console.log(this.productForm.value);
  }

  load_data(product: any){
    this.productForm.patchValue({
      id : product.id,
      name : product.name,
      price : product.price,
      description : product.description,
      image: 'data:image/jpg;base64,' + product.image,
      category : product.category
    });
    for (let i=0; i < product.characteristics.length; i++){
      this.characteristics.push(new FormGroup({
        name: new FormControl(product.characteristics[i].name, [Validators.required]),
        value: new FormControl(product.characteristics[i].value, [Validators.required])
      }
      ));
    };
  }

  get characteristics() {
    return this.productForm.get('characteristics') as FormArray;
}

   on_file_change(event : any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.productForm.patchValue({
          image: reader.result as string
        });
      }

      this.productForm.patchValue({
        image_file : file
      })
    }
  }

  confirm(){
    let product = this.create_product_from_form()
    if (!this.product) {
      this.productService.create(product).subscribe({
        complete: () => this.redirect_to_catalog()
        
      })
    }
    else{
      this.productService.update(product).subscribe({
        complete: () => this.redirect_to_catalog()
        
      })
    }
    
  }

  create_product_from_form(): any{
    let product = {
      id : this.productForm.value.id,
      name: this.productForm.value.name,
      image: this.productForm.value.image,
      description: this.productForm.value.description,
      characteristics: this.productForm.value.characteristics,
      product_category: this.productForm.value.category.id,
      price: this.productForm.value.price
    }
    return product
  }

  delete_product(){
    this.productService.delete(this.productForm.value.id).subscribe({
      complete: () => this.redirect_to_catalog()  
    })
  }

  on_category_change(){
    let product: any = null
    this.productService.getFirstByCategoryId(this.productForm.value.category.id).subscribe({
      next: (data:any) => product = data,
      complete: () => {
        if (product){
          this.isFirstProductOfCategory = false;
          this.characteristics.clear()
          for (let i=0; i < product.characteristics.length; i++){
            this.characteristics.push(new FormGroup({
              name: new FormControl(product.characteristics[i].name, [Validators.required]),
              value: new FormControl(null, [Validators.required])
            }
            ));
          };
        }
      },
      error: (err) => {
        this.isFirstProductOfCategory = true
        this.characteristics.clear()
      }
    })
  }

  on_fields_create(){
    this.characteristics.push(new FormGroup({
      name: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [Validators.required])
    }))
  }

  remove_last_field(){
    this.characteristics.removeAt(
      this.characteristics.controls.length-1
    )
  }

  redirect_to_catalog(){
    this.router.navigate(["catalog"])
  }
}
