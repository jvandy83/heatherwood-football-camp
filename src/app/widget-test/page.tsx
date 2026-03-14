import Script from "next/script";

export default function WidgetTestPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-4">
      <Script
        data-trailfunds-widget="true"
        data-widget-id="org-cmef9r9pt00027812m8yu8lq2"
        data-org-id="cmef9r9pt00027812m8yu8lq2"
        src="http://localhost:3000/embed-script.js"
        strategy="afterInteractive"
      />
    </main>
  );
}
