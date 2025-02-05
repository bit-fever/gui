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
import {FlexTableColumn, ListService} from "../../../model/flex-table";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";

//=============================================================================

type FlexTableFilter<T> = (row: T, filter: string) => boolean;

//=============================================================================

@Component({
  selector    :     'flex-table',
  templateUrl :   './flex-table.panel.html',
  styleUrls   : [ './flex-table.panel.scss' ],
  imports: [CommonModule, MatTableModule, MatSortModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatButtonModule, MatTooltip],
  standalone  : true
})

//=============================================================================

export class FlexTablePanel<T = any> implements AfterViewInit {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() dataProvider? : ListService<T>;
  @Input() searchPanel    = true

  @Input() filter: FlexTableFilter<T> = (row : T, filter : string) => {
    if (filter.length == 0) {
      return true
    }

    for (let fc of this.tableColumns) {
      // @ts-ignore
      let value = row[fc.column]
      if (fc.transcoder != undefined) {
        value = fc.transcoder.transcode(value, row)
      }

      if (value != null) {
        value = value.trim().toLowerCase()

        if (value.indexOf(filter) != -1) {
          return true
        }
      }
    }

    return false
  }

  @Output() onRowsSelected : EventEmitter<T[]> = new EventEmitter<T[]>();

  @ViewChild(MatSort) sort : MatSort |null = null;

  //-------------------------------------------------------------------------

  rawData         : T[] = [];
  rowCount        : number = 0
  tableColumns    : FlexTableColumn[] = [];
  displayedColumns: string[] = [];
  tableData = new MatTableDataSource<T>();
  selection = new SelectionModel<T>(true, []);

  oldFilter: (data: T, filter: string) => boolean;
  textToFilter : string = ""

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private labelService : LabelService) {
    this.oldFilter = this.tableData.filterPredicate
    this.tableData.filterPredicate = this.filterPredicate
  }

  //-------------------------------------------------------------------------
  //---
  //--- Properties
  //---
  //-------------------------------------------------------------------------

  get columns(): FlexTableColumn[] {
    return this.tableColumns;
  }

  //-------------------------------------------------------------------------

  @Input()
  set columns(value: FlexTableColumn[]) {
    this.tableColumns     = value;
    this.displayedColumns = ["select", ...value.map( c => c.column )]
  }

  //-------------------------------------------------------------------------

  get data(): T[] {
    return this.rawData;
  }

  //-------------------------------------------------------------------------

  @Input()
  set data(value: T[]) {
    this.rawData        = value
    this.tableData.data = value
    this.rowCount       = value.length
    this.applyFilter()
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
          this.rowCount       = result.result.length
          this.clearSelection();
          this.applyFilter()
        }
      )
    }
    else if (this.data != undefined) {
      this.tableData.data = this.data;
      this.rowCount       = this.data.length
      this.clearSelection();
      this.applyFilter()
    }
  }

  //-------------------------------------------------------------------------

  loc(code : string) : string {
    return this.labelService.getLabelString("flexTable."+ code);
  }

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

    this.selection.select(...this.tableData.filteredData);
    this.onRowsSelected.emit(this.selection.selected)
  }

  //-------------------------------------------------------------------------

  updateFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.textToFilter = filterValue.trim().toLowerCase()
    this.applyFilter()
  }

  //-------------------------------------------------------------------------

  public getSelection = () : T[] => {
    return this.selection.selected
  }

  //-------------------------------------------------------------------------

  public clearSelection() {
    this.selection = new SelectionModel<T>(true, []);
    this.onRowsSelected.emit(this.selection.selected)
  }

  //-------------------------------------------------------------------------

  public applyFilter() {
    this.tableData.filter = new Date().toString()
    this.rowCount = this.tableData.filteredData.length
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private filterPredicate = (row: T, filter: string) : boolean => {
    // @ts-ignore
    return this.filter(row, this.textToFilter)
  }
}

//=============================================================================
