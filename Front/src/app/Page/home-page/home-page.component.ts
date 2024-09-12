import { Component, OnInit } from '@angular/core';
import { CardEventComponent } from "../../Component/card-event/card-event.component";
import { FilterMenuComponent } from "../../Component/filter-menu/filter-menu.component";
import { OpenAgendaService } from "../../Service/Fonction-service/open-agenda-service/open-agenda.service";
import {AuthService} from "../../Service/Fonction-service/auth-service/auth.service";
import {UserDataService} from "../../Service/Data-service/user-data.service";
import {CardEventSkeletonComponent} from "../../Component/Skeleton/card-event-skeleton/card-event-skeleton.component";
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CardEventComponent,
    FilterMenuComponent,
    CardEventSkeletonComponent,
    NgForOf,
    NgClass
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  public results: any[] = [];
  public keywordArray:any;
  public cityArray:any;
  public errorMsg:any;
  public showError = false;
  private userLocation: any;
  public offset: number = 0;
  currentPage: number = 1;
  pages: number[] = [];
  public loading = true;
  public skeletonIterations : any = Array(20);

  constructor(private openAgendaService: OpenAgendaService, private authService: AuthService, private dataService : UserDataService ) {}

  ngOnInit() {
    // Charger les événements par défaut
    this.updatePages();
    this.getCurrentLocation();
  }

  // Méthode pour récupérer les événements
  getEvent(location?: string, title?: string, startDate?: string, endDate?: string, keywords?: any) {
    this.loading = true;
    this.results = [];
    this.openAgendaService.getApi(location, title, keywords, startDate, endDate, this.userLocation, this.offset).subscribe(
      data => {
        this.loading = false;
        if(data.body.results.length<1){
          this.errorMsg = "Oups ! Aucun événement n'est en lien avec votre recherche."
          this.showError = true;
        }else{
          this.errorMsg ="";
          this.showError = false;
          this.results = data.body.results;
        }
      }
    );
  }

  //KEYWORD REQUEST + FILTRE SUR KEYWORD POUR RÉCUPÉRER SELON L'INPUT ET SANS DOUBLONS
  searchByKeyword(event: { keyword: string }) {

    const inputSplit = event.keyword.split(',');
    const query = inputSplit[inputSplit.length-1].trim()

    this.openAgendaService.getKeywordList(event.keyword).subscribe(
      data => {
        console.log(data)
        const keyword = query.toLowerCase();
        const filteredKeywords = new Set();

        // Parcourir les résultats pour filtrer les mots-clés qui commencent par l'entrée utilisateur
        data.body.results.forEach((record: { keywords_fr: any[]; }) => {
          if (record.keywords_fr) {
            record.keywords_fr.forEach(kw => {
              // Filtrer les mots-clés qui commencent par l'entrée utilisateur
              if (kw.toLowerCase().startsWith(keyword)) {
                filteredKeywords.add(kw);
              }
            });
          }
        });


       this.keywordArray = Array.from(filteredKeywords);
      },
      error => {
        console.log(error);
      }
    );
  }

  //CITY REQUEST + FILTRE SUR CITY POUR RÉCUPÉRER SELON L'INPUT ET SANS DOUBLONS
  searchByCity(event: { location: string }) {

    const inputSplit = event.location.split(',');
    const query = inputSplit[inputSplit.length - 1].trim();

    this.openAgendaService.getCityList(event.location).subscribe(
      data => {

        const location = query.toLowerCase();
        const filteredLocation = new Set<string>();

        data.body.results.forEach((record: { location_city: string }) => {
          if (record.location_city && record.location_city.toLowerCase().startsWith(location)) {
            filteredLocation.add(record.location_city);
          }
        });

        this.cityArray = Array.from(filteredLocation);
      },
      error => {
        console.log(error);
      }
    );
  }



  // Gestion du changement de filtre
  onFilterChange(event: { location: string, title: string, startDate: string, endDate: string, keyword: string }) {
    // Appeler getEvent avec les catégories et les dates
    this.getEvent(event.location, event.title, event.startDate, event.endDate, event.keyword);
  }


  //GESTION DE LA LOCALISATION ACTUELLE
  getCurrentLocation() {
    this.dataService.getUserLocation()
      .then(position => {
        this.userLocation = position;
        this.getEvent();
      })
      .catch(error => {
        console.error(error.message);
        if(error.message === "User denied Geolocation" || error.message === "User denied geolocation prompt"){
          this.userLocation = null;
          this.getEvent();
        }
      });
  }


  //GESTION PAGINATION
  nextPage() {
    if (this.currentPage < this.pages[this.pages.length - 1]) {
      this.currentPage++;
      this.updateOffset();
      this.updatePages();
      this.getEvent();
      // @ts-ignore
      document.getElementById("a").scrollIntoView();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateOffset();
      this.updatePages();
      this.getEvent();
      // @ts-ignore
      document.getElementById("a").scrollIntoView();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateOffset();
    this.updatePages();
    this.getEvent();
    // @ts-ignore
    document.getElementById("a").scrollIntoView();
  }

  updateOffset() {
    this.offset = (this.currentPage - 1) * 30;
  }

  updatePages() {
    const totalPages = 100;
    this.pages = [];

    const maxVisiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
  }

}
