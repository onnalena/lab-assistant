import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserRegistrationComponent} from "./user-registration/user-registration.component";
import {LoginComponent} from "./login/login.component";
import {ViewUsersComponent} from "./view-users/view-users.component";
import {ViewBookingsComponent} from "./view-bookings/view-bookings.component";
import {ViewComputersComponent} from "./view-computers/view-computers.component";
import {ViewComputerLabsComponent} from "./view-computer-labs/view-computer-labs.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {UpdatePasswordComponent} from "./update-password/update-password.component";
import {LayoutComponent} from "./layout/layout.component";

const routes: Routes = [
  { path: "", component: UserRegistrationComponent},
  { path: "home", component: LayoutComponent, children: [
      { path: "view-users", component: ViewUsersComponent},
      { path: "view-bookings", component: ViewBookingsComponent},
      { path: "view-computers", component: ViewComputersComponent},
      { path: "view-computer-labs", component: ViewComputerLabsComponent},
      { path: "dashboard", component: DashboardComponent}
    ]},
  { path: "user-registration", component:  UserRegistrationComponent},
  { path: "login", component: LoginComponent},
  { path: "update-password", component: UpdatePasswordComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
