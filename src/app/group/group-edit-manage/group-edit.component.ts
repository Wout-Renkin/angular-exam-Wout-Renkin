import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CompanyService } from 'src/app/company/company.service';
import { Company } from 'src/app/models/company.model';
import { Group } from 'src/app/models/group.model';
import { GroupService } from '../group.service';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css']
})
export class GroupEditComponent implements OnInit, OnDestroy {
  companySub: Subscription;
  company: Company;
  group: Group;
  groupSub: Subscription;
  editMode: boolean = false;
  @ViewChild('groupForm') slForm: NgForm;

  constructor(private companyService: CompanyService, private groupService: GroupService) { }

  ngOnInit(): void {
    this.companySub = this.companyService.company.subscribe((company) => {
      this.company = company;
    });

    this.groupSub = this.groupService.selectedItem.subscribe((group) => {
      this.group = group;
      if(this.group) {
        this.editMode = true;
        this.slForm.setValue({
          name: this.group.name,
        })
      }
    })



  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      if(this.editMode) {
        this.editMode = false;
        this.group.name = form.value.name
        this.groupService.updateGroup(this.group)
        this.group = null;
      } else {
        this.groupService.createGroup(form.value.name, this.company.id);
      }
      form.resetForm();
    }
  }

  switchToAdd() {
    this.slForm.reset();
    this.editMode = false;
    this.group = null;
  }

  ngOnDestroy() {
    this.companySub.unsubscribe();
    this.groupSub.unsubscribe();
  }

}
