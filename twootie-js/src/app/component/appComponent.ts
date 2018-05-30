import { Component } from '@angular/core';
import {AppControl} from '../control/appControl';

@Component({
  selector: 'twootie',
  templateUrl: './../html/appComponent.ng.html',
  styleUrls: ['./../css/appComponent.css']
})

export class AppComponent {
  public control: AppControl = new AppControl();
}
