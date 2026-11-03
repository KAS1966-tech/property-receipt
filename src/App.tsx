
import { useState } from "react";

import ReceiptForm from "./components/ReceiptForm";
import ReceiptPreview from "./components/ReceiptPreview";
import type { ReceiptFormData } from "./types/receipt";

export default function App() {
  const [receipt, setReceipt] = useState<ReceiptFormData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-50 px-3 py-6 sm:px-6 sm:py-10"
    >
      <div className="mx-auto max-w-3xl">
        {!showPreview && (
          <header className="mb-6 text-center">
            <p className="mb-2 text-sm font-semibold text-blue-700">
              ڈیجیٹل رسید بک
            </p>

            <h1 className="text-2xl font-extrabold leading-relaxed text-slate-900 sm:text-3xl">
              ماسٹر وثیقہ نویسی و اراضی سروسز
            </h1>

            <p className="mt-2 text-sm text-slate-600">
              رسید بنانے کے لیے تمام ضروری تفصیلات درج کریں
            </p>
          </header>
        )}

        <div className={showPreview ? "hidden" : "block"}>
          <ReceiptForm
            onGenerate={(data) => {
              setReceipt(data);
              setShowPreview(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>

        {showPreview && receipt && (
          <ReceiptPreview
            data={receipt}
            onBack={() => {
              setShowPreview(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </div>
    </main>
  );
}