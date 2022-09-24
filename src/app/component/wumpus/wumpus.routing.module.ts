import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { WumpusComponent } from "./component/wumpus.component";

const routes = [
  {
    path: 'game/:column/:row/:pit/:arrow',
    component: WumpusComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class WumpusRoutingModule {}
