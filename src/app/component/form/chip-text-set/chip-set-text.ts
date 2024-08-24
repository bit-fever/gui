//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {CommonModule} from "@angular/common";
import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal} from "@angular/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";

//=============================================================================

export type Validator = (value : string) => boolean

//=============================================================================

@Component({
  selector    :     'chip-set-text',
  templateUrl :   './chip-set-text.html',
  styleUrls   : [ './chip-set-text.scss' ],
  imports: [CommonModule, MatFormFieldModule, MatChipsModule, MatIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone  : true
})

//=============================================================================

export class ChipSetTextComponent {

  //-------------------------------------------------------------------------
  //---
  //--- UI properties
  //---
  //-------------------------------------------------------------------------

  readonly addOnBlur          = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() title      : string = ""
  @Input() label      : string = ""
  @Input() items      : string[] = []
  @Input() validator? : Validator;

  @Output() itemsChange = new EventEmitter<string[]>();


  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor() {}

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  add(event: MatChipInputEvent): void {
    let value = (event.value || '').trim();

    if (value) {
      if (this.validator == undefined || this.validator(value)) {
        this.items = [...this.items, value]
        this.itemsChange.emit(this.items)
      }
    }

    event.chipInput!.clear();
  }

  //-------------------------------------------------------------------------

  remove(item: string): void {
    let index = this.items.indexOf(item);

    if (index >= 0) {
      this.items.splice(index, 1);
      this.itemsChange.emit(this.items)
    }
  }

  //-------------------------------------------------------------------------

  edit(item: string, event: MatChipEditedEvent) {
    let value = event.value.trim();

    if (!value) {
      this.remove(item);
      return;
    }

    let index = this.items.indexOf(item);
    if (index >= 0) {
      if (this.validator == undefined || this.validator(value)) {
        this.items[index] = value;
        this.itemsChange.emit(this.items)
      }
    }
  }
}

//=============================================================================
