export interface CPUFilterType {
    brand: string
    model: string
    price: number
}

export interface GPUFilterType {
    brand: string
    manufacturer: string
    gpu: string
    model: string
    price: number
}

export interface MotherboardFilterType {
    brand: string
    model: string
    price: number
    size: string
    chipset: string
}

export interface RAMFilterType {
    brand: string
    model: string
    generation: string
    price: number
    size: string
}

export interface SSDFilterType {
    brand: string
    model: string
    price: number
    capacity: string
}

export interface PSUFilterType {
    brand: string
    model: string
    efficiency: string
    power: number
    price: number
    size: string
}

export interface CaseFilterType {
    brand: string
    model: string
    price: number
    size: string
}

export interface AIOFilterType {
    brand: string
    model: string
    price: number
    size: number
}

export interface AirCoolerFilterType {
    brand: string
    model: string
    price: number
}
