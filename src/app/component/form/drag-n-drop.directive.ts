//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//=== Original code by Mariem Chaabeni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

//=============================================================================

@Directive({
  selector: '[dragAndDrop]',
  standalone: true
})

//=============================================================================

export class DragAndDropDirective {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Output() onFileDropped = new EventEmitter<any>();
  @HostBinding('style.opacity') private workspace_opacity = '1';

  //-------------------------------------------------------------------------
  // Dragover listener, when files are dragged over our host element

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.workspace_opacity = '0.5';
  }

  //-------------------------------------------------------------------------
  // Dragleave listener, when files are dragged away from our host element

  @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.workspace_opacity = '1';
  }

  //-------------------------------------------------------------------------
  //Drop listener, when files are dropped on our host element

  @HostListener('drop', ['$event']) public ondrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.workspace_opacity = '1';
    let files = event.dataTransfer!.files;
    if (files.length > 0) {
      this.onFileDropped.emit(files)
    }
  }
}

//=============================================================================
