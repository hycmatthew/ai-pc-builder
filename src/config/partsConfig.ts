interface ChipsetMapType {
  chipset: string
  cpuType: string[]
}

export const cpuChipsetMapping:ChipsetMapType[] = [
    // Intel LGA1700
    {
        chipset: "Z790",
        cpuType: ["i5 13600K", "i7 13700K", "i9 13900K", "i5 14600K", "i7 14700K", "i9 14900K"]
    },
    {
        chipset: "B760",
        cpuType: ["i5 13600", "i7 13700", "i5 14600", "i7 14700"]
    },
    {
        chipset: "H770",
        cpuType: ["i5 13600", "i7 13700", "i5 14600", "i7 14700"]
    },

    // AMD AM5
    {
        chipset: "X670E",
        cpuType: ["Ryzen 5 7600X", "Ryzen 7 7700X", "Ryzen 9 7900X", "Ryzen 9 7950X"]
    },
    {
        chipset: "B650",
        cpuType: ["Ryzen 5 7600X", "Ryzen 7 7700X", "Ryzen 9 7900X", "Ryzen 9 7950X"]
    },
    {
        chipset: "A620",
        cpuType: ["Ryzen 5 7600X", "Ryzen 7 7700X", "Ryzen 9 7900X", "Ryzen 9 7950X"]
    },
    {
        chipset: "X870",
        cpuType: ["Ryzen 5 7600X", "Ryzen 7 7700X", "Ryzen 9 7900X", "Ryzen 9 7950X"]
    },

    // AMD AM4
    {
        chipset: "X570",
        cpuType: ["Ryzen 5 5600X", "Ryzen 7 5800X", "Ryzen 9 5900X", "Ryzen 9 5950X"]
    },
    {
        chipset: "B550",
        cpuType: ["Ryzen 5 5600X", "Ryzen 7 5800X", "Ryzen 9 5900X", "Ryzen 5 3600", "Ryzen 7 3700X"]
    },
    {
        chipset: "A520",
        cpuType: ["Ryzen 5 5600X", "Ryzen 5 3600", "Ryzen 7 3700X"]
    }
];
