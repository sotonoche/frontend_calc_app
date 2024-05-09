import { Component } from '@angular/core';
import { TransferService } from '../../services/transfer/transfer.service';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgFor } from '@angular/common';

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

  constructor(private transferService: TransferService) {
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
    if (this.product != null){
      this.load_data(this.product);
    }
    console.log(this.productForm.value);
  }

  load_data(product: any){
    this.productForm.patchValue({
      id : product.id,
      name : product.name,
      price : product.price,
      description : product.description,
      image: "",
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
    console.log(this.productForm.value);
  }
}
