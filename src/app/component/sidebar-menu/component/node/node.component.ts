//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { combineLatest, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { MenuItem } from '../../model';

import { NodeService } from '../../service/node.service';
import { RoleService } from '../../service/role.service';
import { openCloseAnimation } from './node.animations';
import { ItemComponent } from '../item/item.component';
import { trackByItem } from '../../internal/utils';

//=============================================================================

@Component({
    selector: 'asm-menu-node',
    templateUrl: './node.component.html',
    animations: [openCloseAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

//=============================================================================

export class NodeComponent implements AfterViewInit, OnDestroy {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() menuItem!: MenuItem;
  @Input() level   !: number;
  @Input() disable = false;

  @Output() isActive   = new EventEmitter<boolean>();
  @Output() isFiltered = new EventEmitter<boolean>();

  @HostBinding('class.asm-menu-node--open') get open(): boolean {
    return this.isOpen;
  }

  @ViewChildren(ItemComponent) private menuItemComponents!: QueryList<ItemComponent>;

  isOpen        = false;
  isActiveChild = false;
  trackByItem   = trackByItem;

  private onDestroy$ = new Subject<void>();

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(
    public  nodeService      : NodeService,
    public  roleService      : RoleService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  ngAfterViewInit(): void {
    this.openedNodeSubscription();
    this.activeItemsSubscription();
    this.filterItemsSubscription();
  }

  //-------------------------------------------------------------------------

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  //-------------------------------------------------------------------------

  onNodeToggleClick(): void {
    this.isOpen = !this.isOpen;
    this.nodeService.openedNode.next({ nodeComponent: this, nodeLevel: this.level });
    this.changeDetectorRef.markForCheck();
  }

  //-------------------------------------------------------------------------

  private activeItemsSubscription(): void {
    const isChildrenItemsActive = this.menuItemComponents.map((item) => item.isActive$);

    if (isChildrenItemsActive && isChildrenItemsActive.length) {
      combineLatest(isChildrenItemsActive)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((itemsActiveState) => {
          this.isOpen = this.isActiveChild = itemsActiveState.includes(true);
          this.isActive.emit(this.isOpen);
        });
    }
  }

  //-------------------------------------------------------------------------

  private filterItemsSubscription(): void {
    const isChildrenItemsFiltered = this.menuItemComponents.map((item) => item.isFiltered$);

    if (isChildrenItemsFiltered && isChildrenItemsFiltered.length) {
      combineLatest(isChildrenItemsFiltered)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((itemsFilteredState) => {
          const isItemsFiltered = !itemsFilteredState.includes(false);
          this.isFiltered.emit(isItemsFiltered);
        });
    }
  }

  //-------------------------------------------------------------------------

  private openedNodeSubscription(): void {
    this.nodeService.openedNode
      .pipe(
        filter(() => this.isOpen),
        filter((node) => node.nodeComponent !== this),
        takeUntil(this.onDestroy$)
      )
      .subscribe((node) => {
        if (node.nodeLevel <= this.level) {
          this.isOpen = false;
          this.changeDetectorRef.markForCheck();
        }
      });
  }
}

//=============================================================================
