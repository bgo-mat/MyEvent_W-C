import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import  { NavBarComponent } from "../../Component/nav-bar/nav-bar.component";
import {CardEventComponent} from "../../Component/card-event/card-event.component";
import {FilterMenuComponent} from "../../Component/filter-menu/filter-menu.component";

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    NavBarComponent,
    RouterOutlet,
    CardEventComponent,
    FilterMenuComponent
  ],
  template: `
    <div class="flex flex-col  min-h-screen">
      <app-nav-bar class="md:fixed z-40"></app-nav-bar>
      <div class="w-[100%] h-full md:pt-[64px]">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
