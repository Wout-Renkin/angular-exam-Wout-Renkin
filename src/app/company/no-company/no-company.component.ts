import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-company',
  templateUrl: './no-company.component.html',
  styleUrls: ['./no-company.component.scss']
})
export class NoCompanyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //This page is only used to show a mat-card with information and a button to redirect to create company
  }

}
