//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//=== Original code by Owrrpon
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Subscription } from 'rxjs';
import {MatExpansionModule} from "@angular/material/expansion";
import {DragAndDropDirective} from "../drag-n-drop.directive";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatRippleModule} from "@angular/material/core";
import {MatTooltipModule} from "@angular/material/tooltip";
import {NgForOf, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {LabelService} from "../../../service/label.service";

//=============================================================================

const StatusInput     = 0
const StatusUploading = 1
const StatusSuccess   = 2
const StatusError     = 3

//=============================================================================

@Component({
  selector   :    'file-uploader',
  templateUrl:  './file-uploader.html',
  styleUrls  : ['./file-uploader.scss'],
  imports    : [
    MatExpansionModule, DragAndDropDirective, MatProgressBarModule, MatRippleModule, MatTooltipModule,
    NgIf, ReactiveFormsModule, NgForOf, MatButtonModule, MatSnackBarModule
  ],
  standalone: true
})

//=============================================================================

export class FileUploader {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() acceptedTypes : string  = ""
  @Input() multiSelection: boolean = false
  @Input() disabled      : boolean = false

  @Output() onFileChange : EventEmitter<string[]> = new EventEmitter<string[]>()

  //-------------------------------------------------------------------------

  selectedFiles : FileInfo[] = [];

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(private snackBar: MatSnackBar, private labelService : LabelService) {
  }

  //-------------------------------------------------------------------------
  //---
  //--- Methods
  //---
  //-------------------------------------------------------------------------

  onChange(event : any): void {
    this.selectFiles(event.target.files);
  }

  //-------------------------------------------------------------------------

  loc(code : string) : string {
    return this.labelService.getLabelString("fileUpload."+ code);
  }

  //-------------------------------------------------------------------------
  //--- Event called on dragNdrop or file selection from dialog

  selectFiles(files: any[]){
    let incoming_file_count = files.length;
    let incorrect_MIME_type = false;

    this.selectedFiles = []

    for(let i = 0; i < incoming_file_count; i++) {
      let file = files[i];
      let type = this.getFileType(file)

      // Checking if type is acceptable
      if(this.acceptedTypes.indexOf(type)>=0) {
        this.selectedFiles.push(new FileInfo(file, this.convertSize(file.size)));
      }
      else {
        incorrect_MIME_type = true;
      }
    }

    if (incorrect_MIME_type) {
      let message = "Only files of the following MIME types are allowed: "+this.acceptedTypes;
      this.snackBar.open(message, "", { duration: 3000});
    }

    this.emitFileChange()
  }

  //-------------------------------------------------------------------------

  removeFile(index: number){
    this.selectedFiles.splice(index, 1);
    this.emitFileChange()
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private getFileType(file : any) : string {
    let type = file.type

    if (type != "") {
      let index = type.indexOf("/")

      if (index> -1) {
        type = type.substring(index +1)
      }
    }
    else {
      type = file.name.toLowerCase()

      let index = type.lastIndexOf(".")

      if (index> -1) {
        type = type.substring(index +1)
      }
      else {
        type = "???"
      }
    }

    return type
  }

  //-------------------------------------------------------------------------

  private convertSize(fileSize: number): string {
    return fileSize < 1024000
      ? (fileSize / 1024).toFixed(2) + ' KB'
      : (fileSize / 1024000).toFixed(2) + ' MB';
  }

  //-------------------------------------------------------------------------

  private emitFileChange() {
    let outFiles : string[] = []

    this.selectedFiles.forEach( (fi, index, array) => {
      outFiles.push(fi.file)
    })

    this.onFileChange.emit(outFiles)
  }
}

//=============================================================================

class FileInfo {
  file : any
  size : string

  //-------------------------------------------------------------------------

  constructor(file:any, size:string) {
    this.file   = file
    this.size   = size
  }
}

//=============================================================================
