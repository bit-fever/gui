//=============================================================================
//===
//=== Copyright (C) 2022 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import { animate, AUTO_STYLE, state, style, transition, trigger } from '@angular/animations';

const TRANSITION_DURATION = 300;

//=============================================================================

export const openCloseAnimation = trigger('openClose', [
  state('true', style({ height: AUTO_STYLE })),
  state('false', style({ height: 0 })),
  transition('false <=> true', animate(`${TRANSITION_DURATION}ms ease-in`)),
]);

//=============================================================================

export const rotateAnimation = trigger('rotate', [
  state('true', style({ transform: 'rotate(-90deg)' })),
  transition('false <=> true', animate(`${TRANSITION_DURATION}ms ease-out`)),
]);

//=============================================================================
