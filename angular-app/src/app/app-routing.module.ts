import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MessageComponent } from './message/message.component';
import { EditComponent } from './edit/edit.component';
import { SearchComponent } from './search/search.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ResetComponent } from './reset/reset.component';
import { PhotoComponent } from './photo/photo.component';


const routes: Routes = [
  {path: "", component: LoginComponent},
  {path: "profile/:id", component: ProfileComponent},
  {path: "home", component: HomeComponent},
  {path: "register", component: RegisterComponent},
  {path: "messages", component: MessageComponent},
  {path: "edit", component: EditComponent},
  {path: "results/:search", component: SearchComponent},
  {path: "forgot", component: ForgotComponent},
  {path: "reset/:token", component: ResetComponent},
  {path: "photo/:id", component: PhotoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
