import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ParametersService } from '../parameters/parameters.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {
  boardSize: number = 10;
  mineCount: number = 10;

  matrix: Array<Tbox> = [];
  mouseOn: [number, number] = [0, 0];

  gameLost: boolean = false;
  gameWon: boolean = false;

  constructor(private parametersService: ParametersService) {
    this.parametersService.loadBoard$.subscribe(res => {
      this.boardSize = this.parametersService.boardSize;
      this.mineCount = this.parametersService.mineCount;

      this.setUpBoard();
    })
  }

  setUpBoard() {
    this.matrix = [];
    let id = 0;
    for (let y = 0; y < this.boardSize; y++) {
      for (let x = 0; x < this.boardSize; x++) {
        this.matrix.push({
          id,
          x,
          y,
          isMined: false,
          nOfAdjacentMines: 0,
          flagged: false,
          covered: true,
          hoverRange: 0,
          animationDelay: Math.floor(Math.random() * 10),
        });

        id++;
      }
    }

    this.generateMines();
  }

  generateMines() {
    let minesPut = 0;

    while (minesPut < this.mineCount) {
      const x = Math.floor(Math.random() * this.matrix.length);
      const box = this.matrix[x];

      if (!box.isMined) {
        box.isMined = true;
        const adjs = this.getAdjacentBoxes(this.matrix[x]);
        minesPut++;
        for (const box of adjs) {
          box.nOfAdjacentMines = box.nOfAdjacentMines + 1;
        }
      }
    }
  }

  getAdjacentBoxes(box: Tbox) {
    return this.matrix.filter((b: Tbox) =>
      (b.id === box.id - 1 && b.y === box.y) ||
      (b.id === box.id + 1 && b.y === box.y) ||
      (b.id === box.id - this.boardSize - 1 && b.y === box.y - 1) ||
      (b.id === box.id - this.boardSize + 1 && b.y === box.y - 1) ||
      (b.id === box.id - this.boardSize && b.y === box.y - 1) ||
      (b.id === box.id + this.boardSize - 1 && b.y === box.y + 1) ||
      (b.id === box.id + this.boardSize && b.y === box.y + 1) ||
      (b.id === box.id + this.boardSize + 1 && b.y === box.y + 1));
  }

  onRightClick(event: MouseEvent, index: number) {
    event.preventDefault();
    const box = this.matrix[index];

    if (box.covered) {
      if (box.flagged) {
        box.flagged = false;
      } else {
        box.flagged = true;

        this.checkIfGameIsWon();
      }
    } else if (box.nOfAdjacentMines) {
      const adjs = this.getAdjacentBoxes(box);
      const flaggedAdjs = adjs.filter((box: Tbox) => box.flagged);

      if (flaggedAdjs.length === box.nOfAdjacentMines) {
        for (const box of adjs) {
          if (!box.flagged) {
            this.unbox(box.id);
          }
        }
      }
    }
  }

  unbox(index: number) {
    const box = this.matrix[index];
    if (!box || !box?.covered) {
      return
    }

    if (box.isMined) {
      this.gameLost = true;
      this.uncoverBoard();
    } else if (!box.nOfAdjacentMines) {
      this.matrix[index].covered = false;
      const adjs = this.getAdjacentBoxes(this.matrix[index]);
      for (const box of adjs) {
        setTimeout(() => {
          this.unbox(box.id);
        }, 10);
      }
    } else {
      box.covered = false;
    }
  }

  checkIfGameIsWon() {
    const flaggedBoxes = this.matrix.filter((box: Tbox) => box.flagged && box.isMined);
    if (flaggedBoxes.length === this.mineCount) {
      this.gameWon = true;
      this.uncoverBoard();
    }
  }

  uncoverBoard() {
    for (const box of this.matrix) {
      box.covered = false;
    }
  }

  resetGame() {
    this.gameLost = false;
    this.gameWon = false;
    this.setUpBoard();
  }
}


export interface Tbox {
  id: number;
  x: number;
  y: number;
  isMined: boolean;
  nOfAdjacentMines: number;
  flagged: boolean;
  covered: boolean;
  hoverRange: number;
  animationDelay: number;
}