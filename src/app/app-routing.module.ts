import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { CarsComponent } from './cars/cars.component';
import { PriceWatchComponent } from './price-watch/price-watch.component';
import { MindMapComponent } from './mind-map/mind-map.component';
import { Reconstruct3dComponent } from './reconstruct3d/reconstruct3d.component';
import { BotComponent } from './bot/bot.component';
import { LoginComponent } from './login/login.component';
import { BenzComponent } from './Benz/benz.component';

const routes: Routes = [
  {
    path: '',
    component: BotComponent,
    //component: HomeComponent,
    pathMatch: 'full'
  },
  
  {
    path:'contact',
    component: ContactComponent
  },
  {
    path: 'users',
     loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'cars',
    component: CarsComponent
  },
  {
    path: 'pricewatch',
    component: PriceWatchComponent
  },
  {
    path: 'mindmap',
    component: MindMapComponent
  },
  {
    path: 'reconstruct3d',
    component: Reconstruct3dComponent
  },
  {
    path: 'todolist',
    loadChildren: () => import('./todo-list/todo-list.module').then(m => m.TodoListModule)
  },
  {
    path: 'bot',
    component: BotComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: "display",
    component: BenzComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
