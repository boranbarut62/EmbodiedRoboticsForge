import type { Lesson } from './types';

export const lessons: Lesson[] = [
  {
    id: 'what-is-a-robot',
    stageId: 'robotics-fundamentals',
    title: 'What Is a Robot?',
    hook: "Every robot you'll ever work on — from a single motor to a humanoid — is built from the same three-part loop. Understanding it now makes everything later click into place.",
    objectives: [
      'Define a robot in terms of sense, think, and act.',
      'Predict what happens to a moving system with no sensor before watching it happen.',
      'Identify the sensors, processor, and actuators in a simple example.',
      'Distinguish a robot from a plain automated machine using the feedback-loop test.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'The Sense-Think-Act Loop',
        body: [
          'A robot is a physical system that senses its environment, makes a decision, and acts on the world through motion. That three-step loop — sense, think, act — is what separates a robot from a machine that just repeats one fixed motion.',
          'A washing machine follows a timer regardless of what is happening around it. A robot vacuum, by contrast, uses a bump sensor or camera to detect a wall, decides to turn, and then drives in a new direction. The presence of a feedback loop between the world and the machine\'s decisions is the key idea.',
        ],
      },
      {
        type: 'interactive',
        heading: 'Open-Loop vs. Closed-Loop',
        component: 'SenseThinkActDemo',
        caption:
          'In Open-Loop mode the dot drives straight ahead with no sensor. In Closed-Loop mode it senses the wall ahead (green dashed line) and reverses before hitting it. Try both.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'wiar-predict',
      },
      {
        type: 'key-concepts',
        heading: 'Key Concepts',
        items: [
          'Sense → Think → Act loop',
          'Sensors: how a robot perceives the world',
          'Actuators: how a robot moves or applies force',
          'Controller: the decision-making layer between sensing and acting',
          'Feedback: using the result of an action to inform the next decision',
          'Open-loop (no feedback) vs. closed-loop (feedback-corrected) behavior',
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: 'A line-following robot has a light sensor (senses reflected light off a line on the floor), a microcontroller (decides whether to steer left or right based on the sensor reading), and two wheel motors (act by adjusting speed). Remove any one piece and it stops being a robot — it becomes either a blind vehicle or a sensor with no way to respond.',
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Where This Shows Up In Every Later Lesson',
        body: [
          "Every remaining lesson in this course is really an elaboration of one piece of this loop: electronics and mechanics build the actuators and sensors, control theory governs the 'think' step precisely, and computer vision and AI make the 'think' step smarter. Keep this loop in mind — it's the map for everything that follows.",
        ],
      },
    ],
    exercises: [
      {
        id: 'wiar-predict',
        kind: 'multiple-choice',
        question: 'Before you switch modes above: in Open-Loop mode, what will happen when the moving dot reaches the wall?',
        choices: [
          'It will stop automatically',
          'It will crash — it has no way to sense the wall',
          'It will turn around smoothly',
          'It will speed up',
        ],
        correctIndex: 1,
        explanation:
          "With no sensor, there's no way for the system to know the wall is there, so it keeps executing its fixed plan (move right) right into the wall. This is the essence of open-loop behavior.",
      },
      {
        id: 'wiar-ex1',
        kind: 'multiple-choice',
        question: 'Which of these best completes the robot loop: Sense → Think → ___?',
        choices: ['Sleep', 'Act', 'Charge', 'Compile'],
        correctIndex: 1,
        explanation:
          'The loop is Sense → Think → Act. Sensing gathers information, thinking (the controller) decides what to do, and acting is the physical output through actuators.',
      },
      {
        id: 'wiar-ex2',
        kind: 'multiple-choice',
        question: 'A microwave that runs for a fixed time when you press "Start" is NOT a robot mainly because:',
        choices: [
          'It does not use electricity',
          'It has no feedback loop connecting sensing to action',
          'It is too small',
          'It does not have wheels',
        ],
        correctIndex: 1,
        explanation:
          'A fixed-timer microwave does not sense the state of the food and adjust its behavior — there is no sense/think/act loop, just a pre-set action. A robot changes its behavior based on what it perceives.',
      },
      {
        id: 'wiar-challenge',
        kind: 'multiple-choice',
        role: 'challenge',
        question: 'In the Closed-Loop demo, what determines how close to the wall the dot gets before it turns around?',
        choices: ['The wall material', 'The sensor range parameter', 'The color of the dot', 'The pivot point'],
        correctIndex: 1,
        explanation:
          "The sensor range determines how early the system detects the wall and reacts — a shorter range means it gets closer before turning, exactly like a real proximity sensor's detection distance.",
      },
    ],
  },

  {
    id: 'voltage-current-resistance',
    stageId: 'electronics',
    title: 'Voltage, Current, and Resistance',
    hook: "Every actuator in a robot is ultimately powered by electricity. Before you can reason about a motor driver or a sensor circuit, you need these three quantities cold.",
    objectives: [
      'Explain voltage, current, and resistance using a water-pipe analogy.',
      'Predict how current changes as resistance increases, before testing it.',
      "State Ohm's Law and use it to solve for an unknown quantity.",
      'Compute power dissipated in a simple circuit.',
      'Recognize why these three quantities matter for every robot circuit.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'The Water-Pipe Analogy',
        body: [
          'Every actuator in a robot — a motor, an LED indicator, a servo — is ultimately powered by electricity, so we start with the three quantities that describe any circuit: voltage, current, and resistance.',
          'A useful mental model is water flowing through a pipe. Voltage is like water pressure — how hard the water is being pushed. Current is like the flow rate — how much water passes a point per second. Resistance is like the pipe\'s narrowness — how much it restricts the flow.',
          "These three quantities are linked by Ohm's Law: V = I × R, where V is voltage in volts, I is current in amps, and R is resistance in ohms. Given any two of these values, you can always solve for the third. This single equation is the starting point for reading almost any circuit diagram you will encounter in robotics.",
        ],
      },
      {
        type: 'interactive',
        heading: 'Circuit Lab',
        component: 'CircuitLab',
        caption:
          'Adjust voltage and resistance and watch the current (blue dashes) speed up or slow down, and the current/power readout update live.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'vcr-predict',
      },
      {
        type: 'key-concepts',
        heading: 'Key Concepts',
        items: [
          'Voltage (V): electrical "pressure", measured in volts',
          'Current (I): rate of charge flow, measured in amps',
          'Resistance (R): opposition to current flow, measured in ohms',
          "Ohm's Law: V = I × R",
          'Power: P = V × I, measured in watts',
          'Series vs. parallel circuits (previewed, covered in depth later)',
        ],
      },
      {
        type: 'text',
        kind: 'math',
        heading: 'Power in a Circuit',
        body: [
          'Alongside Ohm\'s Law, the power dissipated in a resistive circuit is P = V × I (watts). Using Ohm\'s Law you can also write this as P = I²R or P = V²/R — useful whenever you know current or resistance but not the other value directly.',
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: "A robot's indicator LED is connected to a 9V supply through a resistor, and the circuit needs to carry 0.03A (30 mA) of current for the LED to glow at the right brightness without burning out. Using Ohm's Law, R = V / I = 9 / 0.03 = 300 ohms. The resistor dissipates P = V × I = 9 × 0.03 = 0.27 W as heat — that is why a resistor is placed in series with almost every LED.",
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Robotics Connection',
        body: [
          'Every sensor, every microcontroller pin, and every motor driver has voltage and current limits. Exceeding a current limit is one of the most common ways to destroy robot electronics — Ohm\'s Law and the power equation are what let you check, before you power something on, whether a circuit is safe.',
        ],
      },
    ],
    exercises: [
      {
        id: 'vcr-predict',
        kind: 'multiple-choice',
        question: 'If you increase resistance while keeping voltage fixed, what happens to current?',
        choices: ['Increases', 'Decreases', 'Stays the same', 'Becomes negative'],
        correctIndex: 1,
        explanation:
          'Since I = V/R, increasing R while V stays fixed decreases I — try it in the lab above and watch the dashes slow down.',
      },
      {
        id: 'vcr-ex1',
        kind: 'numeric',
        question: "A circuit has a voltage of 12V and a resistance of 4 ohms. Using Ohm's Law, what is the current?",
        answer: 3,
        tolerance: 0.05,
        unit: 'A',
        explanation: 'I = V / R = 12 / 4 = 3 amps.',
      },
      {
        id: 'vcr-ex2',
        kind: 'multiple-choice',
        question: 'In the water-pipe analogy, resistance corresponds most closely to:',
        choices: [
          'How hard the water is pushed',
          'How much water flows per second',
          'How narrow the pipe is',
          'How long the pipe is empty',
        ],
        correctIndex: 2,
        explanation:
          'Resistance restricts flow the way a narrower pipe restricts water — for the same "pressure" (voltage), a narrower pipe (higher resistance) means less flow (lower current).',
      },
      {
        id: 'vcr-power',
        kind: 'numeric',
        question: 'A motor driver circuit has 12V across a 6Ω motor coil. How much power does it dissipate?',
        answer: 24,
        tolerance: 1,
        unit: 'W',
        explanation: 'P = V² / R = 144 / 6 = 24 W. (Equivalently: I = 12/6 = 2A, then P = V×I = 12 × 2 = 24 W.)',
      },
      {
        id: 'vcr-challenge',
        kind: 'multiple-choice',
        role: 'challenge',
        question:
          "A sensor is rated safe up to 100 mA. It's rated at 5V and has an internal resistance of 40Ω. Is it safe to connect directly to a 5V supply?",
        choices: [
          'Yes, current will be exactly 100 mA',
          'Yes, current will be well under 100 mA',
          'No — the current would be 125 mA, over the limit',
          'No — voltage alone always determines safety, regardless of current',
        ],
        correctIndex: 2,
        explanation:
          "I = V / R = 5 / 40 = 0.125 A = 125 mA, which exceeds the 100 mA limit — you'd need a current-limiting resistor in series before connecting this sensor safely.",
      },
    ],
  },

  {
    id: 'vectors-and-coordinates',
    stageId: 'foundations',
    title: 'Vectors and Coordinate Systems',
    hook: "A robot arm's hand, a mobile robot's base, and a drone's body all need one universal language for describing position and direction. That language is the vector — and everything from forward kinematics to SLAM is built on top of it.",
    objectives: [
      'Describe a position or direction using a vector\'s components.',
      "Manipulate a vector directly and read off its magnitude and angle.",
      'Predict what scalar multiplication and addition do before seeing the result.',
      'Add and scale vectors, and interpret the result geometrically.',
      'Explain why robots need a shared coordinate frame to combine motions.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'Physical Intuition',
        body: [
          'A robot arm\'s hand, a mobile robot\'s base, and a drone\'s body all need a precise way to describe "where" they are and "which way" they are facing. A vector — a quantity with both magnitude and direction, usually written as a list of numbers like (x, y) — is the basic tool for that.',
          'A position on its own is meaningless without a reference point. "The gripper is at (3, 5)" only makes sense once you have agreed where (0, 0) is and which directions the axes point. That agreed-upon reference is called a coordinate frame. Robotics is full of coordinate frames: one attached to the robot\'s base, one to each joint, one to the camera, one to the world.',
        ],
      },
      {
        type: 'interactive',
        heading: 'Vector Playground',
        component: 'VectorPlayground',
        caption:
          'Drag the blue handle to change vector A and watch its components, magnitude, and angle update live. Switch modes to explore addition (drag both A and B) and scalar multiplication.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'vec-predict-scale',
      },
      {
        type: 'text',
        kind: 'math',
        heading: 'The Mathematics',
        body: [
          'A 2D vector is written as a pair of components (x, y). Its magnitude — how long it is — is |A| = √(x² + y²), by the Pythagorean theorem. Its angle relative to the x-axis is angle = atan2(y, x).',
          'Vectors add component-by-component: (a, b) + (c, d) = (a + c, b + d). Scalar multiplication scales both components by the same factor: k · (x, y) = (kx, ky).',
        ],
      },
      {
        type: 'text',
        kind: 'derivation',
        heading: 'Where Component-wise Addition Comes From',
        body: [
          'Vector addition is easiest to see geometrically: place the tail of vector B at the tip of vector A. The sum A + B is the vector from the start of A to the end of B — you "walk" along A, then along B, and the sum is where you end up.',
          'Because the x-axis and y-axis are independent directions, how far you move horizontally during that walk depends only on the x-components, and how far you move vertically depends only on the y-components. That is exactly why you can add the components separately — it is not an arbitrary rule, it falls directly out of walking two displacements one after another.',
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: 'A mobile robot starts at (2, 1) meters in the world frame. It then drives along a displacement vector of (1, 3) meters. Its new position is (2 + 1, 1 + 3) = (3, 4). Every step of a robot\'s motion, at its core, is a vector being added to a position.',
      },
      {
        type: 'text',
        kind: 'engineering',
        heading: 'Engineering Application',
        body: [
          'Every CAD model, every robot description file (URDF), and every camera calibration is fundamentally a collection of vectors and coordinate frames relating the parts of a system to each other. Getting comfortable manipulating vectors by hand is what makes those tools legible later instead of magical.',
        ],
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Robotics Connection',
        body: [
          'Every joint, camera, and end-effector on a robot has its own natural local coordinate frame. Converting a position from one frame into another — for example, from "3 cm in front of the camera" to "in front of the robot\'s base" — is done with vector addition and, once rotation is involved, matrix transformations (covered in a later lesson).',
          'Chaining these frame-to-frame conversions across every joint of a robot arm is exactly what forward kinematics does: it is vector addition and rotation, applied link by link, to find out where the hand ends up.',
        ],
      },
    ],
    exercises: [
      {
        id: 'vec-predict-scale',
        kind: 'multiple-choice',
        question: 'If you multiply a vector by a negative scalar, e.g. k = -1, what happens to it visually?',
        choices: [
          'It gets longer only',
          'It flips to point the opposite direction, keeping the same length',
          'It disappears',
          'It turns into a single number',
        ],
        correctIndex: 1,
        explanation:
          'Multiplying by a negative scalar reverses the vector\'s direction and scales its length by |k|. Try setting k to -1 in Scalar Multiply mode above to see it flip.',
      },
      {
        id: 'vec-ex1',
        kind: 'multiple-choice',
        question: 'A robot at position (4, 2) moves by displacement vector (-1, 3). What is its new position?',
        choices: ['(3, 5)', '(5, -1)', '(4, 5)', '(-4, 6)'],
        correctIndex: 0,
        explanation: 'Add component-wise: (4 + -1, 2 + 3) = (3, 5).',
      },
      {
        id: 'vec-ex2',
        kind: 'multiple-choice',
        question: 'Why does a robot arm typically need more than one coordinate frame?',
        choices: [
          'Because computers can only store small numbers in one frame',
          'Because each joint and sensor has its own natural local frame, and these need to be related to a common world frame',
          'Because vectors cannot be added across long distances',
          'It is a legacy convention with no practical benefit',
        ],
        correctIndex: 1,
        explanation:
          'Every joint, camera, and end-effector has a natural local frame. Robotics math (transformations, covered later) converts between these frames so the robot can reason about everything in one consistent world frame.',
      },
      {
        id: 'vec-challenge-frames',
        kind: 'numeric',
        role: 'challenge',
        question:
          "A robot's camera detects an object at (0.3, 0.5) meters in the camera's own frame. The camera is mounted at (1.0, 0.2) meters in the robot's base frame, with its axes aligned to the base frame (no rotation yet). What is the object's x-coordinate in the base frame?",
        answer: 1.3,
        tolerance: 0.05,
        unit: 'm',
        explanation:
          'Since the frames are axis-aligned, converting between them is just vector addition: object_in_base = camera_position_in_base + object_in_camera = (1.0 + 0.3, 0.2 + 0.5) = (1.3, 0.7). This simple case previews the general coordinate transformations — including rotation — used in forward kinematics.',
      },
    ],
  },

  {
    id: 'torque-and-rotation',
    stageId: 'foundations',
    title: 'Torque and Rotational Motion',
    hook: "Every robot joint that rotates — an elbow, a knee, a shoulder — needs enough twisting force to move its own arm and whatever it's carrying. Torque is the quantity that tells you whether a motor is strong enough.",
    objectives: [
      'Explain torque as a rotational effect using a door/lever intuition.',
      'Predict how torque changes with force and lever-arm length before deriving it.',
      'Compute torque from force, lever arm length, and angle: τ = rF sin(θ).',
      'Explain why only the perpendicular component of a force contributes to torque.',
      'Connect torque to gearboxes, and determine whether a joint can lift a given payload.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'Physical Intuition',
        body: [
          'Push open a heavy door right next to the hinge and it barely moves. Push the same door near the outer edge with the same effort, and it swings open easily. Torque is the name for this rotational effect — how much a force twists something around a pivot point.',
          'This is not unique to doors. Every joint in a robot arm is a pivot, and every actuator has to produce enough torque to rotate that joint against gravity and whatever load it is carrying.',
        ],
      },
      {
        type: 'interactive',
        heading: 'Torque Lab',
        component: 'TorqueLab',
        caption:
          'Drag the blue handle to change where the force is applied along the arm. Use the sliders to change the force\'s strength and angle, and watch the door\'s rotation and the τ = r·F·sin(θ) readout respond. The green dashed line shows the perpendicular component of the force — the part that actually causes rotation.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'tor-predict-lever',
      },
      {
        type: 'text',
        kind: 'math',
        heading: 'The Mathematics',
        body: [
          'Torque is τ = r · F · sin(θ), where r is the distance from the pivot to where the force is applied (the lever arm), F is the magnitude of the applied force, and θ is the angle between the force vector and the lever arm.',
          'When the force is applied perpendicular to the lever arm (θ = 90°), sin(90°) = 1, and the formula simplifies to the familiar τ = r · F. That special case is the one usually taught first — but the full formula explains why pushing at an angle produces less turning effect than pushing straight-on.',
          'Units: torque is measured in newton-meters (Nm) — a force in newtons times a distance in meters.',
        ],
      },
      {
        type: 'text',
        kind: 'derivation',
        heading: 'Where sin(θ) Comes From',
        body: [
          'Only the part of a force that pushes perpendicular to the lever arm actually causes rotation. The part that pushes along the arm — toward or away from the pivot — just stretches or compresses the arm; it produces no turning effect at all.',
          'Any force F applied at angle θ to the arm can be split into two components: a perpendicular component F⊥ = F sin(θ) (this is what rotates the arm), and a parallel component F∥ = F cos(θ) (this does nothing rotationally). Torque only cares about F⊥, so τ = r · F⊥ = r · F sin(θ). You can see this decomposition directly in the lab above: the green dashed line is F⊥.',
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: 'You push perpendicular to a wrench with 20 N of force, 0.25 m from the bolt: τ = r F sin(90°) = 0.25 × 20 × 1 = 5 Nm. If you kept your hand in the same place but pushed at only 30° to the wrench instead of straight-on, torque drops to 0.25 × 20 × sin(30°) = 2.5 Nm — same effort, half the turning power. This is why you always push perpendicular to a wrench for maximum effect.',
      },
      {
        type: 'text',
        kind: 'engineering',
        heading: 'Engineering Application',
        body: [
          'Raw motors spin fast but produce relatively little torque. A gearbox trades rotational speed for torque, letting a small, fast-spinning motor still produce enough turning force to move a robot limb. This is why almost every robot joint has a motor-plus-gearbox pair rather than a bare motor.',
        ],
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Robotics Connection',
        body: [
          'The Robotics Connection panel inside the lab above lets you experiment directly: pick a motor torque and gear ratio, and see whether the resulting joint torque is enough to lift a given payload at a given arm length. That calculation — available torque versus required torque — is exactly what a robotics engineer does when selecting a motor for a new joint.',
        ],
      },
    ],
    exercises: [
      {
        id: 'tor-predict-lever',
        kind: 'multiple-choice',
        question: 'If you double the lever arm r while keeping force and angle the same, what happens to torque?',
        choices: ['It halves', 'It stays the same', 'It doubles', 'It quadruples'],
        correctIndex: 2,
        explanation:
          'Torque is directly proportional to lever-arm length (τ = rF sin θ), so doubling r doubles τ — verify it by dragging the handle in the lab above.',
      },
      {
        id: 'tor-calc-basic',
        kind: 'numeric',
        question: 'A force of 15 N is applied perpendicular (θ = 90°) to a lever arm 0.4 m from the pivot. What is the torque?',
        answer: 6,
        tolerance: 0.1,
        unit: 'Nm',
        explanation: 'τ = r F sin(90°) = 0.4 × 15 × 1 = 6 Nm.',
      },
      {
        id: 'tor-calc-angle',
        kind: 'numeric',
        question: 'A 10 N force is applied 0.5 m from the pivot, at an angle of 30° to the lever arm. What is the torque?',
        answer: 2.5,
        tolerance: 0.1,
        unit: 'Nm',
        explanation: 'τ = r F sin(θ) = 0.5 × 10 × sin(30°) = 0.5 × 10 × 0.5 = 2.5 Nm.',
      },
      {
        id: 'tor-gear-ratio',
        kind: 'multiple-choice',
        question:
          'A joint needs about 8 Nm of torque to lift its arm. The bare motor produces 0.4 Nm. Which gear ratio is the minimum that gets you there?',
        choices: ['10:1', '15:1', '20:1', '30:1'],
        correctIndex: 2,
        explanation: 'Required ratio = 8 / 0.4 = 20, so a 20:1 gearbox is the minimum that reaches 8 Nm exactly.',
      },
      {
        id: 'tor-challenge-joint',
        kind: 'numeric',
        role: 'challenge',
        question:
          'A robot joint has a motor producing 2 Nm of torque and a 10:1 gearbox. Ignoring losses, how much theoretical joint torque is available?',
        answer: 20,
        tolerance: 0.5,
        unit: 'Nm',
        explanation:
          'Joint torque = motor torque × gear ratio = 2 × 10 = 20 Nm. Real gearboxes lose some torque to friction, so actual output is always a bit less — engineers apply an efficiency factor (often 70–90%) when sizing motors in practice.',
      },
    ],
  },

  {
    id: 'motor-to-joint',
    stageId: 'robotics-fundamentals',
    title: 'How a Motor Moves a Robot Joint',
    hook: 'This lesson is the payoff for the three lessons before it — it shows electronics, physics, and robotics fundamentals working together inside one real robot part.',
    objectives: [
      'Trace the chain from electrical power to joint motion.',
      'Predict how joint speed and torque change as gear ratio increases, before testing it.',
      'Explain the role of a motor driver, gearbox, and encoder in that chain.',
      'See how electronics, mechanics, and control combine in one robot part.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'Connecting the Pieces',
        body: [
          'This lesson connects the previous three: electronics (voltage/current), physics (torque), and robotics fundamentals (the sense-think-act loop) into one real robotic part — a motorized joint — to show how the disciplines fit together rather than existing in isolation.',
          'A voltage applied to a DC motor\'s coils creates a magnetic force that spins the motor shaft — this is the same voltage and current you studied in the electronics lesson, now doing physical work. Because a raw motor spins fast but with low torque, it is usually connected to a gearbox, which trades speed for the torque needed to move a robot limb, exactly as described in the torque lesson.',
          'A motor driver (a small circuit, often built from transistors) sits between the low-power control signal and the higher-power motor, since a microcontroller cannot supply enough current directly. Finally, an encoder attached to the joint measures its actual position and reports it back to the controller — closing the sense-think-act loop from the very first lesson, so the robot knows whether the joint actually moved where it was told to.',
        ],
      },
      {
        type: 'interactive',
        heading: 'Gearbox Lab',
        component: 'GearboxLab',
        caption:
          'Increase the gear ratio and watch the motor gear (blue) spin fast while the joint gear (green) slows down and grows — speed is being traded for torque.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'mtj-predict',
      },
      {
        type: 'key-concepts',
        heading: 'Key Concepts',
        items: [
          'DC motor: converts electrical current into rotational force',
          'Gearbox: trades rotational speed for torque',
          'Motor driver: lets a low-power controller switch high-power current',
          'Encoder: measures actual joint position/rotation for feedback',
          'The full chain: controller → driver → motor → gearbox → joint → encoder → controller',
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: 'A robot arm\'s elbow joint: the controller commands "rotate to 45°". The motor driver applies voltage to the motor. The motor spins fast with low torque; the gearbox converts this into slow rotation with high torque, moving the joint. An encoder on the joint reports the actual angle back to the controller, which compares it to the 45° target and makes small corrections — a preview of the feedback control you will study in depth in the next lesson.',
      },
      {
        type: 'text',
        kind: 'engineering',
        heading: 'Choosing a Gear Ratio',
        body: [
          'Selecting a gear ratio is a real engineering trade-off: too low, and the joint may not have enough torque to move its load; too high, and the joint becomes needlessly slow (and gearboxes get heavier and less efficient at extreme ratios). Engineers pick the smallest ratio that still provides enough torque with a safety margin.',
        ],
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Robotics Connection',
        body: [
          "The encoder's feedback is what makes closed-loop control possible — the very same idea from the first lesson's sense-think-act loop. The next lesson, Feedback Control, is where you turn that raw encoder signal into a precise, self-correcting motion.",
        ],
      },
    ],
    exercises: [
      {
        id: 'mtj-predict',
        kind: 'multiple-choice',
        question: "As you increase the gear ratio, what happens to the joint's rotational speed?",
        choices: ['It increases', 'It decreases', 'It stays constant', 'It becomes negative'],
        correctIndex: 1,
        explanation:
          'Gear ratio divides speed and multiplies torque — a higher ratio always means a slower (but stronger) joint, exactly what you should see in the lab above.',
      },
      {
        id: 'mtj-ex1',
        kind: 'multiple-choice',
        question: 'Why is a gearbox usually placed between a DC motor and a robot joint?',
        choices: [
          'To reduce electrical noise',
          "To trade the motor's high speed for the higher torque needed to move the joint",
          'To convert AC to DC power',
          "To measure the joint's position",
        ],
        correctIndex: 1,
        explanation:
          'Raw motors spin fast but produce relatively little torque. A gearbox reduces speed and multiplies torque, matching the motor\'s output to what the joint actually needs to move a load.',
      },
      {
        id: 'mtj-ex2',
        kind: 'multiple-choice',
        question: 'What role does the encoder play in the motor-to-joint chain?',
        choices: [
          'It supplies power to the motor',
          'It amplifies the control signal',
          "It measures the joint's actual position and feeds it back to the controller",
          'It converts torque into voltage',
        ],
        correctIndex: 2,
        explanation:
          "The encoder closes the feedback loop: it reports the joint's real position so the controller can compare it against the target and correct any error — the same sense-think-act loop from Lesson 1, now applied to a single joint.",
      },
      {
        id: 'mtj-challenge',
        kind: 'numeric',
        role: 'challenge',
        question: "A motor spins at 4000 RPM. It drives a joint through a 25:1 gearbox. What is the joint's rotational speed?",
        answer: 160,
        tolerance: 5,
        unit: 'RPM',
        explanation: 'Joint RPM = motor RPM / gear ratio = 4000 / 25 = 160 RPM.',
      },
    ],
  },

  {
    id: 'feedback-control',
    stageId: 'control-systems',
    title: 'Feedback Control: From Error to Correction',
    hook: "A motor can spin, and an encoder can measure — but neither knows what the robot actually wants. Feedback control is the missing piece that turns 'spin somehow' into 'reach this exact angle, reliably, even when something pushes back.'",
    objectives: [
      'Explain the target → error → controller → actuator → sensor → feedback loop.',
      'Predict what happens when Kp is too low, too high, or well-tuned before testing it.',
      'Compute the error signal and a proportional control output.',
      'Recognize overshoot, oscillation, and settling time in a response curve.',
      'Connect proportional control to the encoder and motor from the previous lesson.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: "Why Open-Loop Isn't Enough",
        body: [
          "Commanding a motor to 'spin until the joint reaches 90°' sounds simple, but a motor has no idea what angle the joint is actually at — friction, payload weight, and battery voltage all change how far it turns for a given command. Feedback control closes that gap: it constantly compares where the joint IS to where it SHOULD be, and corrects the difference.",
          'This is the same sense-think-act loop from the very first lesson, now made mathematically precise: sense the current position (via the encoder from the last lesson), think by computing an error and a correction, and act by adjusting the motor\'s power.',
        ],
      },
      {
        type: 'interactive',
        heading: 'Proportional Control Lab',
        component: 'PIDLab',
        caption:
          'Set a target angle and a proportional gain Kp, then watch the blue marker (and the graph below it) respond. Try a very low Kp, a very high Kp, and something in between.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'fc-predict-kp',
      },
      {
        type: 'text',
        kind: 'math',
        heading: 'The Mathematics',
        body: [
          'Error is simply e = target − current. Proportional control computes an output proportional to that error: output = Kp × e, where Kp is a tunable gain. A bigger error produces a bigger correction; as the error shrinks, so does the correction.',
          "This single multiplication is the 'P' in PID control. Two more terms — Integral (I) and Derivative (D) — refine this further and are covered in a later lesson; proportional control alone is enough to see the core ideas of overshoot, oscillation, and settling time.",
        ],
      },
      {
        type: 'text',
        kind: 'derivation',
        heading: 'Why High Kp Causes Oscillation',
        body: [
          'Think of the joint as having some inertia (it resists changing speed) and some damping (friction that resists motion). A proportional controller applies a corrective push proportional to the current error — but that push takes a moment to act, during which the error has already started shrinking or even reversed.',
          'With a small Kp, corrections are gentle and the system eases into the target. With a very large Kp, each correction overreacts to the error that existed a moment ago, pushing the joint past the target, which creates a new (opposite) error, which triggers another overreaction — producing the oscillation you can see in the lab\'s graph.',
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: 'A joint\'s target is 60° and it is currently at 20°. With Kp = 0.5, the proportional output is 0.5 × (60 − 20) = 20. As the joint moves closer, say to 50°, the error shrinks to 10° and the output drops to 0.5 × 10 = 5 — the correction naturally tapers off as the joint approaches the target.',
      },
      {
        type: 'text',
        kind: 'engineering',
        heading: 'Engineering Application',
        body: [
          'Every servo, every robot joint controller, and even a home thermostat uses some version of this error-driven correction loop. Tuning Kp (and later, the I and D terms) to get a fast response without excessive overshoot is one of the most common day-to-day tasks in robotics engineering.',
        ],
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Robotics Connection',
        body: [
          'This lesson closes the loop opened by the motor-to-joint lesson: the encoder senses position, the controller computes Kp × error, and the motor driver acts on it — the full controller → driver → motor → gearbox → joint → encoder chain, now with the missing "think" step filled in mathematically.',
        ],
      },
    ],
    exercises: [
      {
        id: 'fc-predict-kp',
        kind: 'multiple-choice',
        question: 'Before you try it: what do you expect if Kp is set very high?',
        choices: [
          'The joint reaches the target instantly with no side effects',
          'The joint responds fast but overshoots and oscillates around the target',
          "The joint doesn't move at all",
          'The joint moves away from the target',
        ],
        correctIndex: 1,
        explanation:
          'A high Kp reacts very strongly to even small errors, which tends to overshoot the target and oscillate before settling — try Kp around 8-10 in the lab above.',
      },
      {
        id: 'fc-calc-output',
        kind: 'numeric',
        question: "A joint's target is 100° and its current position is 70°. With Kp = 0.8, what is the proportional control output?",
        answer: 24,
        tolerance: 0.5,
        explanation: 'output = Kp × error = 0.8 × (100 − 70) = 0.8 × 30 = 24.',
      },
      {
        id: 'fc-slow-kp',
        kind: 'multiple-choice',
        question: 'In the lab, which Kp value is most likely to produce a slow, sluggish response with little or no overshoot?',
        choices: ['0.2', '3', '8', '15'],
        correctIndex: 0,
        explanation: 'A very low Kp reacts weakly to error, producing a slow approach with little overshoot — try it in the lab.',
      },
      {
        id: 'fc-integral',
        kind: 'multiple-choice',
        question:
          "Which term, added to proportional control, specifically helps eliminate small steady leftover error that P alone can't remove?",
        choices: ['Integral (I)', 'Derivative (D)', 'A bigger Kp', 'A slower encoder'],
        correctIndex: 0,
        explanation:
          "The Integral term accumulates error over time and keeps pushing until it's fully eliminated, which is exactly what removes steady-state error that pure P control can leave behind. Covered in a later lesson.",
      },
      {
        id: 'fc-challenge',
        kind: 'numeric',
        role: 'challenge',
        question: "A joint's target is 45° and it's currently at 15°. Using Kp = 1.5, what proportional output is generated right now?",
        answer: 45,
        tolerance: 1,
        explanation: 'output = Kp × error = 1.5 × (45 − 15) = 1.5 × 30 = 45.',
      },
    ],
  },

  {
    id: 'pwm-control',
    stageId: 'embedded-systems',
    title: 'PWM: Digital Control of Analog-ish Power',
    hook: "A microcontroller pin can only be fully on or fully off — yet somehow it dims an LED smoothly and controls a motor's speed continuously. PWM is the trick that makes that possible.",
    objectives: [
      "Explain why digital output pins can't directly produce a variable analog voltage.",
      'Predict what happens to average voltage as duty cycle changes, before testing it.',
      'Compute average voltage from duty cycle and supply voltage.',
      'Explain why rapid switching is perceived as a steady, intermediate value.',
      'Connect PWM to the motor driver from the motor-to-joint lesson.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'Why Not Just Use a Lower Voltage?',
        body: [
          "A microcontroller's GPIO pin is fundamentally digital: it can only output its full supply voltage (HIGH) or 0V (LOW), never something in between. But motors need variable speed and LEDs need variable brightness — so how does a microcontroller control either one smoothly?",
          'The trick is Pulse Width Modulation (PWM): instead of holding a constant intermediate voltage, the pin switches rapidly between fully on and fully off. By controlling the fraction of time spent HIGH versus LOW — the duty cycle — you control the effective average power delivered, without ever using an in-between voltage.',
        ],
      },
      {
        type: 'interactive',
        heading: 'PWM Lab',
        component: 'PWMLab',
        caption: "Adjust duty cycle and watch the LED's apparent brightness track the average of the rapid on/off signal shown in the graph.",
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'pwm-predict',
      },
      {
        type: 'key-concepts',
        heading: 'Key Concepts',
        items: [
          'Duty cycle: fraction of each cycle spent HIGH',
          'PWM frequency: how many on/off cycles occur per second',
          'Average voltage = duty cycle × supply voltage',
          "A physical system's inertia acts as a natural low-pass filter, smoothing rapid switching into a steady effect",
          'PWM is how almost every motor driver and dimmable LED circuit works',
        ],
      },
      {
        type: 'text',
        kind: 'derivation',
        heading: 'Why Rapid Switching Looks Analog',
        body: [
          "Neither an LED's perceived brightness nor a motor's speed can change instantaneously — the human eye integrates light over time, and a motor's inertia prevents its speed from following each individual pulse. Both effectively average the rapid on/off signal over a short window, exactly the exponential smoothing shown by the glowing circle in the lab above.",
          'As long as the PWM frequency is fast enough that a full on/off cycle happens well within that averaging window, only the average matters — and that average is precisely the duty cycle times the supply voltage.',
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: 'A motor driver runs its PWM signal at a 5V supply with a 70% duty cycle. Average voltage = 0.7 × 5V = 3.5V, driving the motor at roughly 70% of its full speed. Push duty cycle to 100% (constant HIGH) and the motor runs at full speed, exactly as if it were connected directly to the 5V supply.',
      },
      {
        type: 'text',
        kind: 'engineering',
        heading: 'Engineering Application',
        body: [
          'PWM frequency has to be chosen carefully: too slow, and you can see an LED flicker or hear a motor whine at the switching frequency; too fast, and switching losses in the driver circuit increase. Typical motor PWM frequencies range from a few hundred Hz to tens of kHz.',
        ],
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Robotics Connection',
        body: [
          "This is exactly how the motor driver from the 'How a Motor Moves a Robot Joint' lesson controls speed: the microcontroller doesn't send a variable voltage — it sends a PWM signal, and the driver circuit (plus the motor's own inertia) turns that into a smoothly variable effective voltage.",
        ],
      },
    ],
    exercises: [
      {
        id: 'pwm-predict',
        kind: 'multiple-choice',
        question: 'If you set duty cycle to 25%, what average voltage would a 5V-supply PWM signal produce?',
        choices: ['5V', '3.75V', '1.25V', '0V'],
        correctIndex: 2,
        explanation:
          'Average voltage = duty × supply = 0.25 × 5 = 1.25V — try setting duty cycle to 25% in the lab above and check the readout.',
      },
      {
        id: 'pwm-calc',
        kind: 'numeric',
        question: 'A PWM signal has a 5V supply and a 40% duty cycle. What is the average voltage?',
        answer: 2,
        tolerance: 0.1,
        unit: 'V',
        explanation: 'Average voltage = 0.4 × 5 = 2V.',
      },
      {
        id: 'pwm-flicker',
        kind: 'multiple-choice',
        question: 'Which change would make an LED driven by PWM flicker visibly to the human eye?',
        choices: [
          'Increasing duty cycle',
          'Decreasing PWM frequency to something very slow, like 5 Hz',
          'Increasing supply voltage',
          'Using a bigger LED',
        ],
        correctIndex: 1,
        explanation:
          "If the switching frequency is slow enough that each on/off cycle takes a noticeable fraction of a second, the eye can perceive the flicker instead of averaging it away — that's why real PWM frequencies for LEDs are usually well above 100Hz.",
      },
      {
        id: 'pwm-challenge',
        kind: 'numeric',
        role: 'challenge',
        question: 'A motor needs an average of 9V from a 12V supply to reach its target speed. What duty cycle is required?',
        answer: 75,
        tolerance: 1,
        unit: '%',
        explanation: 'duty = average / supply = 9 / 12 = 0.75 = 75%.',
      },
    ],
  },

  {
    id: 'gears-mechanical-advantage',
    stageId: 'mechanical-engineering',
    title: 'Gears and Mechanical Advantage',
    hook: "Long before electric motors existed, engineers used levers to trade force for distance — the same trade-off every robot's gearbox still relies on today, just spinning instead of sliding.",
    objectives: [
      'Explain mechanical advantage using a lever/see-saw intuition.',
      'Predict how gear ratio affects speed and torque before testing it.',
      'Compute gear ratio, output speed, and torque multiplication for a meshing gear pair.',
      'Explain why two meshing gears always rotate in opposite directions.',
      'Connect gear trains to the gearbox used in the motor-to-joint lesson.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'Trading Force for Distance',
        body: [
          "A see-saw with a child sitting far from the pivot and an adult sitting close to it can balance — the adult's greater weight is compensated by the child's greater distance from the pivot. This trade-off between force and distance is called mechanical advantage, and it shows up everywhere in mechanical engineering, including inside every gearbox.",
          "Two meshing gears do the same trick continuously: the point where their teeth touch must move at the same linear speed for both gears (otherwise the teeth would jam or slip), which forces the smaller gear to spin faster than the larger one — trading speed for torque, or torque for speed, depending on which way power flows.",
        ],
      },
      {
        type: 'interactive',
        heading: 'Gear Train Lab',
        component: 'GearTrainLab',
        caption: 'Change the tooth counts and watch the driven gear (green) spin faster or slower than the driver (blue) — always in the opposite direction.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'gear-predict',
      },
      {
        type: 'text',
        kind: 'math',
        heading: 'The Mathematics',
        body: [
          'For two meshing gears, gear ratio = driven teeth / driver teeth. Output (driven) speed = driver speed / gear ratio. Assuming no losses, output torque = input torque × gear ratio — speed and torque scale in exactly opposite directions, so their product (related to power) stays constant.',
        ],
      },
      {
        type: 'text',
        kind: 'derivation',
        heading: 'Why the Teeth Must Move at the Same Speed',
        body: [
          "At the point where two gears mesh, their teeth are locked together — one tooth pushes directly on the next. If the gears' pitch circles (imaginary circles at the point of contact) didn't move at the same linear speed there, the teeth would either jam or grind past each other.",
          'That shared linear speed at the contact point is what links the two gears\' angular speeds to their radii (and hence their tooth counts, since tooth size is the same on both gears): ω₁r₁ = ω₂r₂, which rearranges directly into the gear-ratio formula above.',
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: 'A driver gear with 12 teeth spins at 30 RPM and meshes with a driven gear with 36 teeth. Gear ratio = 36/12 = 3. Output speed = 30/3 = 10 RPM, and output torque is 3× the input torque (ignoring friction losses) — the same trade-off you saw in the Gearbox Lab from the motor-to-joint lesson, now made explicit in terms of tooth counts instead of an abstract ratio.',
      },
      {
        type: 'text',
        kind: 'engineering',
        heading: 'Engineering Application',
        body: [
          "Real gear trains chain several gear pairs together to reach very large ratios in a compact space, and use different tooth profiles, materials, and lubrication to manage friction, wear, and backlash (small amounts of play between meshing teeth) — all considerations a mechanical engineer weighs when designing a robot's drivetrain.",
        ],
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Robotics Connection',
        body: [
          "The abstract 'gearbox' slider in the motor-to-joint lesson is, physically, exactly this: one or more meshing gear pairs like the ones above, chosen so their combined ratio matches what the joint needs.",
        ],
      },
    ],
    exercises: [
      {
        id: 'gear-predict',
        kind: 'multiple-choice',
        question: 'If the driven gear has twice as many teeth as the driver, what happens to its rotational speed compared to the driver?',
        choices: ['It doubles', 'It halves', 'It stays the same', 'It reverses only, speed unchanged'],
        correctIndex: 1,
        explanation:
          'A driven gear with twice the teeth must complete half a rotation for every full rotation of the driver (their teeth mesh at the same linear rate), so its speed halves — while its torque doubles.',
      },
      {
        id: 'gear-ratio-calc',
        kind: 'numeric',
        question: 'A driver gear with 10 teeth meshes with a driven gear with 40 teeth. What is the gear ratio?',
        answer: 4,
        tolerance: 0.1,
        explanation: 'gear ratio = driven teeth / driver teeth = 40 / 10 = 4.',
      },
      {
        id: 'gear-speed-calc',
        kind: 'numeric',
        question: "Using the previous gear pair (ratio 4), if the driver spins at 80 RPM, what is the driven gear's speed?",
        answer: 20,
        tolerance: 1,
        unit: 'RPM',
        explanation: 'Output speed = driver speed / gear ratio = 80 / 4 = 20 RPM.',
      },
      {
        id: 'gear-direction',
        kind: 'multiple-choice',
        question: 'Two meshing gears always rotate:',
        choices: ['In the same direction', 'In opposite directions', 'Only clockwise', 'At the same speed'],
        correctIndex: 1,
        explanation: 'Meshing gears turn in opposite directions because their teeth push against each other from opposite sides at the contact point.',
      },
      {
        id: 'gear-challenge',
        kind: 'numeric',
        role: 'challenge',
        question:
          'A driver gear (15 teeth, spinning at 100 RPM, producing 0.5 Nm) meshes with a driven gear with 60 teeth. What torque does the driven gear produce (ignoring losses)?',
        answer: 2,
        tolerance: 0.1,
        unit: 'Nm',
        explanation: 'gear ratio = 60/15 = 4; output torque = input torque × gear ratio = 0.5 × 4 = 2 Nm (speed drops to 25 RPM).',
      },
    ],
  },

  {
    id: 'encoders-measuring-rotation',
    stageId: 'sensors-perception',
    title: 'Encoders and Measuring Rotation',
    hook: 'Every closed-loop system in this course — the feedback control lab, the motor-to-joint chain — has quietly assumed you can measure a joint\'s angle. An encoder is the sensor that actually makes that possible.',
    objectives: [
      'Explain how a rotary encoder converts rotation into countable pulses.',
      'Predict how resolution changes with segment count before testing it.',
      'Compute angular resolution and measured angle from pulse count.',
      'Explain the trade-off between higher resolution and pulse-counting difficulty.',
      'Connect encoders to the sense step of the feedback loops from earlier lessons.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'Turning Rotation Into Something Digital',
        body: [
          "A microcontroller can count digital pulses easily, but a spinning shaft doesn't naturally produce pulses — an encoder's job is to convert continuous rotation into a stream of countable events. The simplest version: a disk with alternating light and dark (or slotted) segments spins between a light source and a sensor, and each segment boundary that passes the sensor produces one pulse.",
          "Count enough pulses and you know how far the disk has turned — this is exactly the encoder referenced in the motor-to-joint and feedback-control lessons, now shown as the physical mechanism behind that single word 'encoder.'",
        ],
      },
      {
        type: 'interactive',
        heading: 'Encoder Lab',
        component: 'EncoderLab',
        caption: 'Increase segment count for finer resolution, and change rotation speed to see pulses accumulate. Compare the true angle to what the encoder can actually measure.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'enc-predict',
      },
      {
        type: 'text',
        kind: 'math',
        heading: 'The Mathematics',
        body: [
          'An encoder with N segments produces N pulses per revolution, so its resolution is 360°/N per pulse. After counting P pulses, the measured angle is P × (360°/N) — always a multiple of the resolution, never something finer, which is exactly the "quantization error" shown in the lab above.',
        ],
      },
      {
        type: 'text',
        kind: 'engineering',
        heading: 'Engineering Application',
        body: [
          'Real encoders reach far higher resolution than a simple slotted disk by using two offset sensor channels (quadrature encoding), which also reveals the direction of rotation — something a single-channel encoder like the one in the lab cannot determine on its own. Higher resolution requires more segments (or channels) packed into the same disk, which means faster, more closely-spaced pulses that the electronics must reliably count without missing any — a real design trade-off.',
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: 'An encoder disk has 24 segments. Resolution = 360°/24 = 15° per pulse. After the shaft turns to a true angle of 47°, the encoder can only report the most recently crossed boundary: 45° (3 pulses × 15°), an error of 2° — visible directly in the lab\'s quantization-error readout.',
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Robotics Connection',
        body: [
          "This is the literal 'sense' step of the sense-think-act loop and the feedback-control lab: the encoder's pulse count becomes the 'current position' that gets compared against the target to compute an error, exactly as in the Proportional Control Lab from the Control Systems lesson.",
        ],
      },
    ],
    exercises: [
      {
        id: 'enc-predict',
        kind: 'multiple-choice',
        question: "If you double the number of segments on the disk, what happens to the encoder's angular resolution (the smallest angle it can distinguish)?",
        choices: ['It doubles (gets worse)', 'It halves (gets better)', 'It stays the same', 'Resolution depends only on speed'],
        correctIndex: 1,
        explanation:
          'Resolution = 360°/segments, so doubling the segment count halves the smallest distinguishable angle — finer resolution. Try it in the lab above.',
      },
      {
        id: 'enc-resolution-calc',
        kind: 'numeric',
        question: 'An encoder disk has 12 segments. What is its angular resolution?',
        answer: 30,
        tolerance: 0.5,
        unit: '°',
        explanation: 'Resolution = 360 / 12 = 30° per pulse.',
      },
      {
        id: 'enc-angle-calc',
        kind: 'numeric',
        question: 'An encoder with 20 segments has counted 15 pulses since the shaft started at 0°. What angle does it report?',
        answer: 270,
        tolerance: 1,
        unit: '°',
        explanation: 'Measured angle = 15 × (360 / 20) = 15 × 18 = 270°.',
      },
      {
        id: 'enc-direction',
        kind: 'multiple-choice',
        question: "Why can't a single-channel encoder (like the one in the lab) determine which direction the shaft is turning?",
        choices: [
          'It can — direction is obvious from pulse count alone',
          'A single pulse stream looks identical whether the disk spins clockwise or counterclockwise',
          'It only works at low speeds',
          'It has too few segments',
        ],
        correctIndex: 1,
        explanation:
          "A single sensor just sees a stream of on/off transitions — it can't tell whether they arrived because the disk moved forward or backward. Real encoders often use two offset channels (quadrature) specifically to resolve this ambiguity.",
      },
      {
        id: 'enc-challenge',
        kind: 'numeric',
        role: 'challenge',
        question: 'A robot joint needs to detect movements as small as 0.5°. What is the minimum number of segments its encoder disk needs?',
        answer: 720,
        tolerance: 5,
        explanation: 'resolution = 360 / N ≤ 0.5 → N ≥ 720 segments (or an equivalent multi-channel/quadrature scheme reaching that effective resolution).',
      },
    ],
  },

  {
    id: 'pixels-to-edges',
    stageId: 'computer-vision',
    title: 'From Pixels to Edges: The Front of the Perception Pipeline',
    hook: "Before a robot can grasp a cup or follow a line, it has to turn a grid of brightness numbers into boundaries and shapes. You've studied computer vision before — this lesson reframes it the way a roboticist sees it: as the first stage of a sense-think-act loop that must work on noisy, real sensor data.",
    objectives: [
      "Treat an image as a matrix of intensities that a robot's software operates on.",
      'Predict how sensor noise affects edge detection before testing it.',
      'Explain blurring and edge detection as convolution with small kernels.',
      'Derive why the Sobel operator approximates an image derivative.',
      "Explain the blur-versus-detail trade-off in a robot's perception pipeline.",
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'An Image Is Just a Matrix',
        body: [
          "To a robot, a camera frame is not a picture — it's a matrix. A 640×480 grayscale image is 307,200 numbers, each one the brightness measured by one pixel of the sensor. Everything a robot 'sees' has to be computed from those numbers.",
          'Objects are interesting precisely where brightness changes sharply: the edge of a box against a table, the border of a line on the floor. Finding those changes reliably — despite sensor noise, uneven lighting, and blur — is the first job of almost every perception pipeline.',
        ],
      },
      {
        type: 'interactive',
        heading: 'Vision Pipeline Lab',
        component: 'VisionLab',
        caption:
          'Step through the pipeline with the buttons. On Sobel Edges with blur at 0, noise shows up as speckled false edges. Try blur 1: the speckle vanishes while the box, ball, and floor line survive. Then try blur 3: the low-contrast dark ball disappears too — too much smoothing erases real detail.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'cv-predict-noise',
      },
      {
        type: 'text',
        kind: 'math',
        heading: 'Convolution: Sliding a Small Kernel',
        body: [
          'Both blurring and edge detection are convolutions: slide a small grid of weights (a kernel) over every pixel, multiply each neighbor by its weight, and sum. A 3×3 box blur uses nine weights of 1/9 — each output pixel becomes the average of its neighborhood, which cancels out random noise.',
          'The Sobel operator uses two kernels. Gx = [[−1, 0, 1], [−2, 0, 2], [−1, 0, 1]] responds to horizontal brightness change; Gy is the same kernel rotated 90°. Edge strength at each pixel is the gradient magnitude √(Gx² + Gy²), and a threshold on that magnitude produces the binary edge map in the lab.',
        ],
      },
      {
        type: 'text',
        kind: 'derivation',
        heading: 'Why Sobel Is a Derivative',
        body: [
          "In calculus, the derivative of f(x) is approximately [f(x+1) − f(x−1)] / 2 — the difference between the values on either side. The middle row of Gx, [−1, 0, 1], computes exactly that difference between a pixel's right and left neighbors: it's a finite-difference derivative in the x direction.",
          "The top and bottom rows repeat the same difference on neighboring rows, with the center row weighted twice as heavily. That extra averaging is built-in smoothing — so Sobel is a derivative and a small blur at once, which is why it tolerates noise better than a raw difference. Edges are simply places where the image's spatial derivative is large.",
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: 'A 3×3 patch straddles a vertical edge: every row reads [10, 10, 50] (dark on the left, bright on the right). Gx = (−10 + 50) + 2(−10 + 50) + (−10 + 50) = 40 + 80 + 40 = 160. Every column is identical top to bottom, so Gy = 0. Gradient magnitude = √(160² + 0²) = 160 — a strong vertical edge.',
      },
      {
        type: 'code',
        heading: 'The Same Pipeline in OpenCV',
        language: 'Python',
        code: `import cv2

frame = cv2.imread("frame.png", cv2.IMREAD_GRAYSCALE)

blurred = cv2.GaussianBlur(frame, (5, 5), 0)   # suppress sensor noise
gx = cv2.Sobel(blurred, cv2.CV_32F, 1, 0, ksize=3)
gy = cv2.Sobel(blurred, cv2.CV_32F, 0, 1, ksize=3)
magnitude = cv2.magnitude(gx, gy)

edges = (magnitude > 150).astype("uint8") * 255`,
        caption:
          "The lab above runs this exact pipeline, written from scratch in the browser. OpenCV's cv2.Canny adds two refinements — thinning edges to one pixel wide and using two thresholds — on top of the same blur-then-gradient core.",
      },
      {
        type: 'text',
        kind: 'engineering',
        heading: 'The Blur Trade-off',
        body: [
          'Every perception pipeline has to choose how much to smooth. Too little, and noise produces false edges — a line-following robot sees phantom lines. Too much, and thin real features blur away — a gripper misjudges where an object ends. Engineers tune this against the actual camera\'s noise, the lighting, and the smallest feature the robot must detect.',
        ],
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Robotics Connection',
        body: [
          "Edges and thresholds power simple, fast robot behaviors directly: a line-follower thresholds the floor line; a pick-and-place cell finds a part's outline to compute its position and orientation.",
          'Modern robots mostly use neural networks for perception — but the first layers of a trained convolutional neural network learn kernels that look remarkably like blur and Sobel filters. The Machine Learning stage picks up exactly here: instead of hand-designing kernels, a network learns them from data.',
        ],
      },
    ],
    exercises: [
      {
        id: 'cv-predict-noise',
        kind: 'multiple-choice',
        question: 'With blur set to 0, what happens to the edge map as you increase sensor noise?',
        choices: [
          'Nothing — edge detection ignores noise',
          'Many false edges appear scattered across the image',
          'The real edges disappear, but nothing else changes',
          'The image gets brighter',
        ],
        correctIndex: 1,
        explanation:
          'Edge detection responds to rapid brightness changes between neighboring pixels — and random noise is exactly that: tiny, rapid changes everywhere. Without smoothing first, noise shows up as a speckle of false edges.',
      },
      {
        id: 'cv-blur-calc',
        kind: 'numeric',
        question: 'A 3×3 box blur is applied at a pixel whose neighborhood is [0, 0, 90 / 0, 90, 90 / 90, 90, 90]. What is the blurred output value?',
        answer: 60,
        tolerance: 0.5,
        explanation: 'A box blur averages all nine values: (0 + 0 + 90 + 0 + 90 + 90 + 90 + 90 + 90) / 9 = 540 / 9 = 60.',
      },
      {
        id: 'cv-sobel-calc',
        kind: 'numeric',
        question:
          'A 3×3 patch has rows [20, 20, 20], [20, 20, 20], [80, 80, 80] (dark above, bright below). Using Gy = [[−1, −2, −1], [0, 0, 0], [1, 2, 1]], what is Gy?',
        answer: 240,
        tolerance: 1,
        explanation: 'Gy = −(20 + 2·20 + 20) + (80 + 2·80 + 80) = −80 + 320 = 240 — a strong horizontal edge.',
      },
      {
        id: 'cv-why-blur',
        kind: 'multiple-choice',
        question: 'Why do vision pipelines usually blur an image before detecting edges?',
        choices: [
          'To make the image smaller',
          'Because derivatives amplify noise, and blurring suppresses noise first',
          'Because edge detectors only work on blurry images',
          'To convert the image to grayscale',
        ],
        correctIndex: 1,
        explanation:
          'A derivative emphasizes rapid changes — including noise. Smoothing first removes much of the high-frequency noise, so the derivative responds mainly to real edges.',
      },
      {
        id: 'cv-challenge',
        kind: 'numeric',
        role: 'challenge',
        question: 'At one pixel, a Sobel filter gives Gx = 30 and Gy = 40. What is the gradient magnitude? (The lab would mark it as an edge if this exceeds the threshold.)',
        answer: 50,
        tolerance: 0.5,
        explanation: '√(30² + 40²) = √2500 = 50. With an edge threshold of 45, for example, this pixel would be marked as an edge.',
      },
    ],
  },

  {
    id: 'single-neuron',
    stageId: 'machine-learning',
    title: 'A Single Neuron: Learning a Decision from Data',
    hook: "Hand-written rules break the moment a robot meets terrain, objects, or lighting its programmer didn't anticipate. Machine learning replaces the rule with a model whose parameters are fitted to data — and the smallest such model, a single neuron trained by gradient descent, already contains the core idea behind every robot policy network.",
    objectives: [
      'Describe a neuron as a weighted sum passed through an activation function.',
      'Adjust weights and bias by hand and see how the decision boundary moves.',
      'Predict what a too-large learning rate does before testing it.',
      'Derive the gradient of the loss for a single sigmoid neuron.',
      'Connect classifiers like this one to robot perception and policies.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'Rules vs. Learned Models',
        body: [
          "Suppose a mobile robot must decide whether the terrain ahead is safe to drive over, using two measurements: slope and roughness. You could hand-write a rule — 'unsafe if slope > 0.5' — but real data rarely splits along one clean threshold. Steep-but-smooth might be fine; gentle-but-rocky might not.",
          'A neuron learns the rule instead. It computes a weighted sum z = w₁·slope + w₂·roughness + b, squashes it through a sigmoid into a probability between 0 and 1, and — this is the learning part — adjusts w₁, w₂, and b to fit examples labeled safe or unsafe.',
        ],
      },
      {
        type: 'interactive',
        heading: 'Neuron Lab: Safe or Unsafe Terrain?',
        component: 'NeuronLab',
        caption:
          'First drag the weight and bias sliders by hand to see how each one moves the decision boundary. Then press Train and watch gradient descent find a good boundary on its own, with the loss curve falling below the plot.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'ml-predict-lr',
      },
      {
        type: 'text',
        kind: 'math',
        heading: 'The Neuron, Its Output, and Its Loss',
        body: [
          "The neuron computes z = w₁x₁ + w₂x₂ + b and outputs p = σ(z) = 1 / (1 + e⁻ᶻ), the predicted probability of 'unsafe.' The decision boundary is where p = 0.5, i.e. where z = 0 — a straight line in the (slope, roughness) plane, exactly the black line in the lab.",
          'To measure how wrong the neuron is, use binary cross-entropy loss: L = −[y·log(p) + (1 − y)·log(1 − p)], averaged over all examples, where y is the true label (1 = unsafe). It is near 0 when the neuron is confident and correct, and grows sharply when it is confident and wrong.',
          'Gradient descent then repeats one update: w ← w − η·∂L/∂w, where η is the learning rate — nudge every parameter slightly downhill on the loss surface.',
        ],
      },
      {
        type: 'text',
        kind: 'derivation',
        heading: 'Where the Gradient Comes From',
        body: [
          'By the chain rule, ∂L/∂w₁ = (∂L/∂p)·(∂p/∂z)·(∂z/∂w₁). The sigmoid has the convenient derivative ∂p/∂z = p(1 − p), and ∂z/∂w₁ = x₁.',
          'Working through ∂L/∂p = −y/p + (1 − y)/(1 − p) and multiplying by p(1 − p), almost everything cancels: ∂L/∂z = p − y. So the full gradient is simply ∂L/∂w₁ = (p − y)·x₁ — prediction error times input. That tiny expression is what the lab computes for every point on every training step, and it is the same chain-rule computation backpropagation performs through every layer of a deep network.',
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: 'A terrain patch has slope 0.8 and roughness 0.5, and is truly unsafe (y = 1). With w₁ = 2, w₂ = 1, b = −1: z = 2(0.8) + 1(0.5) − 1 = 1.1, so p = σ(1.1) ≈ 0.75. The error is p − y = −0.25. The gradient for w₁ is −0.25 × 0.8 = −0.2; with learning rate 0.5, w₁ becomes 2 − 0.5 × (−0.2) = 2.1. The weight on slope increased, making the neuron slightly more confident that steep terrain is unsafe — exactly the correction you would want.',
      },
      {
        type: 'code',
        heading: 'The Training Loop in NumPy',
        language: 'Python',
        code: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# X: (n, 2) array of [slope, roughness]; y: (n,) array of 0/1 labels
w = np.array([-2.0, 3.0])
b = 0.0
lr = 3.0

for step in range(500):
    p = sigmoid(X @ w + b)        # forward pass
    error = p - y                 # dL/dz for every example
    w -= lr * (X.T @ error) / len(y)
    b -= lr * error.mean()`,
        caption:
          'These lines are the entire training loop running in the lab. Frameworks like PyTorch compute the same gradients automatically for networks with millions of parameters.',
      },
      {
        type: 'text',
        kind: 'engineering',
        heading: "When One Neuron Isn't Enough",
        body: [
          "A single neuron can only draw a straight-line boundary. Real robot data — images, lidar scans, joint trajectories — needs curved, high-dimensional boundaries, so neurons are stacked into layers, with each layer's outputs feeding the next. Training is still gradient descent on a loss; backpropagation is just the chain rule from the derivation above, applied layer by layer.",
        ],
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Robotics Connection',
        body: [
          "In robotics, networks built from these neurons do two big jobs. In perception, they classify and detect: is this pixel part of a graspable object? Is this terrain traversable? In control, they become policies: the network's input is the robot's observations, and its output is an action — joint torques or velocities.",
          'The Robot Learning stage builds directly on this: imitation learning fits a policy to demonstrations with a loss like the one above, and reinforcement learning adjusts the same kind of parameters using rewards instead of labels.',
        ],
      },
    ],
    exercises: [
      {
        id: 'ml-predict-lr',
        kind: 'multiple-choice',
        question: 'Before you try it: what do you expect if the learning rate is set very high (e.g. 40)?',
        choices: [
          'Training finishes perfectly in one step',
          'The loss jumps around erratically instead of decreasing smoothly',
          'The weights stop changing',
          'Accuracy is guaranteed to reach 100%',
        ],
        correctIndex: 1,
        explanation:
          'A huge learning rate makes each update overshoot the minimum — the same failure mode as a too-high Kp in the control lab — so the loss bounces around instead of descending smoothly. Try it.',
      },
      {
        id: 'ml-z-calc',
        kind: 'numeric',
        question: 'A neuron has w₁ = 1.5, w₂ = −2, b = 0.5. For input x₁ = 2, x₂ = 1, what is z?',
        answer: 1.5,
        tolerance: 0.01,
        explanation: 'z = 1.5 × 2 + (−2) × 1 + 0.5 = 3 − 2 + 0.5 = 1.5.',
      },
      {
        id: 'ml-sigmoid',
        kind: 'multiple-choice',
        question: 'What does σ(0) equal, and what does it mean for the decision?',
        choices: ['0 — definitely safe', '0.5 — exactly on the decision boundary', '1 — definitely unsafe', 'It is undefined'],
        correctIndex: 1,
        explanation: 'σ(0) = 1 / (1 + e⁰) = 1/2. z = 0 is precisely the decision boundary, where the neuron is maximally uncertain.',
      },
      {
        id: 'ml-gradient-direction',
        kind: 'multiple-choice',
        question: 'For an example labeled unsafe (y = 1) where the neuron predicts p = 0.2, which way will gradient descent push z for that example?',
        choices: ['Down, toward 0', 'Up, making p larger', "It won't change", 'It depends only on the bias'],
        correctIndex: 1,
        explanation: '∂L/∂z = p − y = −0.8, which is negative. Moving against the gradient increases z, raising p toward the correct label of 1.',
      },
      {
        id: 'ml-challenge',
        kind: 'numeric',
        role: 'challenge',
        question: 'A weight w = 2.0 has gradient ∂L/∂w = 0.5, and the learning rate is 0.2. What is w after one gradient descent step?',
        answer: 1.9,
        tolerance: 0.01,
        explanation: 'w ← w − η·∂L/∂w = 2.0 − 0.2 × 0.5 = 1.9.',
      },
    ],
  },

  {
    id: 'ros2-nodes-topics',
    stageId: 'ros2',
    title: 'Nodes and Topics: How Robot Software Is Wired Together',
    hook: 'Every lesson so far built one piece of a robot in isolation — a sensor, a controller, a vision filter. A real robot runs dozens of these at once, written by different people, at different rates, sometimes on different computers. ROS 2 exists to wire them together without turning the system into one tangled program.',
    objectives: [
      'Explain why robot software is split into independent processes (nodes).',
      'Describe how publish/subscribe topics decouple senders from receivers.',
      "Predict how a failed node's absence propagates through a system before testing it.",
      'Compute message rates and bandwidth for a sensor topic.',
      'Read and understand a minimal ROS 2 publisher node.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'Why Not One Big Program?',
        body: [
          "Imagine writing a whole robot as a single program: camera driver, perception, controller, and motor driver all in one loop. The camera runs at 30 Hz, the joint controller at 1000 Hz, perception whenever a frame is done. One slow step stalls everything, one crash kills the whole robot, and nobody can swap in a better perception algorithm without touching the controller's code.",
          'ROS 2 splits the robot into nodes — independent processes that each do one job — which communicate by passing messages over named channels called topics. A node publishes to a topic without knowing who, if anyone, is listening; other nodes subscribe to the topics they need. That decoupling is the entire point.',
        ],
      },
      {
        type: 'interactive',
        heading: 'ROS 2 Graph Lab',
        component: 'ROSGraphLab',
        caption:
          'Blue dots are messages in flight. Click any node (or use the buttons) to kill or restart it, and watch which parts of the system starve. The motor driver deliberately stops when its commands go stale — a standard safety pattern.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'ros-predict-kill',
      },
      {
        type: 'key-concepts',
        heading: 'Key Concepts',
        items: [
          'Node: an independent process with one responsibility (a driver, a filter, a controller)',
          'Topic: a named, typed channel for streaming messages (e.g. /image_raw of type sensor_msgs/Image)',
          'Publish/subscribe: publishers and subscribers never reference each other — only the topic',
          "Service: a request/response call for occasional operations (e.g. 'save the map')",
          "Action: a long-running goal with feedback and cancellation (e.g. 'navigate to the kitchen')",
          'Parameters and launch files: configure and start a whole graph of nodes together',
          'tf2: the ROS library that tracks coordinate frames over time — the Vectors lesson, as infrastructure',
        ],
      },
      {
        type: 'text',
        kind: 'math',
        heading: 'Rates, Bandwidth, and Staleness',
        body: [
          "A topic's bandwidth is message size × publish rate. An uncompressed 640×480 RGB image is 640 × 480 × 3 = 921,600 bytes; at 30 Hz that is about 27.6 MB/s — for one camera, before any other traffic. This arithmetic decides whether a robot needs image compression, a faster network, or on-board processing.",
          'Rates also set freshness. If a controller runs at 100 Hz but its target arrives at 5 Hz, it acts on data up to 200 ms old. Systems define a staleness timeout — 1 second in the lab — after which data is treated as missing rather than trusted.',
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: "A robot has a stereo camera — two 640×480 grayscale images at 1 byte per pixel — publishing at 20 Hz. Each image is 307,200 bytes, so one stereo pair is 614,400 bytes, and at 20 Hz that's about 12.3 MB/s. If a logger node and a perception node both subscribe from another computer, that data may cross the network twice.",
      },
      {
        type: 'code',
        heading: 'A Minimal ROS 2 Publisher',
        language: 'Python (rclpy)',
        code: `import rclpy
from rclpy.node import Node
from sensor_msgs.msg import JointState

class EncoderDriver(Node):
    def __init__(self):
        super().__init__("encoder_driver")
        self.pub = self.create_publisher(JointState, "/joint_states", 10)
        self.create_timer(1 / 8, self.publish_state)   # 8 Hz, as in the lab

    def publish_state(self):
        msg = JointState()
        msg.header.stamp = self.get_clock().now().to_msg()
        msg.name = ["elbow"]
        msg.position = [self.read_encoder_radians()]
        self.pub.publish(msg)

    def read_encoder_radians(self):
        return 0.0  # pulse count × resolution, from the Encoders lesson

rclpy.init()
rclpy.spin(EncoderDriver())`,
        caption:
          "A complete ROS 2 publisher. Notice what it doesn't contain: any reference to the controller, the logger, or anyone else who reads /joint_states. The 10 is the queue depth — how many messages to buffer if a subscriber falls behind.",
      },
      {
        type: 'text',
        kind: 'engineering',
        heading: 'Designing a Node Graph',
        body: [
          "Good ROS 2 systems keep nodes small and single-purpose, use standard message types (sensor_msgs, geometry_msgs) so tools and other nodes interoperate, and pick Quality-of-Service settings per topic — 'reliable' for commands that must arrive, 'best effort' for high-rate sensor streams where a fresh frame beats a retransmitted stale one. Command-line tools like ros2 topic hz and rqt_graph show exactly what the lab visualizes: which nodes exist, how they connect, and at what rates.",
        ],
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Robotics Connection',
        body: [
          'Every earlier lesson maps onto this graph. The encoder from Sensors & Perception becomes an encoder_driver publishing /joint_states; the proportional controller from Control Systems becomes a controller node; the PWM from Embedded Systems lives inside motor_driver; the vision pipeline becomes perception. ROS 2 is less a new subject than the wiring diagram connecting everything you have studied into one running robot — and the Simulation stage will plug a simulated robot into this same graph.',
        ],
      },
    ],
    exercises: [
      {
        id: 'ros-predict-kill',
        kind: 'multiple-choice',
        question: 'Before trying it: if you kill the perception node, what happens to the motor driver?',
        choices: [
          "Nothing — it isn't directly connected to perception",
          'It keeps driving with the last command forever',
          'The controller stops getting /target_pose, stops publishing /cmd_torque, and the motor driver falls back to a safety stop',
          'The camera driver crashes too',
        ],
        correctIndex: 2,
        explanation:
          'The motor driver has no direct link to perception — but the controller only publishes /cmd_torque while /target_pose is fresh. Kill perception and /target_pose goes stale, the controller starves, and the motor driver\'s command timeout triggers a safety stop. Failures propagate through data dependencies, not direct connections.',
      },
      {
        id: 'ros-msg-count',
        kind: 'numeric',
        question: 'A camera publishes /image_raw at 30 Hz, and two nodes subscribe. How many messages does each subscriber receive in 2 seconds?',
        answer: 60,
        tolerance: 0.5,
        explanation: '30 messages/s × 2 s = 60 messages. Each subscriber gets its own copy of every message.',
      },
      {
        id: 'ros-service-vs-topic',
        kind: 'multiple-choice',
        question: 'Which of these is the best fit for a ROS 2 service rather than a topic?',
        choices: [
          'Streaming lidar scans at 10 Hz',
          'Publishing joint states continuously',
          'Asking a mapping node to save the current map to disk and reporting success or failure',
          'Sending motor commands at 500 Hz',
        ],
        correctIndex: 2,
        explanation:
          'Services are request/response — ideal for occasional operations with a single reply. Continuous streams belong on topics; long goals with progress feedback belong in actions.',
      },
      {
        id: 'ros-decoupling',
        kind: 'multiple-choice',
        question: 'You want to record camera images for debugging. With publish/subscribe, what do you need to change in the camera driver?',
        choices: [
          'Add a call to the logger inside the driver',
          'Nothing — start a logger node that subscribes to /image_raw',
          'Merge the logger into the camera driver process',
          'Restart the camera driver with a debug flag',
        ],
        correctIndex: 1,
        explanation:
          "This is the decoupling payoff: publishers don't know their subscribers, so a new consumer (like ros2 bag record) can be added without touching existing code — exactly what the logger node in the lab does.",
      },
      {
        id: 'ros-challenge',
        kind: 'numeric',
        role: 'challenge',
        question:
          'An uncompressed 640×480 RGB camera (3 bytes per pixel) publishes at 30 Hz. What bandwidth does its /image_raw topic need, in megabytes per second (1 MB = 1,000,000 bytes)?',
        answer: 27.648,
        tolerance: 0.3,
        unit: 'MB/s',
        explanation:
          '640 × 480 × 3 = 921,600 bytes per frame; × 30 Hz = 27,648,000 bytes/s ≈ 27.6 MB/s — which is why real robots often publish compressed images.',
      },
    ],
  },

  {
    id: 'physics-engines-timestep',
    stageId: 'simulation',
    title: 'Inside a Physics Engine: Stepping Time Forward',
    hook: 'Robot hardware is expensive, slow to reset, and breaks when a controller goes wrong — so modern robotics is developed in simulation first. But a simulator is only as trustworthy as the way it steps time forward, and one surprisingly small choice — which integration formula to use — decides whether a simulated robot behaves physically or quietly gains energy until it flies apart.',
    objectives: [
      "Explain how a physics engine advances a robot's state in discrete time steps.",
      'Predict how the time step and integrator affect a simulation before testing it.',
      'Compute explicit and semi-implicit Euler updates by hand.',
      'Derive why explicit Euler steadily gains energy on an oscillating system.',
      'Explain the sim-to-real gap and why tools like MuJoCo, Gazebo, and Isaac Sim exist.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'A Simulator Is a Loop',
        body: [
          "Every physics engine — MuJoCo, Gazebo, Isaac Sim — runs the same core loop: from the robot's current positions and velocities, compute the forces (gravity, motor torques, contacts), turn forces into accelerations, and advance positions and velocities by one small time step dt. Repeat thousands of times per simulated second.",
          'The pendulum below is a single robot link swinging under gravity with no friction, so its total energy should stay exactly constant forever. That makes it the perfect test: any change in energy is error introduced by the simulator itself.',
        ],
      },
      {
        type: 'interactive',
        heading: 'Integrator Lab',
        component: 'PendulumSimLab',
        caption:
          'Three copies of the same pendulum, each stepped with a different integration formula. The true energy is a flat 100%. Slide the time step up and watch which methods drift — then slide it down to 0.002 s and see what changes.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'sim-predict-euler',
      },
      {
        type: 'text',
        kind: 'math',
        heading: 'Three Ways to Take a Step',
        body: [
          'Let α = −(g/L)·sin θ be the angular acceleration gravity produces. Explicit Euler updates both variables from the old values: θₙ₊₁ = θₙ + ωₙ·dt and ωₙ₊₁ = ωₙ + αₙ·dt.',
          'Semi-implicit (symplectic) Euler changes only the order: update velocity first, then use the new velocity for position: ωₙ₊₁ = ωₙ + αₙ·dt, then θₙ₊₁ = θₙ + ωₙ₊₁·dt. Same cost, very different long-run behavior.',
          'RK4 (fourth-order Runge–Kutta) samples the dynamics four times within each step and blends them. It is far more accurate per step, at four times the work.',
        ],
      },
      {
        type: 'text',
        kind: 'derivation',
        heading: 'Why Explicit Euler Gains Energy',
        body: [
          'For small swings the pendulum behaves like a harmonic oscillator, x″ = −ω²x, whose energy is proportional to ω²x² + v². Explicit Euler gives x′ = x + v·dt and v′ = v − ω²x·dt.',
          "Expand the new energy: ω²(x + v·dt)² + (v − ω²x·dt)². The cross terms, +2ω²xv·dt and −2ω²xv·dt, cancel exactly, leaving ω²x² + v² + ω²v²dt² + ω⁴x²dt² = (ω²x² + v²)(1 + ω²dt²). So every single step multiplies the energy by (1 + ω²dt²), which is always greater than 1. A smaller dt slows the growth but never stops it.",
          "Semi-implicit Euler's velocity-first ordering exactly preserves a slightly modified energy, so its error oscillates but never accumulates. That is why it's the default in many game and robotics physics engines.",
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: 'A simulated joint has angle 0.5 rad, angular velocity 2 rad/s, and angular acceleration −4 rad/s², with dt = 0.01 s. Explicit Euler: θ = 0.5 + 2 × 0.01 = 0.52 and ω = 2 + (−4) × 0.01 = 1.96. Semi-implicit Euler: ω = 1.96 first, then θ = 0.5 + 1.96 × 0.01 = 0.5196. The difference is only 0.0004 rad per step — but over a million steps, whether such errors cancel out or pile up decides whether the simulation stays physical.',
      },
      {
        type: 'code',
        heading: 'The Same Pendulum in MuJoCo',
        language: 'Python',
        code: `import mujoco

xml = """
<mujoco>
  <option timestep="0.002" integrator="implicitfast"/>
  <worldbody>
    <body pos="0 0 1">
      <joint name="swing" type="hinge" axis="0 1 0"/>
      <geom type="capsule" fromto="0 0 0 0 0 -1" size="0.02" mass="1"/>
    </body>
  </worldbody>
</mujoco>
"""
model = mujoco.MjModel.from_xml_string(xml)
data = mujoco.MjData(model)
data.qpos[0] = 1.0                    # start at about 57 degrees

for _ in range(5000):                 # 5000 × 0.002 s = 10 s of robot time
    mujoco.mj_step(model, data)       # one integration step

print(data.qpos[0], data.qvel[0])`,
        caption:
          'MuJoCo is the physics engine behind much of today\'s robot-learning research. timestep and integrator are exactly the two knobs from the lab.',
      },
      {
        type: 'text',
        kind: 'engineering',
        heading: 'Choosing a Time Step and a Simulator',
        body: [
          'Stiff interactions — a foot striking the ground, fingers squeezing an object — need small steps, often 1–2 ms, and halving dt doubles the compute. Engineers pick the largest time step that keeps the stiffest part of the scene stable.',
          'They also pick the tool for the job: Gazebo for testing a full ROS 2 system end to end, MuJoCo for fast and accurate contact dynamics, and Isaac Sim / Isaac Lab for training thousands of robots in parallel on a GPU.',
        ],
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'The Sim-to-Real Gap',
        body: [
          "Even a perfectly integrated simulation is only a model: real motors have friction and backlash, real sensors have noise and delay, real floors aren't flat. A controller or learned policy that exploits simulator quirks fails on hardware. The Robot Learning stage returns to this with domain randomization — deliberately varying masses, friction, and delays in simulation so the policy learns to handle whatever the real world turns out to be.",
        ],
      },
    ],
    exercises: [
      {
        id: 'sim-predict-euler',
        kind: 'multiple-choice',
        question: "At dt = 0.05 s, what do you expect to happen to the explicit Euler pendulum's energy over time?",
        choices: [
          'It stays at 100%',
          'It slowly drains toward 0%, like friction',
          'It keeps growing — the swings get bigger and bigger',
          'It jumps randomly up and down',
        ],
        correctIndex: 2,
        explanation:
          'Explicit Euler systematically adds energy to oscillating systems (the derivation below shows exactly how much per step), so the swings grow until the pendulum whirls over the top — impossible for a frictionless pendulum. Try it.',
      },
      {
        id: 'sim-euler-calc',
        kind: 'numeric',
        question: 'A simulated cart has position x = 2.0 m and velocity v = 3.0 m/s. Using explicit Euler with dt = 0.1 s, what is x after one step?',
        answer: 2.3,
        tolerance: 0.01,
        unit: 'm',
        explanation: 'x ← x + v·dt = 2.0 + 3.0 × 0.1 = 2.3 m.',
      },
      {
        id: 'sim-rate',
        kind: 'numeric',
        question: "MuJoCo's default time step is 0.002 s. How many integration steps does it take to simulate 30 seconds of robot time?",
        answer: 15000,
        tolerance: 1,
        explanation: '30 s / 0.002 s = 15,000 steps — which is why simulating many robots in parallel needs a fast engine.',
      },
      {
        id: 'sim-why-semi',
        kind: 'multiple-choice',
        question: 'Why do many physics engines prefer semi-implicit Euler over explicit Euler?',
        choices: [
          'It is much more expensive, but perfectly accurate',
          "It costs the same per step, but keeps an oscillating system's energy bounded instead of growing",
          'It only works for pendulums',
          'It removes the need for a time step',
        ],
        correctIndex: 1,
        explanation:
          'Swapping the update order costs nothing extra, yet the energy error stays bounded instead of compounding every step — exactly the blue curve versus the red curve in the lab.',
      },
      {
        id: 'sim-challenge',
        kind: 'numeric',
        role: 'challenge',
        question:
          'For an oscillator with ω² = 10 (rad/s)², explicit Euler multiplies energy by (1 + ω²·dt²) every step. With dt = 0.1 s, by what factor has the energy grown after 10 steps? (Two decimals.)',
        answer: 2.59,
        tolerance: 0.03,
        explanation: 'Each step multiplies by 1 + 10 × 0.01 = 1.1, so after 10 steps: 1.1¹⁰ ≈ 2.59 — the energy has more than doubled in one simulated second.',
      },
    ],
  },

  {
    id: 'path-planning',
    stageId: 'autonomous-robotics',
    title: 'Path Planning: BFS, Dijkstra, and A*',
    hook: "An autonomous robot constantly answers one question: how do I get from here to there without hitting anything, as cheaply as possible? You may have met these algorithms in a data structures course — here you'll watch what each one actually does on a robot's map, and see why A* became the workhorse of robot navigation.",
    objectives: [
      "Represent a robot's environment as a grid graph with obstacles and traversal costs.",
      'Predict which algorithm routes through expensive terrain before testing it.',
      'Compare BFS, Dijkstra, and A* by path cost and number of cells expanded.',
      'Explain why an admissible heuristic keeps A* optimal.',
      'Connect grid planning to occupancy grids and real navigation stacks.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'The World as a Graph',
        body: [
          'A mobile robot typically plans on an occupancy grid: the floor divided into cells, each marked free, occupied, or somewhere in between. Every free cell is a node; neighboring cells are connected by edges whose cost reflects distance or difficulty — mud, gravel, or a slope costs more than smooth floor. Path planning becomes graph search.',
          'The three classic algorithms differ in just one thing: which cell they explore next. BFS goes in order of number of steps, Dijkstra in order of accumulated cost, and A* in order of accumulated cost plus an estimate of the cost still remaining to the goal.',
        ],
      },
      {
        type: 'interactive',
        heading: 'Path Planner Lab',
        component: 'PathPlannerLab',
        caption:
          'Pick an algorithm and watch it search: shaded cells have been expanded, and the final path appears as blue dots. Paint walls or mud (cost 5) onto the map, and compare all three algorithms in the table below it.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'plan-predict-mud',
      },
      {
        type: 'text',
        kind: 'math',
        heading: 'Costs, Priorities, and the Heuristic',
        body: [
          'Each algorithm keeps a frontier of discovered-but-unexpanded cells and repeatedly expands the best one. Dijkstra prioritizes g(n), the cheapest known cost from the start to n. A* prioritizes f(n) = g(n) + h(n), where h(n) estimates the remaining cost to the goal.',
          'On a 4-connected grid the natural estimate is the Manhattan distance, h(n) = |x − x_goal| + |y − y_goal|. BFS is Dijkstra with every move treated as cost 1 — which is why it minimizes steps rather than cost.',
        ],
      },
      {
        type: 'text',
        kind: 'derivation',
        heading: 'Why A* Is Still Optimal',
        body: [
          'A heuristic is admissible if it never overestimates the true remaining cost. Manhattan distance is admissible here: every move changes x or y by exactly 1 and costs at least 1, so no route to the goal can be cheaper than the Manhattan distance.',
          'Now suppose A* were about to finish with a worse path of cost C. Somewhere along the true optimal path (cost C* < C) sits a frontier cell n with f(n) = g(n) + h(n) ≤ g(n) + (true remaining cost) = C* < C. That cell has a lower priority value than the goal, so A* must expand it first — it can never accept the worse path.',
          'The heuristic only changes the order of exploration, pulling it toward the goal. That is why A* expands far fewer cells than Dijkstra while returning an equally cheap path — compare their rows in the lab.',
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: 'Start at (0, 0), goal at (4, 3). The frontier holds cell A at (2, 1) with g = 3, and cell B at (1, 3) with g = 5 (it crossed mud). Heuristics: h(A) = 2 + 2 = 4 and h(B) = 3 + 0 = 3, so f(A) = 7 and f(B) = 8 — A* expands A next. Dijkstra would also pick A (g = 3 < 5), but with no sense of direction it would already have expanded every cell with g < 3, in every direction, to get here.',
      },
      {
        type: 'code',
        heading: 'A* in Python',
        language: 'Python',
        code: `import heapq

def astar(grid, start, goal):
    """grid[y][x] is None for a wall, otherwise the cost to enter that cell."""
    def h(cell):
        return abs(cell[0] - goal[0]) + abs(cell[1] - goal[1])

    frontier = [(h(start), 0, start)]          # (f, g, cell)
    came_from = {start: None}
    best_g = {start: 0}

    while frontier:
        f, g, cell = heapq.heappop(frontier)
        if cell == goal:
            path = []
            while cell is not None:
                path.append(cell)
                cell = came_from[cell]
            return path[::-1], g
        if g > best_g[cell]:
            continue                             # stale queue entry
        x, y = cell
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= ny < len(grid) and 0 <= nx < len(grid[0]) and grid[ny][nx] is not None:
                new_g = g + grid[ny][nx]
                if new_g < best_g.get((nx, ny), float("inf")):
                    best_g[(nx, ny)] = new_g
                    came_from[(nx, ny)] = cell
                    heapq.heappush(frontier, (new_g + h((nx, ny)), new_g, (nx, ny)))
    return None, float("inf")`,
        caption:
          'Make h return 0 and this is Dijkstra. Swap the priority queue for a plain FIFO queue and ignore costs, and it is BFS. The three algorithms are one algorithm with different priorities.',
      },
      {
        type: 'text',
        kind: 'engineering',
        heading: 'From Grid to Real Planner',
        body: [
          "Real navigation stacks, like ROS 2's Nav2, run this same idea at scale: a global planner searches a costmap built from lidar, with costs inflated near obstacles so paths keep a safety margin, and a local planner follows that path while reacting to moving obstacles. Grid resolution is a trade-off — finer cells find paths through narrow gaps but multiply the number of cells to search.",
        ],
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Beyond Grids',
        body: [
          "Grid search suits a mobile base moving in 2D. A robot arm with 7 joints lives in a 7-dimensional configuration space, where a grid would be impossibly large, so arm planners use sampling-based methods like RRT and RRT*, which grow a tree of random collision-free configurations instead. Whatever the method, the planner's output feeds the controllers from earlier stages, which turn a path into actual motor commands.",
        ],
      },
    ],
    exercises: [
      {
        id: 'plan-predict-mud',
        kind: 'multiple-choice',
        question: 'On the default map, one algorithm routes straight through the mud. Which one?',
        choices: ['BFS', 'Dijkstra', 'A*', 'All three'],
        correctIndex: 0,
        explanation:
          'BFS explores by number of steps and treats every move as equally cheap, so it takes the fewest-steps route straight through the mud. Dijkstra and A* track accumulated cost, so they take a couple of extra steps to go around. Compare the Path cost column in the table.',
      },
      {
        id: 'plan-heuristic',
        kind: 'numeric',
        question: 'On a 4-connected grid, what is the Manhattan-distance heuristic from cell (2, 3) to a goal at (7, 9)?',
        answer: 11,
        tolerance: 0.01,
        explanation: 'h = |2 − 7| + |3 − 9| = 5 + 6 = 11.',
      },
      {
        id: 'plan-cost',
        kind: 'numeric',
        question: 'A path takes 12 moves. 3 of them enter mud cells (cost 5); the rest enter normal cells (cost 1). What is its total cost?',
        answer: 24,
        tolerance: 0.01,
        explanation: '9 normal moves × 1 + 3 mud moves × 5 = 9 + 15 = 24.',
      },
      {
        id: 'plan-admissible',
        kind: 'multiple-choice',
        question: "What does it mean for A*'s heuristic to be admissible?",
        choices: [
          'It always exactly equals the true remaining cost',
          'It never overestimates the true remaining cost',
          'It is always zero',
          'It overestimates so the search finishes faster',
        ],
        correctIndex: 1,
        explanation:
          'Admissible means h(n) ≤ true remaining cost, which guarantees A* returns an optimal path. h = 0 is admissible too — but then A* is just Dijkstra. The closer an admissible h gets to the true cost, the fewer cells A* expands.',
      },
      {
        id: 'plan-challenge',
        kind: 'multiple-choice',
        role: 'challenge',
        question: "You replace A*'s heuristic with 3 × Manhattan distance. What is the most likely result?",
        choices: [
          'Same optimal path and fewer cells expanded, guaranteed',
          'Fewer cells expanded, but the path may cost more than the optimum',
          'More cells expanded and a cheaper path',
          'The search can no longer find any path',
        ],
        correctIndex: 1,
        explanation:
          'A clean straight route costs exactly the Manhattan distance, so tripling it overestimates — the heuristic is no longer admissible. The search gets greedier, rushing toward the goal and expanding fewer cells, but it can commit to a route through mud before discovering the cheaper detour. "Weighted A*" makes exactly this trade in practice: speed for a bounded loss of optimality.',
      },
    ],
  },

  {
    id: 'q-learning',
    stageId: 'robot-learning',
    title: 'Reinforcement Learning: Learning from Reward',
    hook: "In the Machine Learning stage, a neuron learned from labeled examples: here's the terrain, here's the right answer. A robot learning to walk or grasp rarely gets labels — it gets consequences. Reinforcement learning turns trial, error, and reward into a policy, and it is behind many of today's learned legged-locomotion controllers.",
    objectives: [
      'Define state, action, reward, policy, and value for a robot task.',
      "Predict how the agent's returns evolve as training proceeds.",
      'Compute a Q-learning update and a discounted return by hand.',
      'Explain the exploration–exploitation trade-off controlled by ε.',
      'Connect tabular Q-learning to deep RL, imitation learning, and sim-to-real.',
    ],
    sections: [
      {
        type: 'text',
        kind: 'intuition',
        heading: 'Learning from Consequences',
        body: [
          'The robot below lives on a small grid and can move up, down, left, or right. Every move costs −1 (energy and time), falling into a pit costs −10 and ends the attempt, and reaching the charging station earns +10. Nobody tells it the route; it has to discover one by trying things and noticing what paid off.',
          'Q-learning keeps a table Q(s, a): for every state s (cell) and action a (move), an estimate of the total future reward from taking a there and acting well afterward. The policy is simply: in each state, pick the action with the highest Q.',
        ],
      },
      {
        type: 'interactive',
        heading: 'Q-Learning Lab',
        component: 'QLearningLab',
        caption:
          'Train some episodes and watch value spread backward from the goal (green) and away from the pits (red), with arrows showing the current best action in each cell. Press Watch Policy to see the learned behavior. Then try training a few hundred episodes, setting ε to 0, and training again — notice what happens to the average return.',
      },
      {
        type: 'exercise',
        heading: 'Predict First',
        exerciseId: 'rl-predict-returns',
      },
      {
        type: 'text',
        kind: 'math',
        heading: 'The Q-Learning Update',
        body: [
          "After each move from state s with action a, receiving reward r and landing in s′, the agent updates Q(s, a) ← Q(s, a) + α·[r + γ·maxₐ′ Q(s′, a′) − Q(s, a)]. The bracket is the temporal-difference (TD) error: the gap between what the agent predicted and what it now believes, based on the reward it just received plus its own estimate of the next state.",
          'α (learning rate) sets how far each update moves. γ (discount factor, between 0 and 1) sets how much future reward counts relative to immediate reward. The agent is maximizing the discounted return G = r₁ + γr₂ + γ²r₃ + ⋯',
        ],
      },
      {
        type: 'text',
        kind: 'derivation',
        heading: 'Why the Update Works',
        body: [
          'By definition, the optimal Q-value is the immediate reward plus the discounted value of acting optimally from the next state: Q*(s, a) = E[r + γ·maxₐ′ Q*(s′, a′)]. This is the Bellman equation — a consistency condition the true Q-values must satisfy.',
          'The Q-learning update nudges each table entry toward the right-hand side, one real sample at a time. Over many visits the errors shrink until the table is approximately self-consistent, and value propagates backward from the reward: first the cell next to the goal learns it is valuable, then the cell next to that one, and so on — exactly the spreading green in the lab.',
        ],
      },
      {
        type: 'worked-example',
        heading: 'Worked Example',
        body: 'The agent is in a cell with Q(s, right) = 2. It moves right, gets r = −1, and lands in a cell whose best Q-value is 6. With α = 0.5 and γ = 0.9: target = −1 + 0.9 × 6 = 4.4; TD error = 4.4 − 2 = 2.4; new Q(s, right) = 2 + 0.5 × 2.4 = 3.2. Moving right from here now looks more attractive, because it leads somewhere good.',
      },
      {
        type: 'code',
        heading: 'Q-Learning in Python',
        language: 'Python',
        code: `import random
from collections import defaultdict

Q = defaultdict(lambda: [0.0, 0.0, 0.0, 0.0])    # 4 actions per state
alpha, gamma, epsilon = 0.5, 0.95, 0.2

for episode in range(500):
    state = env.reset()
    done = False
    while not done:
        if random.random() < epsilon:
            action = random.randrange(4)                          # explore
        else:
            action = max(range(4), key=lambda a: Q[state][a])     # exploit
        next_state, reward, done = env.step(action)
        target = reward if done else reward + gamma * max(Q[next_state])
        Q[state][action] += alpha * (target - Q[state][action])
        state = next_state`,
        caption:
          "This is the whole algorithm running in the lab. Libraries like Gymnasium standardize this reset/step loop (their step also reports truncation and extra info), so the same agent code can train on a gridworld, a simulated arm, or a legged robot.",
      },
      {
        type: 'text',
        kind: 'engineering',
        heading: 'From Tables to Networks',
        body: [
          "A table works for 35 cells. A walking robot's state — dozens of joint angles and velocities, body orientation, contact forces — is continuous and high-dimensional, so the table is replaced by a neural network: the Machine Learning stage's neurons, stacked deep. Deep RL algorithms such as PPO and SAC train these networks, typically across thousands of parallel simulated robots in tools like Isaac Lab, because they need millions of trials that would take years — and many broken robots — on real hardware.",
        ],
      },
      {
        type: 'text',
        kind: 'robotics',
        heading: 'Where This Goes Next',
        body: [
          "Reward design is where RL gets hard in practice: reward only 'reached the goal' and learning is painfully slow; add shaped rewards carelessly and the agent finds loopholes. That's why robot learning also leans on imitation learning — learning a policy directly from human demonstrations — often followed by RL fine-tuning.",
          'Every policy trained in simulation must also cross the sim-to-real gap from the Simulation stage, typically with domain randomization. Embodied AI, the next stage, puts perception, learning, and control together into one agent.',
        ],
      },
    ],
    exercises: [
      {
        id: 'rl-predict-returns',
        kind: 'multiple-choice',
        question: 'Before training: as you train more and more episodes, what do you expect the return curve to do?',
        choices: [
          "Stay flat — the agent can't improve without labels",
          'Rise from very negative values and level off near the best possible return',
          'Oscillate forever with no trend',
          'Steadily decrease',
        ],
        correctIndex: 1,
        explanation:
          'Early episodes are mostly wandering and falling into pits, so returns are very negative. As value propagates back from the goal, the greedy policy improves and returns climb, then level off below the best achievable return (+1). How far below depends on ε: exploration keeps forcing random moves, and some of them land in pits. Set ε to 0 after training and the average return climbs to exactly +1.',
      },
      {
        id: 'rl-q-update',
        kind: 'numeric',
        question: 'Q(s, a) = 1. The agent takes a, receives r = −1, and lands in a state whose highest Q-value is 5. With α = 0.4 and γ = 0.9, what is the new Q(s, a)?',
        answer: 2,
        tolerance: 0.01,
        explanation: 'target = −1 + 0.9 × 5 = 3.5; TD error = 3.5 − 1 = 2.5; new Q = 1 + 0.4 × 2.5 = 2.0.',
      },
      {
        id: 'rl-discounted',
        kind: 'numeric',
        question: "An episode's rewards are −1, −1, +10, in that order. With γ = 0.9, what is the discounted return G from the start?",
        answer: 6.2,
        tolerance: 0.01,
        explanation: 'G = −1 + 0.9 × (−1) + 0.9² × 10 = −1 − 0.9 + 8.1 = 6.2.',
      },
      {
        id: 'rl-epsilon',
        kind: 'multiple-choice',
        question: 'What does the exploration rate ε control?',
        choices: [
          'How much future rewards count',
          'The fraction of moves chosen at random instead of by the current best Q-value',
          'How large each Q-update is',
          'The size of the grid',
        ],
        correctIndex: 1,
        explanation:
          "ε trades exploration for exploitation: with probability ε the agent tries a random move, which is how it discovers routes its current Q-table doesn't yet favor. Future-reward weighting is γ, and update size is α.",
      },
      {
        id: 'rl-challenge',
        kind: 'numeric',
        role: 'challenge',
        question: "In the lab's gridworld, the shortest safe route from START to the goal takes 10 moves. What is the best possible undiscounted return an episode can achieve?",
        answer: 1,
        tolerance: 0.01,
        explanation: "Nine ordinary moves at −1 each, then the tenth move enters the goal for +10: 9 × (−1) + 10 = +1. That's the ceiling in the lab — reached exactly once training is done and ε is set to 0.",
      },
    ],
  },
];
