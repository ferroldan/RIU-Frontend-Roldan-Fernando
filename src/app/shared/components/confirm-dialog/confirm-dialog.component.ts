import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'SHARED.CONFIRM_DIALOG.TITLE' | translate }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">{{ 'SHARED.CONFIRM_DIALOG.CANCEL' | translate }}</button>
      <button mat-raised-button color="warn" (click)="onConfirm()">{{ 'SHARED.CONFIRM_DIALOG.CONFIRM' | translate }}</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data = inject<{ message: string }>(MAT_DIALOG_DATA);

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
