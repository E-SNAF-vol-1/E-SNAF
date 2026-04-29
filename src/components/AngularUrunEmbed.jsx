import { useEffect, useRef, useState } from "react";

export default function AngularUrunEmbed() {
  const hostRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAngularBuild() {
      try {
        const response = await fetch("/angular-urun/index.html", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Angular index.html bulunamadı.");
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const baseUrl = `${window.location.origin}/angular-urun/`;

        const links = Array.from(doc.querySelectorAll("link[rel='stylesheet']"));
        const scripts = Array.from(doc.querySelectorAll("script[src]"));

        links.forEach((link) => {
          const href = link.getAttribute("href");
          if (!href) return;

          const fullHref = new URL(href, baseUrl).href;

          const alreadyExists = document.querySelector(
            `link[data-angular-urun="true"][href="${fullHref}"]`
          );

          if (alreadyExists) return;

          const newLink = document.createElement("link");
          newLink.rel = "stylesheet";
          newLink.href = fullHref;
          newLink.dataset.angularUrun = "true";

          document.head.appendChild(newLink);
        });

        if (!hostRef.current || cancelled) return;

        hostRef.current.innerHTML = "<app-root></app-root>";

        for (const script of scripts) {
          const src = script.getAttribute("src");
          if (!src) continue;

          const fullSrc = new URL(src, baseUrl).href;

          const alreadyExists = document.querySelector(
            `script[data-angular-urun="true"][src="${fullSrc}"]`
          );

          if (alreadyExists) continue;

          await new Promise((resolve, reject) => {
            const newScript = document.createElement("script");
            newScript.src = fullSrc;
            newScript.type = script.getAttribute("type") || "module";
            newScript.dataset.angularUrun = "true";
            newScript.onload = resolve;
            newScript.onerror = reject;

            document.body.appendChild(newScript);
          });
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError("Ürün filtreleme alanı yüklenemedi.");
        }
      }
    }

    loadAngularBuild();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return <div ref={hostRef} className="w-full" />;
}