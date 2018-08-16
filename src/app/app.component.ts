import { Component, NgZone } from '@angular/core';
import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
import { Observable } from 'rxjs/Observable';
import { BatteryLevelService } from './battery-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  static GATT_CHARACTERISTIC_BATTERY_LEVEL = 'battery_level';
  static GATT_PRIMARY_SERVICE = 'battery_service';
  batteryLevel: string = '--';
  device: any = {};

  constructor(
    public ble: BluetoothCore,
    public baterryService : BatteryLevelService,
    public _zone: NgZone,
  ) {}

  ngOnInit() {
    // this.getDeviceStatus();
    // this.streamValues();
  }

  streamValues() {
    this.baterryService.streamValues().subscribe(this.showBatteryLevel.bind(this));
  }

  public  getDeviceStatus() {
    this.baterryService.getDevice().subscribe(
      (device) => {

        if(device) {
          this.device = device;
        }
        else {
          // device not connected or disconnected
          this.device = null;
          this.batteryLevel = '--';
        }
      }
    );
  }

  getFakeValue() {
    this.baterryService.getFakeValue();
  }

  getBatteryLevel() {
    return this.baterryService.getBatteryLevel().subscribe(this.showBatteryLevel.bind(this));
  }

  getHeartRateLevel() {
    return this.baterryService.getHeartRate().subscribe(this.showHearts.bind(this));
  }

  showBatteryLevel(value: number) {

    // force change detection
    this._zone.run( () =>  {
      console.log('Reading battery level', value, '%');
      this.batteryLevel = ''+value;
    });
  }

  showHearts(value: DataView) {

    // force change detection
    this._zone.run( () =>  {
      console.log('Reading battery level ', value, '%');
      // this.batteryLevel = ''+value;
    });
  }

}
