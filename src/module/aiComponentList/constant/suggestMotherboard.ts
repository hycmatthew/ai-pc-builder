interface suggestMotherboardType {
  brand: 'asus' | 'msi' | 'gigabyte'
  name: string
}

const suggestIntelMotherboard: suggestMotherboardType[] = [
  {
    brand: 'asus',
    name: 'PRIME H610M-A D4',
  },
  {
    brand: 'msi',
    name: 'B760M Boober D4',
  },
  {
    brand: 'asus',
    name: 'TUF GAMING B760M-PLUS WIFI II',
  },
  {
    brand: 'msi',
    name: 'PRO Z790-A',
  },
]

const suggestAMDMotherboard: suggestMotherboardType[] = [
  {
    brand: 'asus',
    name: 'TUF GAMING B550M-PLUS',
  },
  {
    brand: 'asus',
    name: 'TUF GAMING A620M-PLUS',
  },
  {
    brand: 'asus',
    name: 'TUF GAMING B650M-PLUS',
  },
  {
    brand: 'asus',
    name: 'TUF GAMING X870-PLUS WIFI',
  },
]
