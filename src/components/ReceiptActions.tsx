
import { useState } from "react";
import {
    FileImage,
    FileText,
} from "lucide-react";
import { toJpeg } from "html-to-image";
import { jsPDF } from "jspdf";

interface ReceiptActionsProps {
    receiptElementId?: string;
}

const EXPORT_WIDTH_MM = 190;
const EXPORT_MARGIN_MM = 10;

async function captureReceipt(
    elementId: string,
): Promise<{ dataUrl: string; width: number; height: number }> {
    const element = document.getElementById(elementId);

    if (!element) {
        throw new Error("Receipt preview not found.");
    }

    const dataUrl = await toJpeg(element, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
    });

    const image = new Image();
    image.src = dataUrl;

    await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(
            new Error("Could not prepare receipt image."),
        );
    });

    return {
        dataUrl,
        width: image.naturalWidth,
        height: image.naturalHeight,
    };
}

function downloadDataUrl(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function createPdf(
    dataUrl: string,
    pixelWidth: number,
    pixelHeight: number,
): jsPDF {
    const widthMm = EXPORT_WIDTH_MM;
    const heightMm = widthMm * (pixelHeight / pixelWidth);

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [widthMm, heightMm + EXPORT_MARGIN_MM * 2],
        compress: true,
    });

    pdf.addImage(
        dataUrl,
        "JPEG",
        0,
        EXPORT_MARGIN_MM,
        widthMm,
        heightMm,
        undefined,
        "FAST",
    );

    return pdf;
}

export default function ReceiptActions({
    receiptElementId = "receipt-preview",
}: ReceiptActionsProps) {
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");

    async function getReceiptImage() {
        return captureReceipt(receiptElementId);
    }

    async function handleJpegDownload() {
        setBusy(true);
        setMessage("");

        try {
            const { dataUrl } = await getReceiptImage();
            downloadDataUrl(dataUrl, "property-receipt.jpg");
            setMessage("رسید کی تصویر ڈاؤن لوڈ کے لیے تیار ہے۔");
        } catch (error) {
            console.error(error);
            setMessage("تصویر تیار نہیں ہو سکی۔ دوبارہ کوشش کریں۔");
        } finally {
            setBusy(false);
        }
    }

    async function handlePdfDownload() {
        setBusy(true);
        setMessage("");

        try {
            const { dataUrl, width, height } = await getReceiptImage();
            const pdf = createPdf(dataUrl, width, height);

            pdf.save("property-receipt.pdf");
            setMessage("PDF رسید تیار ہے۔");
        } catch (error) {
            console.error(error);
            setMessage("PDF تیار نہیں ہو سکی۔ دوبارہ کوشش کریں۔");
        } finally {
            setBusy(false);
        }
    }

    const buttonClass =
        "flex min-h-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50";

    return (
        <section className="space-y-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <button
                    type="button"
                    disabled={busy}
                    onClick={handleJpegDownload}
                    className={`${buttonClass} bg-blue-700 text-white hover:bg-blue-800`}
                >
                    <FileImage size={18} />
                    JPEG ڈاؤن لوڈ
                </button>

                <button
                    type="button"
                    disabled={busy}
                    onClick={handlePdfDownload}
                    className={`${buttonClass} bg-slate-800 text-white hover:bg-slate-900`}
                >
                    <FileText size={18} />
                    PDF ڈاؤن لوڈ
                </button>
            </div>

            {message && (
                <p
                    role="status"
                    aria-live="polite"
                    className="rounded-xl bg-slate-100 p-3 text-center text-sm text-slate-700"
                >
                    {message}
                </p>
            )}
        </section>
    );
}