import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { MainPageRoutingModule } from './main-page-routing.module';
import { RouterModule } from '@angular/router';
import {DropdownModule} from "primeng/dropdown";
import {PaginatorModule} from "primeng/paginator";
import {TagModule} from "primeng/tag";
import {ButtonModule} from "primeng/button";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    MainPageRoutingModule,
    DropdownModule,
    PaginatorModule,
    TagModule,
    ButtonModule,
    TranslateModule
  ]
})
export class MainPageModule { }
