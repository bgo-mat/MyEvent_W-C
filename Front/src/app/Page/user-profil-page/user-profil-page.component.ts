import { FormsModule } from "@angular/forms";
import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../Service/Fonction-service/auth-service/auth.service";
import { Router } from "@angular/router";
import { OutlingService } from "../../Service/Fonction-service/outling-service/outling.service";
import { CardOutlingProfilComponent } from "../../Component/card-outling-profil/card-outling-profil.component";
import {NgIf} from "@angular/common";
import {routes} from "../../app.routes";

@Component({
  selector: 'app-user-profil-page',
  standalone: true,
  imports: [
    FormsModule,
    CardOutlingProfilComponent,
    NgIf
  ],
  templateUrl: './user-profil-page.component.html',
  styleUrls: ['./user-profil-page.component.css']
})
export class UserProfilPageComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private outlingService: OutlingService,
  ) {}

  bio: string = '';
  public actualUser: any;
  public userOutlings: any;
  isEditingBio: boolean = false;

  ngOnInit() {
    this.initUser();
    this.initOutling();
  }

  toggleEditBio() {
    this.isEditingBio = !this.isEditingBio;
  }

  updateBio() {
    const data = { bio: this.bio };

    this.authService.updateBio(data).subscribe(
      data => {
        this.ngOnInit()
      },
      error => {
        if(error.error.text === "Bio mise à jour avec succès !"){
          this.actualUser.bio = this.bio;
          this.isEditingBio = false;
        }else{
          console.log(error);
        }
      }
    );
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // UPLOAD AVATAR
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Image = base64String.split(',')[1];

        this.authService.uploadAvatarBase64(base64Image).subscribe(
          (response) => {
            window.location.reload();
            alert('Avatar mis à jour avec succès !');
          },
          (err) => {
            console.error('Erreur lors de l\'upload de l\'avatar :', err);
          }
        );
      };
      reader.readAsDataURL(file);
    }
  }



  initUser() {
    this.authService.getCurrentUser().subscribe(
      data => {
        this.actualUser = data;
        this.bio = this.actualUser.bio;
      },
      error => {
        this.router.navigate(['/']);
      }
    );
  }

  initOutling() {
    this.outlingService.getOutlingByUserId().subscribe(
      data => {
        this.userOutlings = data.body;
      },
      error => {
        console.log(error);
      }
    );
  }

  redirectBack(){
    this.router.navigate(['/'])
  }
}
