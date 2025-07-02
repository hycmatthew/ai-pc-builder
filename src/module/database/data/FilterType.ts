export interface CPUFilterType {
    brand: string
    id: string
    price: number
}

export interface GPUFilterType {
    brand: string
    manufacturer: string
    gpu: string
    id: string
    price: number
}

export interface MotherboardFilterType {
    brand: string
    id: string
    price: number
    size: string
    chipset: string
}

export interface RAMFilterType {
    brand: string
    id: string
    generation: string
    price: number
    size: string
}

export interface SSDFilterType {
    brand: string
    id: string
    price: number
    capacity: number
}

export interface PSUFilterType {
    brand: string
    id: string
    efficiency: string
    power: number
    price: number
    size: string
}

export interface CaseFilterType {
    brand: string
    id: string
    price: number
    size: string
}

export interface AIOFilterType {
    brand: string
    id: string
    price: number
    size: number
}

export interface AirCoolerFilterType {
    brand: string
    id: string
    price: number
}
