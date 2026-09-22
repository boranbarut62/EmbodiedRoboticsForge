import type { ComponentType } from 'react';
import { VectorPlayground } from './VectorPlayground';
import { TorqueLab } from './TorqueLab';
import { CircuitLab } from './CircuitLab';
import { SenseThinkActDemo } from './SenseThinkActDemo';
import { GearboxLab } from './GearboxLab';
import { PIDLab } from './PIDLab';
import { PWMLab } from './PWMLab';
import { GearTrainLab } from './GearTrainLab';
import { EncoderLab } from './EncoderLab';

export const interactives: Record<string, ComponentType> = {
  VectorPlayground,
  TorqueLab,
  CircuitLab,
  SenseThinkActDemo,
  GearboxLab,
  PIDLab,
  PWMLab,
  GearTrainLab,
  EncoderLab,
};
