
import type {
    ChargeDefinition,
    ChargeKey,
    ReceiptCharges,
} from "../types/receipt";

export const CHARGE_DEFINITIONS: ChargeDefinition[] = [
    {
        key: "stampDuty",
        label: "سٹیمپ ڈیوٹی (1%)",
        rate: 0.01,
        defaultAmount: 0,
        editable: false,
    },
    {
        key: "townCommittee",
        label: "بلدیہ (1%)",
        rate: 0.01,
        defaultAmount: 0,
        editable: false,
    },
    {
        key: "buyerFee236K",
        label: "خریدار فیس 236K (1.25%)",
        rate: 0.0125,
        defaultAmount: 0,
        editable: false,
    },
    {
        key: "sellerFee236C",
        label: "فروخت کنندہ فیس 236C (2.75%)",
        rate: 0.0275,
        defaultAmount: 0,
        editable: false,
    },
    {
        key: "plra",
        label: "PLRA چارجز",
        defaultAmount: 3600,
        editable: true,
    },
    {
        key: "fard",
        label: "فرد فیس",
        defaultAmount: 5150,
        editable: true,
    },
    {
        key: "registration",
        label: "رجسٹریشن چارجز",
        defaultAmount: 1000,
        editable: true,
    },
    {
        key: "miscellaneous",
        label: "متفرق اخراجات",
        defaultAmount: 800,
        editable: true,
    },
    {
        key: "araziMuawin",
        label: "اراضی معاون چارجز",
        defaultAmount: 5000,
        editable: true,
    },
];

export function calculateCharges(
    propertyValue: number,
    overrides: Partial<ReceiptCharges> = {},
): ReceiptCharges {
    const value = Math.max(0, propertyValue || 0);

    const charges = {} as ReceiptCharges;

    for (const definition of CHARGE_DEFINITIONS) {
        const override = overrides[definition.key];

        if (definition.rate !== undefined) {
            charges[definition.key] = Math.round(
                value * definition.rate,
            );
        } else {
            charges[definition.key] =
                override ?? definition.defaultAmount;
        }
    }

    return charges;
}

export function calculateTotal(
    charges: ReceiptCharges,
): number {
    return Object.values(charges).reduce(
        (total, amount) => total + amount,
        0,
    );
}

export function formatPKR(amount: number): string {
    return new Intl.NumberFormat("en-PK", {
        maximumFractionDigits: 0,
    }).format(amount);
}

export function getChargeAmount(
    key: ChargeKey,
    propertyValue: number,
    charges: ReceiptCharges,
): number {
    const definition = CHARGE_DEFINITIONS.find(
        (item) => item.key === key,
    );

    if (!definition) return 0;

    if (definition.rate !== undefined) {
        return Math.round(
            Math.max(0, propertyValue || 0) * definition.rate,
        );
    }

    return charges[key];
}