
export interface ReceiptCharges {
    stampDuty: number;
    townCommittee: number;
    buyerFee236K: number;
    sellerFee236C: number;
    plra: number;
    fard: number;
    registration: number;
    miscellaneous: number;
    araziMuawin: number;
}

export interface ReceiptFormData {
    customerName: string;
    mouza: string;
    khewatNumber: string;
    murabbaNumber: string;
    killaNumber: string;
    propertyValue: number;
    date: string;
    receiptNumber: string;
    charges: ReceiptCharges;
}

export type ChargeKey = keyof ReceiptCharges;

export interface ChargeDefinition {
    key: ChargeKey;
    label: string;
    rate?: number;
    defaultAmount: number;
    editable: boolean;
}