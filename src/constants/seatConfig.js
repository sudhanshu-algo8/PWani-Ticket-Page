export const initialSectionsConfig = [
  {
    label: "A",
    seats: Array.from({ length: 26 }, (_, i) => {
      const num = i + 1;
      const isBlank = num >= 14 && num <= 16;
      return {
        id: `A${num.toString().padStart(2, "0")}`,
        selected: false,
        color: "",
        blank: isBlank,
      };
    }),
  },
  {
    label: "B",
    seats: Array.from({ length: 26 }, (_, i) => {
      const num = i + 1;
      const isBlank =
        (num >= 7 && num <= 9) ||
        (num >= 20 && num <= 21) ||
        (num >= 14 && num <= 16);
      return {
        id: `B${num.toString().padStart(2, "0")}`,
        selected: false,
        color: "",
        blank: isBlank,
      };
    }),
  },
  ...["C", "D", "E", "F", "G", "H", "I", "J"].map((label) => ({
    label,
    seats: Array.from({ length: 26 }, (_, i) => {
      const num = i + 1;
      const isBlank =
        (num >= 7 && num <= 9) ||
        (num >= 20 && num <= 21) ||
        (label === "J" && num >= 1 && num <= 4);
      return {
        id: `${label}${num.toString().padStart(2, "0")}`,
        selected: false,
        color: "",
        blank: isBlank,
      };
    }),
  })),
];