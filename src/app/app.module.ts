import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { WebBluetoothModule, BluetoothCore } from '@manekinekko/angular-web-bluetooth';
import { BatteryLevelService } from './battery-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WebBluetoothModule.forRoot()
  ],
  providers: [BatteryLevelService, BluetoothCore],
  bootstrap: [AppComponent]
})
export class AppModule { }
