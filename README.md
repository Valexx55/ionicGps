Esta aplicación demuestra el uso del GPS del móvil usando librerías nativas (Cordova). Lo más cómodo es:

Clonarlo (nos metemos en el directorio raíz con cd) 
npm install para instalar dependeNcias  y  lo ejecutéis con ionic cordova run android --device (el móvil lo tenéis que tener preparado para poder instalarle apps de prueba)

Aún así, detallo los pasos por si lo queréis ir haciendo por vuestra cuenta.


PASOS

1) ionic start ionicGps blank 

Creamos el proyecto en blanco y elegimos Angular como framework

2) ionic cordova plugin add cordova-plugin-geolocation
   npm install @ionic-native/geolocation

Instalamos la extensión geolocation para obtener la dirección del gps del movil
https://ionicframework.com/docs/native/geolocation

3) ionic cordova plugin add cordova-plugin-request-location-accuracy
   npm install @ionic-native/location-accuracy

Instalamos la extesión location-accuracy para poder solicitar la activación del GPS https://ionicframework.com/docs/native/location-accuracy

4) ionic cordova plugin add cordova.plugins.diagnostic
   npm install @ionic-native/diagnostic

Instalamos la extensión diagnostic para determinar si el teléfono tiene activada la ubicación https://ionicframework.com/docs/native/diagnostic

5) Definimos la sección de providers en home.module.ts

providers:[Geolocation, LocationAccuracy, Diagnostic]

importando estas clases de modo explícito si no nos lo sugiere el entorno

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

6) En home.page.ts hacemos los mismos imports, inyectamos en el constrcutor y copiamos el código.

7) OJO al atributo ubicación, ponedlo en la plantilla home.page.html mediante interpolación {{ubicación}}, para mostrar al usuario la ubicación o el estado de obtención de la misma.

------------------------------------------------

EXTRA: botón de ir hacia atrás.
En esta versión 4 de Ionic el botón de ir hacia atrás no funciona automáticamnete
en Android. Para conseguir el comportamiento deseable hay que hacer lo siguiente.

1) Definir estos dos imports en el home.page.ts

import { Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

2) Inyectar Platform en el constructor y definir el atributo susbscription

constructor(private platform:Platform, ...
private subscription:Subscription;

3) Y aprovechar el evento de cuando se termina de cargar la página (ionViewDidEnter), para programar el listener (this.platform.backButton.subscribe) cuando se toca el botón de atrás

//CUANDO SE TOQUE EL BOTÓN, SE EJECUTAR EL EXIT DE LA APP
ionViewDidEnter(){
    this.subscription = this.platform.backButton.subscribe(()=>{
        navigator['app'].exitApp();
    });
}

//IMPORTANTE QUE CUANDO SALGAMOS DE LA PÁGINA, DESACTIVEMOS EL LISTENER
  ionViewWillLeave(){
      this.subscription.unsubscribe();
  }

  Si estuviera en otra página (en una apps de varias páginas, como la de comentariosApp) y quiero que el botón de ir hacia atrás me funcione para navegar entre páginas el ionViewDidEnter variaría (el ionViewWillLeave no) así para ir a la página anterior y no salir de la app. Recuerda hacemos uso del NavigationControlloer (objeto nc en el código)

//PROGRAMAMOS EL LISTENER PARA IR A LA PÁGINA ANTERIOR
  ionViewDidEnter(){
    this.subscription = this.platform.backButton.subscribe(()=>{
        this.nc.back();
    });
}

------------------------------------------------
POSIBLES MEJORAS

Partiendo del ejemplo, se pueden sugerir ejercicios sencillos como:

a) Definir un botón que al pulsarlo te informe si la ubicación por gps está activa o no.

b) Definir un botón para pedir la activación gps.

c) Definir un botón para obtener la ubicación de nuevo.

------------------------------------------------

MÁS PLUGINS NATIVOS

En la misma sección de los plugins de ionic https://ionicframework.com/docs/native/diagnostic podeís encontrar en la columna izquierda mogollón de extensiones nativas (GoogleMaps, Instagram, Calendar) para extender la funcionalidad de vuestra app fácilmente como en este ejemplo. Algunas de estas extensiones son gratuitas y otras de pago (enterprise)


