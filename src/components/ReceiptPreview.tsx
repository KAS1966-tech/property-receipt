import ReceiptActions from "./ReceiptActions";
import {
    ArrowRight,
    MapPin,
    ReceiptText,
} from "lucide-react";

import { shop } from "../config/shop";
import { CHARGE_DEFINITIONS, formatPKR } from "../lib/calculations";
import type { ReceiptFormData } from "../types/receipt";

interface ReceiptPreviewProps {
    data: ReceiptFormData;
    onBack: () => void;
}

function formatDate(date: string): string {
    if (!date) return "—";

    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
}

function displayValue(value: string): string {
    return value.trim() || "—";
}

export default function ReceiptPreview({
    data,
    onBack,
}: ReceiptPreviewProps) {
    const charges = data.charges;

    const total = Object.values(charges).reduce(
        (sum, amount) => sum + amount,
        0,
    );

    return (
        <section className="space-y-4">
            <button
                type="button"
                onClick={onBack}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
                <ArrowRight size={18} />
                واپس ترمیم کریں
            </button>

            {/* Export tools will be connected in the next step. */}
            <article
                id="receipt-preview"
                dir="rtl"
                className="receipt-urdu mx-auto w-full max-w-[720px] overflow-hidden border-4 border-double border-[#b99a51] bg-white p-3 text-slate-900 shadow-lg sm:p-6"
            >
                {/* Shop header */}
                <header className="border-b-2 border-[#b99a51] pb-4 text-center">
                    {shop.logo ? (
                        <img
                            src={shop.logo}
                            alt="دکان کا لوگو"
                            className="mx-auto mb-3 max-h-24 max-w-32 object-contain"
                        />
                    ) : (
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#b99a51] text-[#9a7932]">
                            <ReceiptText size={28} />
                        </div>
                    )}

                    <h1 className="text-xl font-extrabold leading-relaxed text-[#172b50] sm:text-3xl">
                        {shop.name}
                    </h1>

                    <p className="mt-1 text-base font-bold text-[#8a6827] sm:text-lg">
                        {shop.advisor}
                    </p>

                    <div className="mt-3 space-y-1 text-sm leading-6 sm:text-base">
                        <p>
                            رابطہ:{" "}
                            <span dir="ltr" className="inline-block font-semibold">
                                {shop.phone1}
                            </span>
                        </p>

                        <p>
                            {shop.contact2}:{" "}
                            <span dir="ltr" className="inline-block font-semibold">
                                {shop.phone2}
                            </span>
                        </p>

                        <p className="flex items-start justify-center gap-1">
                            <MapPin
                                size={17}
                                className="mt-1 shrink-0 text-[#8a6827]"
                            />
                            <span>{shop.address}</span>
                        </p>
                    </div>
                </header>

                {/* Receipt title and metadata */}
                <div className="my-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                        <h2 className="text-lg font-extrabold text-[#172b50] sm:text-xl">
                            رسید برائے اخراجات
                        </h2>
                        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                            جائیداد کی رجسٹری کے اخراجات
                        </p>
                    </div>

                    <div className="text-left text-xs leading-6 sm:text-sm">
                        <p>
                            رسید نمبر:{" "}
                            <span
                                dir="ltr"
                                className="inline-block font-bold tabular-nums"
                            >
                                {data.receiptNumber}
                            </span>
                        </p>
                        <p>
                            تاریخ:{" "}
                            <span dir="ltr" className="inline-block font-semibold">
                                {formatDate(data.date)}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Customer and property details */}
                <section className="mb-5">
                    <h3 className="mb-3 border-r-4 border-[#b99a51] bg-slate-50 px-3 py-2 font-bold text-[#172b50]">
                        کسٹمر اور اراضی کی تفصیل
                    </h3>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-1 text-sm sm:text-base">
                        <Detail label="کسٹمر کا نام" value={data.customerName} />
                        <Detail label="موضع" value={data.mouza} />
                        <Detail label="کھیوٹ نمبر" value={data.khewatNumber} />
                        <Detail label="مربع نمبر" value={data.murabbaNumber} />
                        <Detail label="کلہ نمبر" value={data.killaNumber} />

                        <div className="col-span-2 rounded-lg bg-[#f8f5ec] p-3">
                            <p className="text-xs text-slate-600 sm:text-sm">
                                کل مالیت برائے ٹرانزیکشن
                            </p>
                            <p
                                dir="ltr"
                                className="mt-1 text-left text-lg font-extrabold tabular-nums text-[#172b50] sm:text-xl"
                            >
                                Rs. {formatPKR(data.propertyValue)}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Charges table */}
                <section>
                    <h3 className="mb-2 border-r-4 border-[#b99a51] bg-slate-50 px-3 py-2 font-bold text-[#172b50]">
                        اخراجات کی تفصیل
                    </h3>

                    <table className="w-full table-fixed border-collapse text-sm sm:text-base">
                        <thead>
                            <tr className="bg-[#172b50] text-white">
                                <th className="w-[12%] border border-[#172b50] px-2 py-2 text-center">
                                    نمبر
                                </th>
                                <th className="w-[58%] border border-[#172b50] px-2 py-2 text-right">
                                    تفصیل
                                </th>
                                <th className="w-[30%] border border-[#172b50] px-2 py-2 text-left">
                                    رقم (روپے)
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {CHARGE_DEFINITIONS.map((definition, index) => (
                                <tr
                                    key={definition.key}
                                    className={
                                        index % 2 === 0 ? "bg-white" : "bg-slate-50"
                                    }
                                >
                                    <td className="border border-slate-200 px-2 py-2 text-center text-slate-500">
                                        {index + 1}
                                    </td>

                                    <td className="break-words border border-slate-200 px-2 py-2 font-medium leading-6">
                                        {definition.label}
                                    </td>

                                    <td
                                        dir="ltr"
                                        className="whitespace-nowrap border border-slate-200 px-2 py-2 text-left font-semibold tabular-nums"
                                    >
                                        {formatPKR(charges[definition.key])}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot>
                            <tr className="bg-[#172b50] font-extrabold text-white">
                                <td
                                    colSpan={2}
                                    className="border border-[#172b50] px-3 py-3 text-right text-base sm:text-lg"
                                >
                                    کل میزان
                                </td>

                                <td
                                    dir="ltr"
                                    className="whitespace-nowrap border border-[#172b50] px-2 py-3 text-left text-base tabular-nums sm:text-lg"
                                >
                                    {formatPKR(total)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </section>

                <footer className="mt-5 border-t border-[#b99a51] pt-3 text-center text-xs leading-6 text-slate-500 sm:text-sm">
                    <p>{shop.name}</p>
                    <p>آپ کے اعتماد کا شکریہ</p>
                </footer>
            </article>
            <ReceiptActions receiptElementId="receipt-preview" />
        </section>
    );
}

function Detail({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="min-w-0 border-b border-dashed border-slate-200 pb-2">
            <p className="text-xs text-slate-500 sm:text-sm">{label}</p>
            <p className="mt-1 break-words font-bold">
                {displayValue(value)}
            </p>
        </div>
    );
}
