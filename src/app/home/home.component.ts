import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private _questionId: string = '1';

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  start(): void {
    this._router.navigate([this._questionId]);
  }
}
