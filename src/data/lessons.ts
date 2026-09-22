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
];
