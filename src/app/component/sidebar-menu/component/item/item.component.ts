//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnDestroy,
	OnInit,
	ChangeDetectorRef,
	HostBinding,
} from '@angular/core';
import { Event as RouterEvent, NavigationEnd, Router } from '@angular/router';

import { BehaviorSubject, Subject } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { MenuItem } from '../../model';

import { RoleService }     from '../../service/role.service';
import { SearchService }   from '../../service/search.service';
import { rotateAnimation } from '../node/node.animations';

//=============================================================================

@Component({
    selector: 'li[asm-menu-item][menuItem]',
    templateUrl: './item.component.html',
    animations: [rotateAnimation],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

//=============================================================================

export class ItemComponent implements OnInit, OnDestroy {

  //-------------------------------------------------------------------------
  //---
  //--- Variables
  //---
  //-------------------------------------------------------------------------

  @Input() menuItem  !: MenuItem;
  @Input() level     !: number;
  @Input() isRootNode = true;
  @Input() disable    = false;

  @HostBinding('class.asm-menu-item--filtered') get filtered(): boolean {
    return this.isItemFiltered;
  }
  @HostBinding('class.asm-menu-item--disabled') get disabled(): boolean {
    return this.isItemDisabled || this.disable;
  }

  private onDestroy$ = new Subject<void>();
  private isActive   = new BehaviorSubject(false);
  private isFiltered = new BehaviorSubject(false);

  isActive$      = this.isActive.asObservable().pipe(distinctUntilChanged(), takeUntil(this.onDestroy$));
  isFiltered$    = this.isFiltered.asObservable().pipe(distinctUntilChanged(), takeUntil(this.onDestroy$));
  isItemFiltered = false;
  isItemDisabled = false;

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  constructor(
    private router           : Router,
    public  roleService      : RoleService,
    private searchService    : SearchService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  //-------------------------------------------------------------------------
  //---
  //--- Public methods
  //---
  //-------------------------------------------------------------------------

  ngOnInit(): void {
    this.routerItemActiveSubscription();
    this.emitItemActive();
    this.menuSearchSubscription();
    this.disabledItemSubscription();
  }

  //-------------------------------------------------------------------------

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  //-------------------------------------------------------------------------

  onNodeActive(event: boolean): void {
    this.isActive.next(event);
  }

  //-------------------------------------------------------------------------

  onNodeFiltered(event: boolean): void {
    this.isItemFiltered = event;
    this.isFiltered.next(event);
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  private routerItemActiveSubscription(): void {
    this.router.events
      .pipe(
        filter((e: RouterEvent): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntil(this.onDestroy$)
      )
      .subscribe((e) => {
        this.emitItemActive();
      });
  }

  //-------------------------------------------------------------------------

  private menuSearchSubscription(): void {
    if (!this.menuItem.children) {
      this.searchService.search$.pipe(takeUntil(this.onDestroy$)).subscribe((search) => {
        this.isItemFiltered = this.searchService.filter(search, this.menuItem.label || this.menuItem.header);
        this.isFiltered.next(this.isItemFiltered);
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  //-------------------------------------------------------------------------

  private disabledItemSubscription(): void {
    this.roleService
      .disableItem$(this.menuItem.roles)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((disabled) => (this.isItemDisabled = disabled));
  }

  //-------------------------------------------------------------------------

  private emitItemActive(): void {
    if (this.menuItem.route) {
      this.isActive.next(this.isActiveRoute(this.menuItem.route));
    }
  }

  //-------------------------------------------------------------------------

  private isActiveRoute(route: string): boolean {
    return this.router.isActive(route, this.isItemLinkExact());
  }

  //-------------------------------------------------------------------------

  private isItemLinkExact(): boolean {
    return this.menuItem.linkActiveExact === undefined ? true : this.menuItem.linkActiveExact;
  }
}

//=============================================================================
