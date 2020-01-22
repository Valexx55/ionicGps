import { Component } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private ubicacion: string;
  private subscription:Subscription;

  constructor(private platform:Platform, private geolocation: Geolocation, private locationAccuracy: LocationAccuracy, private diagnostic: Diagnostic) {
    //si la localización está activada
    //si es de tipo GPS
    //mostramos

    this.diagnostic.isGpsLocationEnabled().then(
      (gpsactivo) => {
        if (gpsactivo) {
          this.ubicacion = "GPS HABILITADO";
          this.mostrarUbicacionActual();
          console.log("GPS HABILITADO, programammos el seguimiento ");
          this.programarSeguimientoUbicacion();
        }
        else {//GPS DESACTIVADO
          this.ubicacion = "GPS DESACTIVADO";
          console.log("GPS inHABILITADO, solicitando ");
          this.locationAccuracy.canRequest().then(
            (canRequest) => {
              if (canRequest) {
                this.ubicacion = "GPS PODEMOS PEDIR";
                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                  (ok) => { this.ubicacion= ok.code + " "+ ok.message; this.mostrarUbicacionActual(); this.programarSeguimientoUbicacion(); },
                  error => this.ubicacion = "Permiso denegado"
                );
              } else {
                this.ubicacion = "NO podemos pedir UBC";
              }
            });
        }
      }, (error) => {
        this.ubicacion = "NO podemos pedir UBC";
      }) 
  }

  private mostrarUbicacionActual(): void {
    this.geolocation.getCurrentPosition().then((resp) => {

      console.log("Latitud actual " + resp.coords.latitude);
      console.log("Longuitd actual " + resp.coords.longitude);
      this.ubicacion = "Pos Actual latitud " + resp.coords.latitude + " longuitud " + resp.coords.longitude;

    }).catch((error) => {
      console.log('Error obteniendo la localización', error);
      this.ubicacion = "Error al obtener la ubicación"
    });

  }

  private programarSeguimientoUbicacion(): void {
    let watch = this.geolocation.watchPosition();
    watch.subscribe((resp) => {
      console.log("Latitud actual " + resp.coords.latitude);
      console.log("Longuitd actual " + resp.coords.longitude);
      this.ubicacion = "Pos seguimiento: latitud " + resp.coords.latitude + " longuitud " + resp.coords.longitude;
    });
  }

  ionViewDidEnter(){
    this.subscription = this.platform.backButton.subscribe(()=>{
        navigator['app'].exitApp();
    });
}

  ionViewWillLeave(){
      this.subscription.unsubscribe();
  }
}
