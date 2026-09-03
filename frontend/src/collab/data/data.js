export const examConfig = {
  name: "SSC JE Civil",
  shortName: "SSC JE",
  stream: "Civil Engineering",
};

export const subjects = [
  { name: "Building Materials & Construction", progress: 72, color: "purple", icon: "BM", topics: 16 },
  { name: "Surveying", progress: 64, color: "blue", icon: "SV", topics: 14 },
  { name: "Soil Mechanics", progress: 48, color: "orange", icon: "SM", topics: 13 },
  { name: "Hydraulics & Irrigation", progress: 55, color: "cyan", icon: "HI", topics: 15 },
  { name: "RCC & Steel Structures", progress: 41, color: "red", icon: "RS", topics: 18 },
  { name: "Transportation Engineering", progress: 60, color: "green", icon: "TE", topics: 12 },
  { name: "Environmental Engineering", progress: 35, color: "purple", icon: "EE", topics: 11 },
  { name: "General Engineering & Mechanics", progress: 58, color: "blue", icon: "GE", topics: 10 },
];

export const topics = [
  ["Properties of Building Materials", 92],
  ["Cement & Concrete", 76],
  ["Surveying Instruments", 61],
  ["Levelling", 54],
  ["Soil Properties", 48],
  ["Shear Strength of Soil", 42],
  ["Open Channel Flow", 64],
  ["Irrigation Engineering", 55],
  ["RCC Design", 38],
  ["Highway Engineering", 70],
];

export const questions = [
  ["Which test is used to determine the consistency of cement?", "Easy", "Building Materials"],
  ["Calculate the reduced level using the height of instrument method.", "Medium", "Surveying"],
  ["Determine the void ratio from the given soil properties.", "Medium", "Soil Mechanics"],
  ["Find the discharge through a rectangular channel.", "Medium", "Hydraulics"],
  ["Calculate the design moment for a singly reinforced RCC beam.", "Hard", "RCC"],
  ["Determine stopping sight distance on a level road.", "Hard", "Transportation"],
  ["Find the BOD removal efficiency of a treatment unit.", "Medium", "Environmental"],
];
export const mockTestQuestions = [
  {
    id: 1,
    topic: "Surveying",
    subtopic: "Levelling",
    question:
      "The difference in elevation between two points is determined by which surveying operation?",
    options: [
      "Levelling",
      "Chain surveying",
      "Plane table surveying",
      "Triangulation",
    ],
    answer: 0,
    targetTime: 90,
  },

  {
    id: 2,
    topic: "Soil Mechanics",
    subtopic: "Soil Properties",
    question:
      "Which soil property represents the ratio of volume of voids to volume of solids?",
    options: [
      "Porosity",
      "Void ratio",
      "Degree of saturation",
      "Water content",
    ],
    answer: 1,
    targetTime: 90,
  },

  {
    id: 3,
    topic: "Building Materials",
    subtopic: "Cement",
    question:
      "The initial setting time of ordinary Portland cement is primarily associated with which process?",
    options: [
      "Hydration",
      "Carbonation",
      "Evaporation",
      "Oxidation",
    ],
    answer: 0,
    targetTime: 75,
  },

  {
    id: 4,
    topic: "Hydraulics",
    subtopic: "Open Channel Flow",
    question:
      "For uniform flow in an open channel, which condition remains constant along the channel?",
    options: [
      "Velocity only",
      "Depth only",
      "Velocity and depth",
      "Discharge only",
    ],
    answer: 2,
    targetTime: 90,
  },

  {
    id: 5,
    topic: "RCC & Steel",
    subtopic: "RCC Design",
    question:
      "In a singly reinforced RCC beam, the tensile reinforcement is mainly provided to resist:",
    options: [
      "Compression",
      "Tension",
      "Shear only",
      "Temperature effects only",
    ],
    answer: 1,
    targetTime: 120,
  },

  {
    id: 6,
    topic: "Transportation",
    subtopic: "Highway Engineering",
    question:
      "Stopping sight distance depends directly on which of the following?",
    options: [
      "Speed and reaction time",
      "Only pavement width",
      "Only lane width",
      "Only road gradient",
    ],
    answer: 0,
    targetTime: 90,
  },

  {
    id: 7,
    topic: "Environmental Engineering",
    subtopic: "Water Treatment",
    question: "BOD is primarily used as an indicator of:",
    options: [
      "Organic pollution",
      "Hardness",
      "Turbidity",
      "Chloride concentration",
    ],
    answer: 0,
    targetTime: 90,
  },

  {
    id: 8,
    topic: "Surveying",
    subtopic: "Theodolite",
    question: "A theodolite is primarily used for measuring:",
    options: [
      "Angles",
      "Discharge",
      "Soil density",
      "Concrete strength",
    ],
    answer: 0,
    targetTime: 100,
  },

  {
    id: 9,
    topic: "Soil Mechanics",
    subtopic: "Permeability",
    question: "Darcy's law is applicable to:",
    options: [
      "Laminar flow through soil",
      "Turbulent flow through soil",
      "Only open channel flow",
      "Only compressible fluids",
    ],
    answer: 0,
    targetTime: 100,
  },

  {
    id: 10,
    topic: "Transportation",
    subtopic: "Traffic Engineering",
    question:
      "The PCU concept is used to convert different vehicle types into:",
    options: [
      "Equivalent passenger cars",
      "Equivalent trucks",
      "Equivalent buses",
      "Equivalent axle loads",
    ],
    answer: 0,
    targetTime: 80,
  },
];

export const testConfig = {
  durationSeconds: 20 * 60,
  title: "SSC JE Civil Practice Test",
};