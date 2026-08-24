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
