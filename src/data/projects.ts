import type { Project } from './types';

const OLED_WIRING = [
  { from: 'OLED VCC', to: 'ESP32 3V3', note: 'Read the labels on your module — pin order differs between makers. Swapping VCC and GND can destroy it.' },
  { from: 'OLED GND', to: 'ESP32 GND' },
  { from: 'OLED SCL', to: 'ESP32 GPIO22 (D22)', note: 'Default I²C clock pin on ESP32' },
  { from: 'OLED SDA', to: 'ESP32 GPIO21 (D21)', note: 'Default I²C data pin on ESP32' },
];

export const projects: Project[] = [
  {
    id: 'esp32-voltmeter',
    title: 'Project 1: Build an ESP32 Voltmeter and Discover Sensor Error',
    summary:
      "Turn the ESP32's built-in analog-to-digital converter (ADC) into a voltmeter with an OLED readout, then test it against your multimeter. Along the way you'll solder, read a pinout, build voltage dividers from your resistor kit, and measure sensor noise, quantization, calibration error, and loading effects with your own hands. Apart from a USB cable, every part comes from your purchase list.",
    duration: '3–5 hours, easy to split across sessions',
    difficulty: 'Beginner — your first hardware build',
    prerequisites: ['voltage-current-resistance', 'encoders-measuring-rotation'],
    goals: [
      'Solder header pins and verify each joint with a multimeter.',
      'Read a development-board pinout and connect an I²C display.',
      "Predict voltage-divider outputs with Ohm's law, then measure them.",
      "Compare an ADC's readings against a reference instrument and map its error.",
      'Measure sensor noise and see that averaging N samples cuts it by roughly √N.',
      'Discover how high source resistance changes what an instrument reads (loading).',
    ],
    parts: [
      { name: 'ESP32 ESP-32S development board (30-pin)', quantity: '1', source: 'owned' },
      { name: '0.96" SSD1306 I²C OLED display', quantity: '1', source: 'owned' },
      { name: 'Large breadboard', quantity: '1', source: 'owned' },
      { name: 'Male–male jumper wires', quantity: '~10', source: 'owned' },
      { name: 'Female–male jumper wires', quantity: 'a few', source: 'owned', note: 'Handy if the ESP32 leaves little breadboard room' },
      {
        name: 'Resistors: 10 kΩ ×2, 4.7 kΩ ×1, 22 kΩ ×1, 1 MΩ ×2',
        quantity: '6',
        source: 'owned',
        note: 'From your 1/4 W kit. If there is no 1 MΩ, use the two largest equal values you have.',
      },
      {
        name: 'USB data cable matching your ESP32 (usually micro-USB)',
        quantity: '1',
        source: 'extra',
        note: 'Not on your list. Many phone-charging cables carry power only and will not work for uploading.',
      },
    ],
    tools: [
      'ZD-8988E-C soldering station',
      '60/40 solder wire, 1.2 mm',
      'Plato 170 flush cutter',
      'AN870 multimeter',
      'A3 cutting mat',
      'A computer with Arduino IDE 2',
    ],
    safety: [
      'The soldering iron tip runs at over 300 °C. Always return it to its stand, never reach across it, and unplug the station when you finish.',
      'Your cutting mat is plastic and will melt: keep the hot iron and freshly soldered joints off it. Solder over a heat-proof surface such as a ceramic tile.',
      '60/40 solder contains lead. Wash your hands after soldering, and do not eat or drink at the bench. Work in a ventilated room and keep your face out of the flux smoke.',
      'Wear glasses when cutting component leads — clipped ends can fly off at speed.',
      'Everything here runs from USB (5 V) and the ESP32 (3.3 V). ESP32 pins tolerate at most 3.3 V: never connect VIN or 5 V to a GPIO pin.',
      'Unplug the USB cable before changing any wiring. Never measure resistance in a circuit that is powered.',
    ],
    steps: [
      {
        id: 'bench',
        title: 'Prepare a safe workbench',
        body: [
          'Clear a table, put the cutting mat down for small parts and wiring, and set up a heat-proof spot (a ceramic tile works) for soldering. Place the station where its cable cannot be snagged.',
          'Lay out every part from the parts list and identify each one. Leave the resistors on their paper tape until you need them — the tape keeps values sorted.',
        ],
        checkpoint: 'Every part is identified, the iron has a stand in a place you will not knock it, and you know where the heat-proof surface is.',
      },
      {
        id: 'toolchain',
        title: 'Set up the ESP32 toolchain',
        body: [
          'Install Arduino IDE 2. Open Boards Manager, search for "esp32", and install "esp32 by Espressif Systems". Select the board "ESP32 Dev Module".',
          'Connect the ESP32 with your USB data cable and choose its port under Tools → Port. If no new port appears, look at the small chip next to the USB connector: install the CP210x driver if it says CP2102, or the CH340 driver if it says CH340.',
          'Upload the sketch below and open the Serial Monitor at 115200 baud. If the upload stalls at "Connecting....", hold the board\'s BOOT button until uploading begins.',
        ],
        code: {
          language: 'Arduino C++',
          code: `void setup() {
  Serial.begin(115200);
}

void loop() {
  Serial.printf("Hello from the ESP32! Uptime: %lu ms\\n", millis());
  delay(1000);
}`,
        },
        checkpoint: 'The Serial Monitor prints a new line every second.',
      },
      {
        id: 'solder',
        title: 'Solder the OLED header pins (skip if already soldered)',
        body: [
          'Many OLED modules ship with loose header pins. Push the pins (short side up) into the breadboard to hold them straight, and rest the module on top so the pins poke through its holes.',
          'Heat the pin and the pad together for 1–2 seconds, feed solder into the joint (not onto the iron), then remove the solder and then the iron. If your station has temperature control, start around 330 °C. Solder one pin first, check the module sits flat, then do the rest.',
          'A good joint is a small, shiny cone that wets both the pin and the pad. A dull ball sitting on top is a cold joint; reheat it. Solder bridging two pins is a short; drag it away with a clean tip.',
        ],
        checkpoint:
          'With the multimeter in continuity mode (it beeps on a connection): each pin beeps against its own pad trace, and no two neighboring pins beep against each other.',
      },
      {
        id: 'measure-first',
        title: 'Measure before you trust',
        body: [
          'Set the multimeter to resistance (Ω) and measure each resistor you will use, unpowered and out of the circuit. Write down nominal versus measured values. Kit resistors are usually ±5% (4 color bands) or ±1% (5 bands).',
          'Plug in the ESP32. Set the meter to DC volts, put the black probe on a GND pin and the red probe on the 3V3 pin. Be careful not to let a probe bridge two pins. Record the value: you will use this measured supply voltage in every prediction below, instead of assuming exactly 3.3 V.',
        ],
        checkpoint: 'You have a table of measured resistances, and the 3V3 pin reads roughly 3.2–3.35 V.',
      },
      {
        id: 'oled',
        title: 'Connect the OLED and say hello',
        body: [
          'Unplug USB. Place the ESP32 across the breadboard\'s center gap. The 30-pin board is wide, so you may get only one free hole beside each pin on one side; that is enough for one jumper per pin. If it is too tight, use female–male jumpers straight from the ESP32 pins.',
          'Wire the OLED as shown. In Library Manager, install "Adafruit SSD1306" and accept its dependencies (Adafruit GFX and BusIO). Upload the sketch.',
        ],
        wiring: OLED_WIRING,
        code: {
          language: 'Arduino C++',
          code: `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  Serial.begin(115200);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED not found at 0x3C: check wiring, or try 0x3D");
    while (true) delay(1000);
  }
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(2);
  display.setCursor(0, 0);
  display.println("Hello,");
  display.println("robot!");
  display.display();
}

void loop() {}`,
        },
        checkpoint:
          '"Hello, robot!" appears on the screen. If not: run File → Examples → Wire → WireScan to find the display\'s I²C address. If the text looks squashed or uses only half the screen, you may have a 128×32 module; change 64 to 32.',
      },
      {
        id: 'divider',
        title: 'Build a voltage divider and predict its output',
        body: [
          'Unplug USB. Build a divider: 3V3 → R1 (10 kΩ) → a middle row → R2 (10 kΩ) → GND. Connect the middle row to GPIO34 (D34). GPIO34 is an input-only pin wired to the ESP32\'s first ADC.',
          'Predict before you measure: V_out = V_3V3 × R2 / (R1 + R2), using your measured supply voltage and resistances. Then plug in USB and measure the middle row with the multimeter.',
        ],
        wiring: [
          { from: 'ESP32 3V3', to: 'R1 (10 kΩ) top leg' },
          { from: 'R1 bottom leg', to: 'Middle row (the node)' },
          { from: 'Middle row', to: 'R2 (10 kΩ) top leg' },
          { from: 'R2 bottom leg', to: 'ESP32 GND' },
          { from: 'Middle row', to: 'ESP32 GPIO34 (D34)', note: 'Never feed this pin more than 3.3 V' },
        ],
        checkpoint: 'The multimeter reads within a few percent of your prediction — about half your measured 3V3 voltage.',
      },
      {
        id: 'voltmeter',
        title: 'Turn the ESP32 into a voltmeter',
        body: [
          'Upload the voltmeter sketch. It takes 64 readings, averages them, and reports the mean in millivolts and the noise (standard deviation). analogReadMilliVolts() converts raw ADC counts to millivolts using factory calibration data stored in each chip.',
          'Compare the OLED reading with the multimeter. Open Tools → Serial Plotter to watch the values live.',
        ],
        code: {
          language: 'Arduino C++',
          code: `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

const int SENSE_PIN = 34;       // ADC1 input-only pin
const int SAMPLES = 64;         // try 1, 4, 16, 64

Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  Serial.begin(115200);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("OLED not found");
    while (true) delay(1000);
  }
  display.setTextColor(SSD1306_WHITE);
}

void loop() {
  float sum = 0, sumSq = 0;
  for (int i = 0; i < SAMPLES; i++) {
    float mv = analogReadMilliVolts(SENSE_PIN);
    sum += mv;
    sumSq += mv * mv;
    delay(2);
  }
  float mean = sum / SAMPLES;
  float noise = sqrtf(fmaxf(0.0f, sumSq / SAMPLES - mean * mean));
  int raw = analogRead(SENSE_PIN);    // 0-4095

  display.clearDisplay();
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.println("ESP32 Voltmeter");
  display.printf("raw: %d / 4095\\n", raw);
  display.setTextSize(2);
  display.setCursor(0, 24);
  display.printf("%.0f mV", mean);
  display.setTextSize(1);
  display.setCursor(0, 50);
  display.printf("noise: %.1f mV", noise);
  display.display();

  Serial.printf("mV:%.1f,noise:%.2f\\n", mean, noise);
}`,
        },
        checkpoint:
          'The OLED shows a stable reading near the multimeter value. In the middle of the range it is typically within a few percent — record the difference either way. That difference is what the next step investigates.',
      },
      {
        id: 'error-map',
        title: 'Map the error across the whole range',
        body: [
          'For each row, unplug USB, swap resistors (R1 on top to 3V3, R2 on the bottom to GND), predict, then measure with both instruments. Also try GPIO34 wired straight to GND (0 V) and straight to 3V3.',
          'Predictions at 3.30 V: 22k/4.7k → 0.58 V · 22k/10k → 1.03 V · 10k/10k → 1.65 V · 10k/22k → 2.27 V · 4.7k/22k → 2.72 V. Recompute with your own measured values.',
          'Record predicted, multimeter, and ESP32 values, and compute the ESP32\'s error at each point. Where is it most accurate? Where is it worst?',
        ],
        checkpoint:
          'You have a table of about 7 rows. You should find the ESP32 reads well in the middle and worst near the ends: Espressif documents the most accurate range at this setting as roughly 0.15–2.45 V, and readings flatten out toward about 3.1 V.',
      },
      {
        id: 'noise',
        title: 'Measure noise and the power of averaging',
        body: [
          'With the 10k/10k divider, set SAMPLES to 1 and upload; note the noise value. Repeat with 4, 16, and 64.',
          'Statistics predicts that averaging N independent samples shrinks the noise by √N — so 64 samples should be roughly 8× quieter than 1. Then pinch the jumper wire on GPIO34 between your fingers and watch the noise change: your body couples electrical interference into the wire.',
        ],
        checkpoint: 'You can state how much noise dropped from 1 to 64 samples, and compare it with the √N prediction. It may drop somewhat less than 8×, if part of the noise is not independent from sample to sample.',
      },
      {
        id: 'loading',
        title: 'Discover loading: when measuring changes the answer',
        body: [
          'Replace the divider with two 1 MΩ resistors. The ratio is unchanged, so the prediction is still half the supply — about 1.65 V. Measure with the multimeter and with the ESP32.',
          "Both will likely disagree with the prediction. A divider behaves like a voltage source with an internal resistance of R1 ∥ R2 = 500 kΩ. A typical multimeter's own 10 MΩ input resistance (check your meter's manual) pulls the node down to about 1.65 × 10 / (10 + 0.5) ≈ 1.57 V. The ESP32's ADC briefly draws current to charge its sampling capacitor, so its reading shifts and gets noisier.",
          'Optional: if your kit has a 100 nF ceramic capacitor, put it from the node to GND and watch the ESP32 reading steady — the capacitor supplies the ADC\'s brief sampling current.',
        ],
        checkpoint: 'You can explain, with the 500 kΩ source-resistance idea, why a sensor with a high output resistance reads differently depending on what it is connected to.',
      },
    ],
    experiments: [
      'Plot the ESP32 error against the true voltage from your step 8 table. Is the error a constant offset, a gain (slope) error, or a curve?',
      'Leave the voltmeter running for 10 minutes. Does the reading drift as the board warms up?',
      'Measure the same divider with SAMPLES = 64 but without the delay(2). Does sampling faster change the noise?',
    ],
    reflection: [
      'In step 8, which instrument was "right" — the ESP32 or the multimeter — and how could you decide without a third instrument?',
      'Why does averaging 64 samples reduce noise by about 8×, not 64×?',
      "The ADC reports 0–4095 over roughly 3.1 V. What is its resolution in millivolts per count? How does that connect to the Encoders lesson's quantization error?",
      'In step 10, why did the reading change when the resistances grew, even though the ratio R2 / (R1 + R2) stayed the same?',
    ],
    extensions: [
      'Calibrate: fit a straight line (gain and offset) through your step 8 data, apply it in code, and measure how much the error shrinks.',
      "Use one of the ESP32's capacitive touch pins with touchRead() as a 'hold' button that freezes the displayed reading.",
      'If your kit has a potentiometer, wire it as an adjustable divider and watch the reading in the Serial Plotter as you turn it.',
      "Serve the readings on a small web page over the ESP32's WiFi.",
    ],
  },

  {
    id: 'light-seeking-head',
    title: 'Project 2: A Light-Seeking Robot Head (Closed-Loop Control)',
    summary:
      'Build a one-joint robot that turns to face the brightest light, using two light sensors as its eyes, a servo as its neck, and a feedback controller you write and tune yourself. It is a complete sense–think–act loop you can hold in your hand: a physical version of the Feedback Control lab, running on real, noisy hardware.',
    duration: '4–6 hours',
    difficulty: 'Beginner–intermediate — do Project 1 first',
    prerequisites: ['what-is-a-robot', 'voltage-current-resistance', 'pwm-control', 'feedback-control'],
    goals: [
      'Build a directional light sensor from two voltage dividers and a shadow fin.',
      'Drive a hobby servo with PWM from the ESP32, and power it safely.',
      'Write a closed-loop controller in embedded C++.',
      'Tune the gain on real hardware and observe sluggish, good, and oscillating behavior.',
      'Deal with real-world imperfections: mismatched sensors, noise, and a deadband.',
    ],
    parts: [
      { name: 'ESP32 development board, OLED, breadboard', quantity: '1 each', source: 'owned', note: 'The same setup as Project 1' },
      { name: 'Male–male jumper wires', quantity: '~12', source: 'owned' },
      { name: 'Female–male jumper wires', quantity: '4', source: 'owned', note: 'Flexible leads from the moving sensors to the breadboard' },
      { name: '10 kΩ resistors', quantity: '2', source: 'owned' },
      { name: 'SG90-type micro servo', quantity: '1', source: 'kit', note: 'Check that your Arduino kit includes one' },
      { name: 'Photoresistors (LDRs)', quantity: '2', source: 'kit', note: 'If you have several, pick the two that measure most alike in step 2' },
      {
        name: '100 µF electrolytic capacitor (10 V or higher)',
        quantity: '1',
        source: 'kit',
        note: 'Optional but recommended: steadies the servo supply',
      },
      { name: 'Scrap cardboard and tape', quantity: '—', source: 'extra', note: 'For the head and the shadow fin' },
      { name: 'Flashlight or phone torch', quantity: '1', source: 'extra' },
      { name: 'USB data cable', quantity: '1', source: 'extra', note: 'Same as Project 1' },
    ],
    tools: ['AN870 multimeter', 'Plato 170 flush cutter', 'A computer with Arduino IDE 2'],
    safety: [
      "Power the servo only from the ESP32's VIN pin (5 V from USB) — never from 3V3. Never connect VIN or 5 V to any GPIO pin.",
      'A moving or stalled servo can draw several hundred milliamps and briefly dip the USB voltage, which may reset the ESP32. That is an annoyance, not a hazard; the capacitor in step 3 reduces it. Stick to USB power for this project. If you later use a separate servo supply, keep it at 4.8–6 V and connect its ground to the ESP32 ground.',
      'Electrolytic capacitors are polarized. The stripe on the body marks the negative leg, which goes to GND. Reversed, a capacitor can overheat or burst.',
      'Keep fingers clear of the servo horn while code is running; it can move suddenly when a sketch starts.',
      "Don't shine bright lights into anyone's eyes, and never use a laser pointer for this.",
      'Unplug USB before changing any wiring.',
    ],
    steps: [
      {
        id: 'identify',
        title: 'Identify your parts',
        body: [
          'An LDR is a small disk with a squiggly track on its face; its resistance falls as light increases. On the servo cable, brown (or black) is ground, red is +5 V, and orange (or yellow) is the control signal. On the capacitor, find the stripe that marks the negative leg.',
        ],
        checkpoint: 'You can point to each LDR, the three servo wires, and the capacitor\'s negative leg.',
      },
      {
        id: 'characterize',
        title: 'Characterize your light sensors',
        body: [
          'With the multimeter on resistance, measure each LDR in room light and again while covered with a finger. Write the values down, and pick the two LDRs that match best.',
          'Build two dividers: 3V3 → LDR → a node row → 10 kΩ → GND. More light lowers the LDR\'s resistance, so the node voltage rises with brightness. Connect the left node to GPIO34 and the right node to GPIO35.',
        ],
        wiring: [
          { from: 'ESP32 3V3', to: 'Left LDR leg A and right LDR leg A' },
          { from: 'Left LDR leg B', to: 'Left node row → 10 kΩ → GND' },
          { from: 'Right LDR leg B', to: 'Right node row → 10 kΩ → GND' },
          { from: 'Left node row', to: 'ESP32 GPIO34 (D34)' },
          { from: 'Right node row', to: 'ESP32 GPIO35 (D35)' },
        ],
        checkpoint: 'With the multimeter on DC volts, each node reads higher when its LDR is lit and lower when you cover it.',
      },
      {
        id: 'servo',
        title: 'Wire the servo safely and test it',
        body: [
          'Unplug USB. Push three male–male jumpers into the servo connector and wire them as shown. If you have the 100 µF capacitor, place it on the breadboard across the servo\'s power and ground, stripe to GND.',
          'In Library Manager, install "ESP32Servo". The Arduino Servo library does not support the ESP32. Upload the sweep sketch.',
          'This is the PWM lesson in action: a hobby servo reads a pulse every 20 ms (50 Hz), and the pulse width sets the angle — about 0.5 ms for 0° up to about 2.4 ms for 180°. The servo contains its own small feedback controller that drives its shaft to that angle.',
        ],
        wiring: [
          { from: 'Servo brown/black', to: 'ESP32 GND' },
          { from: 'Servo red', to: 'ESP32 VIN (5 V from USB)', note: 'Never 3V3' },
          { from: 'Servo orange/yellow', to: 'ESP32 GPIO18 (D18)' },
          { from: '100 µF capacitor', to: 'Across servo + and GND', note: 'Stripe (negative) to GND' },
        ],
        code: {
          language: 'Arduino C++',
          code: `#include <ESP32Servo.h>

Servo head;

void setup() {
  head.setPeriodHertz(50);          // a pulse every 20 ms
  head.attach(18, 500, 2400);       // pin, min and max pulse width in microseconds
}

void loop() {
  for (int angle = 0; angle <= 180; angle += 2) { head.write(angle); delay(15); }
  for (int angle = 180; angle >= 0; angle -= 2) { head.write(angle); delay(15); }
}`,
        },
        checkpoint:
          "The servo sweeps smoothly back and forth. If the ESP32 resets mid-sweep (the Serial Monitor shows boot messages or 'Brownout detector was triggered'), check the capacitor and try another USB port or cable. If the servo buzzes or strains at 0° or 180°, it is hitting its end stops: use a narrower range such as 10–170.",
      },
      {
        id: 'head',
        title: 'Build the head',
        body: [
          'Tape a small piece of cardboard to the servo horn. Mount the two LDRs on it facing forward, about 2 cm apart, with a cardboard fin about 3 cm tall between them. Light arriving from one side now shades the sensor on the far side of the fin — that shadow is what makes the pair directional.',
          'Plug the LDR legs into the female ends of the four female–male jumpers, and plug the male ends into the breadboard at the same places the LDRs were. Leave enough slack for the head to turn 180°.',
        ],
        checkpoint: 'With the servo parked at 90°, shining a torch from the left raises the left node voltage noticeably more than the right.',
      },
      {
        id: 'calibrate',
        title: 'Run the controller with the loop open, and calibrate',
        body: [
          'Upload the controller sketch with Kp = 0. With zero gain the loop is open: the robot senses and computes an error, but never acts. Use this to check your sensors before letting the servo move.',
          'Place the torch straight in front of the head, about 30 cm away, and read the error on the OLED. Because no two LDRs are identical, it will not be exactly zero. Set offset to that value and upload again.',
          'Then shine the light from the left side and note the sign of the error.',
        ],
        code: {
          language: 'Arduino C++',
          code: `#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ESP32Servo.h>

const int LEFT_PIN = 34;
const int RIGHT_PIN = 35;
const int SERVO_PIN = 18;

float Kp = 0.0;        // start at 0 (open loop), then try 0.005
int offset = 0;        // mV: set so error is ~0 with the light straight ahead
int deadband = 40;     // mV: ignore differences smaller than sensor noise
float angle = 90;      // current head angle command, in degrees

Adafruit_SSD1306 display(128, 64, &Wire, -1);
Servo head;

int readAvg(int pin) {
  long sum = 0;
  for (int i = 0; i < 16; i++) sum += analogReadMilliVolts(pin);
  return sum / 16;
}

void setup() {
  Serial.begin(115200);
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.setTextColor(SSD1306_WHITE);
  head.setPeriodHertz(50);
  head.attach(SERVO_PIN, 500, 2400);
  head.write((int)angle);
}

void loop() {
  int left = readAvg(LEFT_PIN);                  // SENSE
  int right = readAvg(RIGHT_PIN);
  int error = left - right - offset;             // THINK

  if (abs(error) > deadband) {
    angle = constrain(angle + Kp * error, 0.0f, 180.0f);
    head.write((int)angle);                      // ACT
  }

  display.clearDisplay();
  display.setCursor(0, 0);
  display.printf("L:%4d  R:%4d mV\\n", left, right);
  display.printf("error: %d mV\\n", error);
  display.printf("angle: %.0f deg\\n", angle);
  display.printf("Kp: %.3f", Kp);
  display.display();

  Serial.printf("error:%d,angle:%.1f\\n", error, angle);
  delay(20);
}`,
        },
        checkpoint: 'With the light straight ahead, the error hovers near 0. With the light from one side, it is clearly positive or negative, well beyond the 40 mV deadband.',
      },
      {
        id: 'close-loop',
        title: 'Close the loop',
        body: [
          'Set Kp = 0.005 and upload. Shine the torch from one side: the head should turn toward it. If it turns away, the sign is reversed — make Kp negative (−0.005), or swap the two sensor wires.',
          "Notice that the controller adds a correction to the angle on every loop rather than setting the angle directly. The head keeps turning as long as there's an error, and only stops when the error is (almost) zero. That's why this loop leaves no steady aiming error, unlike the pure proportional controller in the Feedback Control lab.",
          'The same accumulation is why too much gain oscillates: each correction is applied before the servo has finished responding to the previous one.',
        ],
        checkpoint: 'The head settles facing the light within a second or two, and follows it as you move it slowly.',
      },
      {
        id: 'tune',
        title: 'Tune the gain and the deadband',
        body: [
          'Open the Serial Plotter to watch error and angle. Try Kp = 0.001, 0.005, 0.02, and 0.05 (with the sign you found in the last step). Move the torch to the same starting spot each time and compare the responses.',
          'Then set deadband to 0 and watch what happens with the light held still. Find the smallest deadband that stops the jitter.',
        ],
        checkpoint:
          'You can name a Kp that is too slow, one that overshoots and "hunts" back and forth, and one that is good — and explain each using the Feedback Control lesson.',
      },
    ],
    experiments: [
      'Move the torch slowly in an arc around the head. How far behind the light does the head lag at each Kp?',
      'Remove the cardboard fin. Does the head still track? Why does shadowing matter for directional sensing?',
      'Set offset back to 0 and see where the head points when the light is straight ahead. That aiming error comes purely from sensor mismatch.',
      'Try tracking in dim light, then in bright light. An LDR\'s sensitivity changes with brightness, so the effective loop gain does too. Does the behavior change?',
    ],
    reflection: [
      'Map each line of loop() onto the sense–think–act diagram from the first lesson.',
      'There are two feedback loops in this robot. Where is the second one hiding? (Hint: how does the servo know when it has reached the commanded angle?)',
      'Why can this loop point exactly at the light, when the proportional controller in the Feedback Control lab could leave a steady error?',
      'What limits how high you can raise Kp before oscillation starts? How would a derivative (D) term help?',
    ],
    extensions: [
      'Add a second servo for tilt and a second pair of LDRs above and below, and track in 2D (a pan-tilt sun tracker).',
      'Replace the update with a full PI or PID controller and compare step responses in the Serial Plotter.',
      'If your kit has an HC-SR04 ultrasonic sensor, mount it on the head and turn the project into a scanning "radar" that draws distances on the OLED.',
      'Log error and angle over WiFi and record the step response when you switch a lamp on.',
    ],
  },
];
