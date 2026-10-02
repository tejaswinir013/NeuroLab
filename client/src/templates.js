const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.round(min + Math.random() * (max - min));

export const templates = [
  {
    id: "stroop",
    icon: "🎨",
    name: "Stroop Test",
    measures: "Response inhibition / cognitive interference",
    title: "Stroop Test",
    description:
      "Name the INK colour, not the word. Press R for red, G for green, B for blue. Be fast and accurate.",
    randomize: true,
    params: [
      { key: "count", label: "Number of trials", value: 12 },
      { key: "fixation", label: "Fixation (ms)", value: 500 },
      { key: "duration", label: "Time limit (ms, 0 = none)", value: 0 },
    ],
    build: (p) => {
      const colors = [
        { name: "RED", hex: "#ff5c5c", key: "r" },
        { name: "GREEN", hex: "#3ddc84", key: "g" },
        { name: "BLUE", hex: "#5aa9ff", key: "b" },
      ];
      return Array.from({ length: p.count }, (_, i) => {
        const word = colors[i % 3];
        const ink = i % 2 === 0 ? word : pick(colors.filter((c) => c !== word)); // half congruent, half not
        return {
          kind: "keypress",
          stimulus: word.name,
          color: ink.hex,
          correctKey: ink.key,
          fixation: p.fixation,
          duration: p.duration,
        };
      });
    },
  },
  {
    id: "reaction",
    icon: "⚡",
    name: "Reaction Time Test",
    measures: "Response speed",
    title: "Reaction Time Test",
    description: "Wait for GO! to appear, then press SPACE as fast as you can.",
    randomize: false,
    params: [
      { key: "count", label: "Number of trials", value: 5 },
      { key: "minDelay", label: "Min wait (ms)", value: 1000 },
      { key: "maxDelay", label: "Max wait (ms)", value: 3000 },
      { key: "timeout", label: "Time limit (ms)", value: 2000 },
    ],
    build: (p) =>
      Array.from({ length: p.count }, () => ({
        kind: "keypress",
        stimulus: "GO!",
        color: "#3ddc84",
        correctKey: " ",
        fixation: rand(p.minDelay, p.maxDelay),
        duration: p.timeout,
      })),
  },
  {
    id: "memory",
    icon: "🧠",
    name: "Memory Recall",
    measures: "Short-term memory",
    title: "Memory Recall",
    description:
      "Digits will flash on screen. Remember them, then type them back in order and press Enter.",
    randomize: false,
    params: [
      { key: "rounds", label: "Number of rounds", value: 4 },
      { key: "startLength", label: "Starting length", value: 3 },
      { key: "msPerItem", label: "Show time per digit (ms)", value: 800 },
    ],
    build: (p) =>
      Array.from({ length: p.rounds }, (_, i) => {
        const len = p.startLength + i; // gets harder each round
        const digits = Array.from({ length: len }, () => rand(1, 9));
        return {
          kind: "recall",
          stimulus: digits.join(" "),
          color: "#ffffff",
          correctKey: "",
          fixation: 500,
          duration: len * p.msPerItem,
        };
      }),
  },
];