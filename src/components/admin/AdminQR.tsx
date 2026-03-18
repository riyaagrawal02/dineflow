import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminQR = () => {
  const [tableCount, setTableCount] = useState(8);
  const baseUrl = window.location.origin;
  const tables = Array.from({ length: tableCount }, (_, i) => i + 1);

  const downloadQR = (tableNum: number) => {
    const svg = document.getElementById(`qr-${tableNum}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const a = document.createElement("a");
      a.download = `table-${tableNum}-qr.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const downloadAll = () => {
    tables.forEach((num) => setTimeout(() => downloadQR(num), num * 300));
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <span className="font-heading text-sm font-medium text-muted-foreground">Number of tables:</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setTableCount((c) => Math.max(1, c - 1))}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-heading font-semibold text-foreground">{tableCount}</span>
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setTableCount((c) => Math.min(50, c + 1))}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="secondary" className="rounded-xl" onClick={downloadAll}>
          <Download className="mr-2 h-4 w-4" /> Download All
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {tables.map((num) => (
          <div key={num} className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 shadow-card">
            <p className="font-heading text-lg font-semibold text-card-foreground">Table {num}</p>
            <div className="mt-4 rounded-xl bg-background p-4">
              <QRCodeSVG
                id={`qr-${num}`}
                value={`${baseUrl}/menu?table=${num}`}
                size={160}
                level="H"
                fgColor="hsl(210, 30%, 24%)"
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground break-all text-center">/menu?table={num}</p>
            <button
              onClick={() => downloadQR(num)}
              className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminQR;
