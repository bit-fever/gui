//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {
	Component,
	Input,
	Output,
	EventEmitter,
	ChangeDetectionStrategy,
	HostBinding,
	ViewChild
} from '@angular/core';
import {RouterLinkActive} from '@angular/router';

import {MenuItem }       from '../../model';
import {AnchorService}   from '../../service/anchor.service';
import {EventBusService} from "../../../../service/eventbus.service";
import {AppEvent}        from "../../../../model/event";

//=============================================================================

@Component({
	selector       : 'asm-menu-anchor',
	templateUrl    : './anchor.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})

//=============================================================================

export class AnchorComponent {
  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() menuItem!: MenuItem;
  @Input() isActive?: boolean;
  @Input() disable = false;

  @Output() clickAnchor = new EventEmitter<void>();

  @HostBinding('class.asm-menu-anchor--active') get active(): boolean {
    return this.isActive || (!!this.routerLinActive?.isActive && !this.disable);
  }

  @ViewChild('rla') private routerLinActive?: RouterLinkActive;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(public  anchorService  : AnchorService,
              private eventBusService: EventBusService) {}

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  menuItemClass(item:MenuItem) : string|undefined {
    if (item.iconClasses) {
      return item.iconClasses;
    }

    return this.anchorService.iconClasses;
  }

  //-------------------------------------------------------------------------

  onClick() : void {
      let event = new AppEvent<any>('menu.button.click');
      this.eventBusService.emitToApp(event);
  }
}

//=============================================================================
