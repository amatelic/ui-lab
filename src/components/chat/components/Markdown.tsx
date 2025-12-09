import { useEffect, useState } from "react";
import { Marp } from "@marp-team/marp-core";

export const MarpMarkdown = ({ markdown }: { markdown: string }) => {
  const [slideHtml, setSlideHtml] = useState("");
  const [slideCss, setSlideCss] = useState("");

  useEffect(() => {
    const marp = new Marp({
      html: true,
      math: "katex",
      minifyCSS: true,
      markdown: {
        breaks: true,
      },
    });

    const metadata = `
       ${markdown}
      `;

    const { html, css } = marp.render(metadata || "# Hello, marp-core!");
    setSlideHtml(html);
    setSlideCss(css);
  }, [markdown]);

  return (
    <div className="marp-slide-container">
      <style>{slideCss}</style>
      <div dangerouslySetInnerHTML={{ __html: slideHtml }} />
    </div>
  );
};
