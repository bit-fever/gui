//=============================================================================
//===
//=== Copyright (C) 2023 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

export interface TreeNodeProvider<T> {
  getName(node : T): string;
  getChildren(node : T) : T[];
}

//=============================================================================
