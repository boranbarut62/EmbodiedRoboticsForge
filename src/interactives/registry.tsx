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
import { VisionLab } from './VisionLab';
import { NeuronLab } from './NeuronLab';
import { ROSGraphLab } from './ROSGraphLab';
import { PendulumSimLab } from './PendulumSimLab';
import { PathPlannerLab } from './PathPlannerLab';
import { QLearningLab } from './QLearningLab';
import { EmbodiedAgentLab } from './EmbodiedAgentLab';
import { HumanoidBalanceLab } from './HumanoidBalanceLab';

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
  VisionLab,
  NeuronLab,
  ROSGraphLab,
  PendulumSimLab,
  PathPlannerLab,
  QLearningLab,
  EmbodiedAgentLab,
  HumanoidBalanceLab,
};
