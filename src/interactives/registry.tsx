import type { ComponentType } from 'react';
import { VectorPlayground } from './VectorPlayground';
import { TorqueLab } from './TorqueLab';
import { CircuitLab } from './CircuitLab';
import { SenseThinkActDemo } from './SenseThinkActDemo';
import { GearboxLab } from './GearboxLab';
import { PIDLab } from './PIDLab';

export const interactives: Record<string, ComponentType> = {
  VectorPlayground,
  TorqueLab,
  CircuitLab,
  SenseThinkActDemo,
  GearboxLab,
  PIDLab,
};
