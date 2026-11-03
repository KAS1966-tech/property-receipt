
import { useMemo, useState } from "react";
import {
    CalendarDays,
    Calculator,
    FileText,
    MapPin,
    UserRound,
} from "lucide-react";

import { CHARGE_DEFINITIONS, calculateCharges, calculateTotal, formatPKR } from "../lib/calculations";
import { generateReceiptNumber, getLocalDate } from "../lib/receiptNumber";
import type { ReceiptFormData, ChargeKey } from "../types/receipt";

interface ReceiptFormProps {
    onGenerate: (data: ReceiptFormData) => void;
}

function createInitialForm(): ReceiptFormData {
    const propertyValue = 0;

    return {
        customerName: "",
        mouza: "",
        khewatNumber: "",
        murabbaNumber: "",
        killaNumber: "",
        propertyValue,
        date: getLocalDate(),
        receiptNumber: generateReceiptNumber(),
        charges: calculateCharges(propertyValue),
    };
}

function parseAmount(value: string): number {
    if (value.trim() === "") return 0;

    const amount = Number(value);

    return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}

export default function ReceiptForm({
    onGenerate,
}: ReceiptFormProps) {
    const [form, setForm] = useState<ReceiptFormData>(
        createInitialForm,
    );

    const charges = useMemo(
        () =>
            calculateCharges(form.propertyValue, form.charges),
        [form.propertyValue, form.charges],
    );

    const total = useMemo(
        () => calculateTotal(charges),
        [charges],
    );

    function updateField(
        field: keyof Omit<ReceiptFormData, "charges">,
        value: string | number,
    ) {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    }

    function updateCharge(key: ChargeKey, value: string) {
        const definition = CHARGE_DEFINITIONS.find(
            (item) => item.key === key,
        );

        if (!definition || definition.rate !== undefined) return;

        setForm((previous) => ({
            ...previous,
            charges: {
                ...previous.charges,
                [key]: parseAmount(value),
            },
        }));
    }

    function handleGenerate(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!form.customerName.trim()) {
            alert("براہ کرم کسٹمر کا نام درج کریں۔");
            return;
        }

        if (!form.mouza.trim()) {
            alert("براہ کرم موضع درج کریں۔");
            return;
        }

        if (form.propertyValue <= 0) {
            alert("براہ کرم کل مالیت درج کریں۔");
            return;
        }

        onGenerate({
            ...form,
            customerName: form.customerName.trim(),
            mouza: form.mouza.trim(),
            charges,
        });
    }

    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-right text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

    const labelClass =
        "mb-1.5 block text-sm font-semibold text-slate-700";

    return (
        <form
            onSubmit={handleGenerate}
            dir="rtl"
            className="space-y-5"
        >
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                        <UserRound size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            کسٹمر کی تفصیلات
                        </h2>
                        <p className="text-sm text-slate-500">
                            کسٹمر اور اراضی کی معلومات درج کریں
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>کسٹمر کا نام *</label>
                        <input
                            className={inputClass}
                            placeholder="کسٹمر کا مکمل نام"
                            value={form.customerName}
                            onChange={(e) =>
                                updateField("customerName", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className={labelClass}>موضع *</label>
                        <input
                            className={inputClass}
                            placeholder="موضع کا نام"
                            value={form.mouza}
                            onChange={(e) =>
                                updateField("mouza", e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>کھیوٹ نمبر</label>
                            <input
                                className={inputClass}
                                placeholder="کھیوٹ نمبر"
                                value={form.khewatNumber}
                                onChange={(e) =>
                                    updateField("khewatNumber", e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className={labelClass}>مربع نمبر</label>
                            <input
                                className={inputClass}
                                placeholder="مربع نمبر"
                                value={form.murabbaNumber}
                                onChange={(e) =>
                                    updateField("murabbaNumber", e.target.value)
                                }
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className={labelClass}>کلہ نمبر</label>
                            <input
                                className={inputClass}
                                placeholder="کلہ نمبر"
                                value={form.killaNumber}
                                onChange={(e) =>
                                    updateField("killaNumber", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-700">
                        <MapPin size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            مالیت اور تاریخ
                        </h2>
                        <p className="text-sm text-slate-500">
                            جائیداد کی کل مالیت درج کریں
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className={labelClass}>
                            کل مالیت فی مرلہ/کنال (روپے) *
                        </label>
                        <input
                            className={inputClass}
                            type="number"
                            min="1"
                            step="1"
                            inputMode="numeric"
                            placeholder="مثلاً 1000000"
                            value={form.propertyValue || ""}
                            onChange={(e) =>
                                updateField(
                                    "propertyValue",
                                    parseAmount(e.target.value),
                                )
                            }
                            required
                        />
                        <p className="mt-1.5 text-xs text-slate-500">
                            کل ٹرانزیکشن کی مالیت درج کریں، فی مرلہ کی الگ شرح نہیں۔
                        </p>
                    </div>

                    <div>
                        <label className={labelClass}>تاریخ *</label>
                        <div className="relative">
                            <CalendarDays
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                className={`${inputClass} text-left`}
                                type="date"
                                value={form.date}
                                onChange={(e) =>
                                    updateField("date", e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5 flex items-center gap-3">
                    <div className="rounded-xl bg-amber-50 p-2.5 text-amber-700">
                        <Calculator size={22} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            اخراجات کی تفصیل
                        </h2>
                        <p className="text-sm text-slate-500">
                            فیصد والے چارجز خودکار ہیں، دیگر رقم تبدیل کی جا سکتی ہے
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {CHARGE_DEFINITIONS.map((definition) => {
                        const isPercentage =
                            definition.rate !== undefined;

                        return (
                            <div
                                key={definition.key}
                                className="grid grid-cols-[minmax(0,1fr)_140px] items-center gap-3 border-b border-slate-100 pb-3 last:border-0"
                            >
                                <div>
                                    <label
                                        htmlFor={definition.key}
                                        className="text-sm font-semibold leading-5 text-slate-700"
                                    >
                                        {definition.label}
                                    </label>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {isPercentage
                                            ? "خودکار حساب"
                                            : "قابلِ ترمیم"}
                                    </p>
                                </div>

                                <input
                                    id={definition.key}
                                    className={`${inputClass} px-2 text-left tabular-nums`}
                                    type="number"
                                    min="0"
                                    step="1"
                                    inputMode="numeric"
                                    value={charges[definition.key]}
                                    readOnly={isPercentage}
                                    onChange={(e) =>
                                        updateCharge(
                                            definition.key,
                                            e.target.value,
                                        )
                                    }
                                    aria-label={definition.label}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="mt-5 rounded-xl bg-slate-900 p-4 text-white">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-base font-semibold">
                            کل میزان
                        </span>
                        <span className="text-xl font-extrabold tabular-nums">
                            Rs. {formatPKR(total)}
                        </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">
                        تمام چارجز کا مجموعہ
                    </p>
                </div>
            </section>

            <button
                type="submit"
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-4 font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-800 active:scale-[0.99]"
            >
                <FileText size={20} />
                رسید تیار کریں
            </button>
        </form>
    );
}