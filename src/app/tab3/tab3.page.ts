import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { ToastsService } from '../services/toast/toasts.service';
import { UsersService } from '../services/users/users.service';
import { LoadService } from '../services/loading/load.service';
import { GeolocationOptions, Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
const { Geolocation } = Plugins;

declare var google;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  locationsCollection: AngularFirestoreCollection<any>;
  locations: Observable<any>;
  isTracking = false;
  address: string;
  markers = [];
  watch: any;
  map: any;

  latitude: number;
  longitude: number;
  myClassification: any = null;
  userUID;

  constructor(
    private firestore: AngularFirestore,
    private toastServ: ToastsService,
    public loadingServ: LoadService,
    private userServ: UsersService,
    private platform: Platform,
    private storage: Storage
  ){
    // Platform Ready - Função que aguarda o sistema estar pronto para iniciar o Map
    this.platform.ready().then(()=>{
      this.getClassification();
      // Chama a função para iniciar o Mapa      
      this.loadMap();
      // Busca o uid do usuário no localstorage
      this.storage.get('userUID').then((uid)=>{
        this.userUID = uid;
      });
    });
  }

  ionViewWillEnter() {
  }

  ngOnInit() {    
  }

  ionViewWillLeave(){
    this.stopOnline();
    this.myClassification = null;
  }

  // Busca a classificação e atualiza a variável global
  async getClassification(){
    await this.storage.get('myClassification').then((resClassif)=>{
      if(resClassif!=null){
        this.myClassification = resClassif;
      }
    });
  }

  // Coloca o usuário online no Map
  startOnline(uid) {
    this.locationsCollection = this.firestore.collection(
      `Locations`,
      ref => ref.orderBy('timestamp')
    );

    // Observa a lista de Locations e atualiza com as mudanças
    this.locations = this.locationsCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );

    // Atualiza o Map com as markers a todo o tempo
    this.locations.subscribe(locations => {
      this.updateMap(locations);
    });
  }

  // Limpa as markers do Map
  stopOnline(){
    this.markers.map(marker => marker.setMap(null));
    this.markers = [];
  }

  // Track user geolocation
  startTracking() {
    if(this.myClassification!=null){
      this.startOnline(this.userUID);
      this.isTracking = true;
      this.watch = Geolocation.watchPosition({}, (position, err) => {
        console.log('startTracking: ', position.coords['latitude'], position.coords['longitude']);
        if (position.coords!==null) {
          this.addNewLocation(position);
        }
      });
    }else{
      this.toastServ.toastMsg('Você ainda não possui uma classificação. Entre no menu e preencha o formulário de autoavaliação!')
      .then(()=>{
        this.firestore.collection(`Locations`).doc(`${this.userUID}`).set({});
        this.myClassification=null;
      });
    }
  }

  // Unsubscribe from the geolocation watch using the initial ID
  stopTracking() {
    if(this.myClassification!=null){
      Geolocation.clearWatch({ id: this.watch }).then(() => {
        this.deleteLocation();
        this.isTracking = false;
      });
      this.stopOnline();
    }else{
      this.toastServ.toastMsg('Você ainda não possui uma classificação. Entre no menu e preencha o formulário de autoavaliação!');
    }
  }
  
  // Salva a nova localização no Firebase e centraliza o Map
  addNewLocation(position) {
    console.log('ClassCor: ', this.myClassification['classificaCor']);
    this.firestore.collection(`Locations`)
    .doc(`${this.userUID}`)
    .set({
      risco: this.myClassification['myClassification'],
      style: this.myClassification['classificaCor'],
      lat: position.coords['latitude'],
      lng: position.coords['longitude'],
      timestamp: position['timestamp'],
    });  
    let myPosition = new google.maps.LatLng(position.coords['latitude'], position.coords['longitude']);
    this.map.setCenter(myPosition);
    this.map.setZoom(16);
  }
  
  // Atualiza as markers no Map
  updateMap(locations) {
    // Remove todas as markers do Map
    this.markers.map(marker => marker.setMap(null));
    this.markers = [];  
    for (let loc of locations) {
      let latLng = new google.maps.LatLng(loc.lat, loc.lng);  
      // Adiciona um Pin do tipo marker do Maps
      let marker = new google.maps.Marker({
        icon: {
          url: './assets/imagem/'+loc.style+'.svg', //'./assets/imagem/pinvirus.svg',
          scaledSize: new google.maps.Size(48, 48)
        },
        position: latLng,
        map: this.map,
        title: loc.risco,
        draggable: false
      });
      this.addInfoWindow(marker, loc.risco);
      this.markers.push(marker);
    }
  }

  // Adiciona Info no Pin marker
  addInfoWindow(marker, content) {
    const infoWindow = new google.maps.InfoWindow({
      content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  // Função responsável por iniciar o Mapa
  loadMap() {
    this.loadingServ.presentLoad('Carregando...');

    let options: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 60000
    };
    
    // Ao iniciar executa a função que pega a posição do usuário
    Geolocation.getCurrentPosition(options).then((resp) => {

      // Extrai as coordenadas da resposta da geolocalização (Api Google Maps)
      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      // Faz um cast nas coordenadas e transforma em tipo 'latLng' do Maps
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        cameraPosition: {
          zoom: 16,
          tilt: 30
        }
      }
      
      // Cria um mapa e adiciona as opções de Zoom,centralização e tipo de mapa
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      // Adiciona um Listener para saber o momento em que o mapa está renderizado
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        // Hide loading spinner
        this.loadingServ.dismissLoad();
        // Inicializs as funcionalidades principais ou apenas retorne o mapa
        return;
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  // Deleta a localização do Firebase
  deleteLocation() {
    this.locationsCollection.doc(this.userUID).delete();
  }

}
