import { Component } from '@angular/core';
import { TransferService } from '../../services/transfer/transfer.service';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';
import { CategoriesService } from '../../services/categories/categories.service';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ReactiveFormsModule,
            FormsModule,
            NgFor],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  productForm : FormGroup;
  product : any = null;
  isAdmin = true
  categories : any[] = [];
  isFirstProductOfCategory = false

  constructor(private transferService: TransferService, private categoryService: CategoriesService, private productService: ProductService) {
    this.productForm = new FormGroup({
      id : new FormControl(),
      name : new FormControl(),
      price : new FormControl(),
      description : new FormControl(),
      image: new FormControl(),
      image_file : new FormControl(),
      characteristics : new FormArray([]),
      category : new FormControl()
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
          //console.log(this.categories.find((c) => c.id === this.product.product_category))
          this.productForm.patchValue({
            category : this.categories.find((c) => c.id === this.product.product_category)
          })
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
        name: new FormControl(product.characteristics[i].name),
        value: new FormControl(product.characteristics[i].value)
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
    let product = {
      name: this.productForm.value.name,
      image: this.productForm.value.image,
      description: this.productForm.value.description,
      characteristics: this.productForm.value.characteristics,
      product_category: this.productForm.value.category.id,
      price: this.productForm.value.price
    }
    this.productService.create(product).subscribe({
      complete: () => console.log("ЖОПА")
      
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
              name: new FormControl(product.characteristics[i].name),
              value: new FormControl()
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
      name: new FormControl(),
      value: new FormControl()
    }))
  }

  remove_last_field(){
    this.characteristics.removeAt(
      this.characteristics.controls.length-1
    )
  }
}
