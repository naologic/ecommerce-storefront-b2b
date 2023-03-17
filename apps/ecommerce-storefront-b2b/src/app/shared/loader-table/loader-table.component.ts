import { Component, Input, OnInit } from '@angular/core';
import { range } from 'lodash';

@Component({
  selector: 'nao-loader-table',
  templateUrl: './loader-table.component.html',
})
export class LoaderTableComponent implements OnInit {
  @Input() public numberOfRows = 6;
  public rowsRange: number[] = [];


  public ngOnInit() {
    this.rowsRange = range(this.numberOfRows);
  }
}
