import { NgModule } from "@angular/core";
import { WumpusComponent } from "./component/wumpus.component";
import { WumpusRoutingModule } from "./wumpus.routing.module";
import { LottieModule } from "ngx-lottie";
import player from "lottie-web";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";

export function playerFactory() {
  return player;
}

@NgModule({
declarations: [WumpusComponent],
imports: [
  CommonModule,
  WumpusRoutingModule,
  LottieModule.forRoot({player: playerFactory}),
]
})
export class WumpusModule {}
