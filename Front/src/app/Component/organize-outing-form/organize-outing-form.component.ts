import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OutlingService } from '../../Service/Fonction-service/outling-service/outling.service';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-organize-outing-form',
  templateUrl: './organize-outing-form.component.html',
  imports: [
    FormsModule
  ],
  standalone: true
})
export class OrganizeOutingFormComponent {
  outing = {
    title: '',
    date: '',
    visibility: 'PUBLIC',
    eventExternalId: 0
  };

  constructor(
    public dialogRef: MatDialogRef<OrganizeOutingFormComponent>,
    private outlingService: OutlingService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.outing.eventExternalId = data.eventId;
  }

  onSubmit() {
    if (this.outing.title && this.outing.date && this.outing.eventExternalId) {
      this.outlingService.createOutling(this.outing).subscribe(
        data => {
          this.dialogRef.close('submitted');
        }
      );
      this.dialogRef.close();
    }
  }

  close() {
    this.dialogRef.close();
  }
}
