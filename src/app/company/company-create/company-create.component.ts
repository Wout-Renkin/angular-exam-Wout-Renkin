import { Component, OnDestroy, OnInit} from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { Company } from "src/app/models/company.model";
import { CompanyService } from "../company.service";
import {mimeType} from "./mime-type.validator"

@Component({
  selector: 'app-company-create',
  templateUrl:'./company-create.component.html',
  styleUrls: ['./company-create.component.css']

})
export class CompanyCreateComponent implements OnInit, OnDestroy{
  //variables for 2 way binding so we can directly see color changes
  color;
  backgroundColor;
  form: FormGroup;
  imagePreview: string;
  mode = "create";
  companyId: number;
  companySub: Subscription;
  company: Company;

  constructor(public companyService: CompanyService, public route: ActivatedRoute) { }

    onCreateCompany() {

      if (this.form.invalid) {
        return;
      } else {
        this.form.value.color = this.color;
        this.form.value.backgroundColor = this.backgroundColor;
        if(this.mode == "edit") {
          console.log("we are here")
          this.companyService.updateCompany(this.form.value, this.company.id);
        } else {
          this.companyService.createCompany(this.form.value);
        }
      }
      }

  ngOnInit() {
    this.companySub = this.companyService.company.subscribe(company => {
      this.company = company;
    })

    this.form = new FormGroup({
      'name': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'city': new FormControl(null,  {validators: [Validators.required, Validators.minLength(3)]}),
      'street': new FormControl(null,  {validators: [Validators.required, Validators.minLength(3)]}),
      'streetNumber': new FormControl(null,  {validators: [Validators.required, Validators.minLength(3)]}),
      'description': new FormControl(null, {validators: [Validators.required]}),
      'backgroundColor': new FormControl(null),
      'color': new FormControl(null),
      'imagePath': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    })



    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has("companyId")) {

        this.mode = "edit";
        this.companyId = +paramMap.get("companyId");
        this.companyService.getCompany(this.companyId);

        if(this.company) {
          this.form.setValue({
            name: this.company.Name,
            city: this.company.City,
            street: this.company.Street,
            streetNumber: this.company.streetNumber,
            description: this.company.description,
            backgroundColor: this.company.backgroundColor,
            color: this.company.color,
            imagePath: this.company.imagePath
          })
          this.color = this.company.color;
          this.backgroundColor = this.company.backgroundColor;
          this.imagePreview = this.company.imagePath;
        }


      } else {
        this.company = null;
        this.mode = "create";
        this.companyId = null;
      }

    })


  }

  onImagePicked(event: Event) {
    const image = (event.target as HTMLInputElement).files[0];
    //patchvalue -> target a single value of the form
    this.form.patchValue({imagePath: image});
    //validate the image inserted in the image form
    this.form.get('imagePath').updateValueAndValidity();
    //create file reader
    const reader = new FileReader();
    //if it is done reading i want to save the result as a string in imagePreview
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    //Load the file
    reader.readAsDataURL(image)
  }

  ngOnDestroy() {
    this.companySub.unsubscribe();
  }


}
