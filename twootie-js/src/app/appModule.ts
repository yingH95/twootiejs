import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent}  from './component/appComponent';
import {TreeComponent} from './component/treeComponent';
import {JustificationInputComponent} from './component/justificationInputComponent';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports:      [
      BrowserModule,
      FormsModule
  ],
  declarations: [
      AppComponent,
      TreeComponent,
      JustificationInputComponent
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
