import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public form: FormGroup = new FormGroup<any>({
    column: new FormControl(""),
    row: new FormControl(""),
    pit: new FormControl(""),
    arrow: new FormControl("")
  });

  constructor(private readonly _router: Router) { }

  ngOnInit(): void {
  }

  start() {
   if(this.form.value.column && this.form.value.row && this.form.value.pit && this.form.value.arrow) {
     this._router.navigate(['/', 'wumpus', 'game',
       this.form.value.column,
       this.form.value.row,
       this.form.value.pit,
       this.form.value.arrow
     ]);
   } else {
     Swal.fire(
       'Advertencia',
       'Aun hay campos vacios',
       'warning'
     )
   }
  }
}
