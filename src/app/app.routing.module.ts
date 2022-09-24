import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./component/home/home.component";

const routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'wumpus',
    loadChildren: () => import('./component/wumpus/wumpus.module').then((m) => m.WumpusModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {

}
