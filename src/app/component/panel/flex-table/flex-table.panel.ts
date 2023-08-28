//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {LabelService} from "../../../service/label.service";
import {ListService} from "../../../model/flex-table";

//=============================================================================

@Component({
  selector    :     'flex-table',
  templateUrl :   './flex-table.panel.html',
  styleUrls   : [ './flex-table.panel.scss' ],
  imports     : [ CommonModule, MatTableModule, MatSortModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCheckboxModule ],
  standalone  : true
})

//=============================================================================

export class FlexTablePanel<T = any> implements AfterViewInit {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() locCode       : string = "";
  @Input() dataProvider? : ListService<T>;

  @Output() onRowsSelected : EventEmitter<T[]> = new EventEmitter<T[]>();

  @ViewChild(MatSort) sort : MatSort |null = null;

  //-------------------------------------------------------------------------

  tableColumns    : string[] = [];
  displayedColumns: string[] = [];
  tableData = new MatTableDataSource<T>();
  selection = new SelectionModel<T>(true, []);

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private labelService : LabelService) {}

  //-------------------------------------------------------------------------
  //---
  //--- Properties
  //---
  //-------------------------------------------------------------------------

  get columns(): string[] {
    return this.tableColumns;
  }

  //-------------------------------------------------------------------------

  @Input()
  set columns(value: string[]) {
    this.tableColumns     = value;
    this.displayedColumns = ["select", ...value]
  }

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  ngAfterViewInit() {
    this.tableData.sort = this.sort;
    this.reload();
  }

  //-------------------------------------------------------------------------

  reload = () : void => {
    if (this.dataProvider != undefined) {
      this.dataProvider().subscribe(
        result => {
          this.tableData.data = result.result;
          this.selection = new SelectionModel<T>(true, []);
        }
      )
    }
  }

  //-------------------------------------------------------------------------

  // loc(code : string) : string {
  //   return this.labelService.getLabel(this.locCode, code);
  // }

  //-------------------------------------------------------------------------

  onRowClick(row : any) : void {
    this.selection.toggle(row)
    this.onRowsSelected.emit(this.selection.selected)
  }

  //-------------------------------------------------------------------------

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tableData.data.length;
    return numSelected === numRows;
  }

  //-------------------------------------------------------------------------

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.onRowsSelected.emit(this.selection.selected)
      return;
    }

    this.selection.select(...this.tableData.data);
    this.onRowsSelected.emit(this.selection.selected)
  }

  //-------------------------------------------------------------------------

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData.filter = filterValue.trim().toLowerCase();
  }
}

//=============================================================================
