import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ParametersService } from './parameters.service';

@Component({
  selector: 'app-parameters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parameters.component.html',
  styleUrl: './parameters.component.scss'
})
export class ParametersComponent {
  expanded: boolean = false;
  boardSize: number = 10;
  mineCount: number = 10;

  math: Math = Math;

  constructor(public parametersService: ParametersService) { }

  loadBoard() {
    this.parametersService.loadBoard$.next(true);
  }

  onBoxSizeChange(event: number) {
    if (this.mineCount > Math.floor(event * event / 3)) {
      this.mineCount = Math.floor(event * event / 3);
      this.parametersService.mineCount = Math.floor(event * event / 3);

    }
    this.parametersService.boardSize = event;
  }
}
