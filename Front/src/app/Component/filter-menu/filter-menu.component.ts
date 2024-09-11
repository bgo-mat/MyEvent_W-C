import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-menu',
  standalone: true,
  imports: [NgClass, NgIf, FormsModule, NgForOf],
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.css']
})
export class FilterMenuComponent {

  isMenuOpen = false;
  public location: string = '';
  public title: string = '';
  public startDate: string = '';
  public endDate: string = '';
  public keyword: string = '';

  //OUTPUT SEARCH FINAL
  @Output() filterChange = new EventEmitter<{ location: string, title: string, startDate: string, endDate: string, keyword: string }>();

  //OUTPUT KEYWORD LIST
  @Output() keywordEmit = new EventEmitter<{ keyword: string }>();

  //OUTPUT CITY LIST
  @Output() cityEmit = new EventEmitter<{ location: string }>();

  //DISPLAY LIST
  @Input() displayKeywordArray!: any;
  @Input() displayCityArray!: any;
  @Input() errorMsg!: any;
  @Input() showError!:any;

  submitFilterMenu() {
    this.filterChange.emit({
      location: this.location,
      title: this.title,
      startDate: this.startDate,
      endDate: this.endDate,
      keyword : this.keyword
    });
  }

  submitSearchKeyword(event:any) {
    this.keywordEmit.emit({
      keyword : event
    });
  }

  submitSearchCity(event:any) {

    const inputSplit = event.split(',');
    let cityInput =inputSplit[inputSplit.length - 1].trim();

    if (event.length > 0) {
       cityInput = cityInput.charAt(0).toUpperCase() + cityInput.slice(1);
    }

    this.cityEmit.emit({
      location : cityInput
    });
  }




  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  //S'ÉXÉCUTE QUAND UN KEYWORD EST SÉLÉCTIONNÉ. AJOUTE À L'INPUT LE KEYWORD SÉLÉCTIONNÉ
  selectKeyword(selectedKeyword: string) {

    const keywordsArray = this.keyword.split(',').map(kw => kw.trim());
    keywordsArray[keywordsArray.length - 1] = selectedKeyword;
    this.keyword = keywordsArray.join(', ') + ', ';

    this.displayKeywordArray = [];
  }

  selectCity(selectedCity: string) {

    const cityArray = this.location.split(',').map(kw => kw.trim());
    cityArray[cityArray.length - 1] = selectedCity;
    this.location = cityArray.join(', ') + ', ';

    this.displayCityArray = [];
  }






}
