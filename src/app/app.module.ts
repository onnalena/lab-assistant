import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzModalModule} from "ng-zorro-antd/modal";
import {UserService} from "./service/User.service";
import { ViewBookingsComponent } from './view-bookings/view-bookings.component';
import { ViewComputerLabsComponent } from './view-computer-labs/view-computer-labs.component';
import { ViewComputersComponent } from './view-computers/view-computers.component';
import { ViewUsersComponent } from './view-users/view-users.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { LayoutComponent } from './layout/layout.component';
import {NzRateModule} from "ng-zorro-antd/rate";
import {NzCommentModule} from "ng-zorro-antd/comment";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzDividerModule} from "ng-zorro-antd/divider";
import { DashboardComponent } from './dashboard/dashboard.component';
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzTableModule} from "ng-zorro-antd/table";
import {NZ_ICONS, NzIconModule} from "ng-zorro-antd/icon";
import {en_US, NZ_I18N} from "ng-zorro-antd/i18n";
import {FullscreenOverlayContainer, OverlayContainer} from "@angular/cdk/overlay";
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NzToolTipModule} from "ng-zorro-antd/tooltip";
import { ViewFeedbackComponent } from './view-feedback/view-feedback.component';

registerLocaleData(en);
const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  declarations: [
    AppComponent,
    UpdatePasswordComponent,
    LoginComponent,
    ViewBookingsComponent,
    ViewComputerLabsComponent,
    ViewComputersComponent,
    ViewUsersComponent,
    UserRegistrationComponent,
    LayoutComponent,
    DashboardComponent,
    ViewFeedbackComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzModalModule,
    NzRateModule,
    NzCommentModule,
    FormsModule,
    NzLayoutModule,
    NzDrawerModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzSpaceModule,
    NzCardModule,
    NzStatisticModule,
    NzTableModule,
    NzIconModule,
    AppRoutingModule,
    HttpClientModule,
    NzButtonModule,
    NzMenuModule,
    BrowserAnimationsModule,
    NzToolTipModule
  ],
  providers: [UserService, { provide: NZ_I18N, useValue: en_US }, { provide: NZ_ICONS, useValue: icons }, { provide: OverlayContainer, useClass: FullscreenOverlayContainer}],
  bootstrap: [AppComponent]
})
export class AppModule { }
