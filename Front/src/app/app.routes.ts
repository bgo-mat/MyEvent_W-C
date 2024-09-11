import { Routes } from '@angular/router';
import { MainPageComponent } from "./Page/main-page/main-page.component";
import { NavBarComponent } from "./Component/nav-bar/nav-bar.component";
import {HomePageComponent} from "./Page/home-page/home-page.component";
import {DetailEventComponent} from "./Page/detail-event/detail-event.component";
import {FormLogComponent} from "./Page/form-log/form-log.component";
import {GoogleCallbackComponent} from "./auth/google-callback/google-callback.component";
import {DiscordCallbackComponent} from "./auth/discord-callback/discord-callback-component";
import {OutingDetailComponent} from "./Component/outing-detail/outing-detail.component";
import {UserProfilPageComponent} from "./Page/user-profil-page/user-profil-page.component";

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'event-detail/:id',
        component: DetailEventComponent,
      },
      {
        path: 'login',
        component: FormLogComponent
      },
      {
        path: 'google-callback',
        component: GoogleCallbackComponent
      },
      {
        path: 'discord-callback',
        component: DiscordCallbackComponent
      },
      {
        path: 'outing/:id/:uid',
        component: OutingDetailComponent
      },
      {
        path: 'profil',
        component: UserProfilPageComponent
      },
    ]
  }
];
