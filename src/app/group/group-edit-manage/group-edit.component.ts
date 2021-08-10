import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { mimeType } from 'src/app/company/company-create/mime-type.validator';
import { CompanyService } from 'src/app/company/company.service';
import { Company } from 'src/app/models/company.model';
import { Group } from 'src/app/models/group.model';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit, OnDestroy {
  //Subscriptions
  companySub: Subscription;
  groupSub: Subscription;

  //Variables
  company: Company;
  group: Group;
  form: FormGroup;
  color;
  editMode: boolean = false;
  imagePreview: string;

  //Event emitter to let parent know we are editting
  @Output() editModerator: EventEmitter<boolean> = new EventEmitter();
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(private companyService: CompanyService, private groupService: GroupService) { }

  ngOnInit(): void {

    //Initiate form
    this.form = new FormGroup({
      'name': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'color': new FormControl(null),
      'imagePath': new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
    })

    //Company subscription
    this.companySub = this.companyService.company.subscribe((company) => {
      this.company = company;
    });

    //Group subscription, we send our group over from the group list page if we edit.
    this.groupSub = this.groupService.selectedItem.subscribe((group) => {
      this.group = group;
      if(this.group) {
        //If we have a group we enter edit mode and initiate all values needed. We emit editModerator so our list page knows we can show the edit page
        //This information is normally filled in the create form but the create form is hidden when we have a groupmoderator on the page
        this.editMode = true;
        this.form.setValue({
          name: this.group.name,
          color: this.group.themeColor,
          imagePath: this.group.imagePath,
        })
        this.imagePreview = this.group.imagePath;
        this.color = this.group.themeColor;
        this.editModerator.emit(true)
      }
    })
  }

  //Submit form depending if we are editing or creating
  onSubmit() {
    if (this.form.invalid) {
      return;
    } else {
      if(this.editMode) {
        this.editMode = false;
        this.groupService.updateGroup(this.group, this.form.value);
        this.groupService.sendSelectedItem(null);
        this.group = null;
        this.editModerator.emit(false)
      } else {
        this.form.value.color = this.color;
        this.groupService.createGroup(this.form.value, this.company.id);
      }
      this.color = null;

      //Special reset so form is untouched etc
      this.formGroupDirective.resetForm();

    }
  }

  //Button to switch to create mode
  switchToAdd() {
    this.form.reset();
    this.editMode = false;
    this.groupService.sendSelectedItem(null);
    this.group = null;
    this.editModerator.emit(false)
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

  //destroy subscription
  ngOnDestroy() {
    this.companySub.unsubscribe();
    this.groupSub.unsubscribe();
  }

}
