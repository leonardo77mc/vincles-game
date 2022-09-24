import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import player from 'lottie-web';
import { AppComponent } from './app.component';
import { AppRoutingModule } from "./app.routing.module";
import { RouterOutlet } from "@angular/router";
import { WumpusModule } from "./component/wumpus/wumpus.module";
import { HomeComponent } from './component/home/home.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    WumpusModule,
    RouterOutlet
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
