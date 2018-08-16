import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
import { TextDecoder, TextEncoder } from 'text-encoding'


@Injectable()
export class BatteryLevelService {

  // See https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.js
  static GATT_CHARACTERISTIC_BATTERY_LEVEL = 'battery_level';
  static GATT_PRIMARY_SERVICE = 'battery_service';

  constructor(
    public ble: BluetoothCore
  ) {}

  getFakeValue() {
    this.ble.fakeNext();
  }

  getDevice() {

    // call this method to get the connected device
    return this.ble.getDevice$();
  }

  streamValues() {

    // call this method to get a stream of values emitted by the device
    return this.ble.streamValues$()
      .map(value => value.getUint8(0));
  }

 
   getBatteryLevel(): any{
    console.log('Getting Battery Service...');

    try {
        return this.ble

          // 1) call the discover method will trigger the discovery process (by the browser)
          .discover$({ acceptAllDevices: true, optionalServices: ['battery_service'] })

          // 2) get that service
          .mergeMap((gatt : BluetoothRemoteGATTServer) => {
              return this.ble.getPrimaryService$(gatt, 'battery_service')
          })
          
          // 3) get a specific characteristic on that service
          .mergeMap(primaryService => this.ble.getCharacteristic$(primaryService, 'battery_level'))
          
          // 4) ask for the value of that characteristic (will return a DataView)
          .flatMap((characteristic:BluetoothRemoteGATTCharacteristic) => {
              console.log('char', characteristic);
            return this.ble.readValue$(characteristic)
          })
          .map((value: DataView) => value.getUint8(0));
     
          // 5) on that DataView, get the right  value
          // .map(value => value.getUint8(0));
    }
    catch(e) {
      console.error('Oops! can not read value from %s');
    }

  }


// Didnt use this function
  getHeartRate() : any {

    console.log('Getting Heart Rate Service...');

    try {
        return this.ble

          // 1) call the discover method will trigger the discovery process (by the browser)
          .discover$({ acceptAllDevices: true, optionalServices: ['00010001-574f-4f20-5370-6865726f2121'] } as RequestDeviceOptions)

          // 2) get that service
          .mergeMap((gatt : BluetoothRemoteGATTServer) => {
              return this.ble.getPrimaryService$(gatt, '00010001-574f-4f20-5370-6865726f2121')
          })
          
          // 3) get a specific characteristic on that service
          .mergeMap(primaryService => this.ble.getCharacteristic$(primaryService, '00010003-574f-4f20-5370-6865726f2121'))
          
          // 4) ask for the value of that characteristic (will return a DataView)
          .flatMap((characteristic:BluetoothRemoteGATTCharacteristic) => {
              console.log('char2', characteristic);

            return this.ble.readValue$(characteristic)
          })
          .map((value: DataView) => {
            console.log('value', value);
            
            let testing = String.fromCharCode.apply(null, new Uint16Array(value.buffer));
           
            console.log('value', testing);
   
          });

    }
    catch(e) {
      console.error('Oops! can not read value from %s');
    }


  }

  handleCharacteristicValueChanged(event) {
    
    var value = event.target.value.getUint8(0);
    console.log('Received ' + value);
    
  }

}