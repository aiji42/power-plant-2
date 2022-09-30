import { Product } from "~/libs/poduct/product";
import { HTMLElement, parse } from "node-html-parser";
import chunk from "chunk";

const headers = {
  Cookie: "adc=1",
  "User-Agent": process.env.MGS_UA!,
};

export const productFromMGS = async (code: string): Promise<Product> => {
  const url = new URL(
    `${process.env.MGS_HOST}/product/product_detail/${code}/`
  );
  const html = await fetch(url, { headers }).then((res) => res.text());
  const root = parse(html);
  const infoItems = chunk(
    (root.querySelector(".info dl")?.childNodes ?? []).filter(
      (node) =>
        node instanceof HTMLElement && ["dd", "dt"].includes(node.rawTagName)
    )
  );
  const info = infoItems.reduce<Product>(
    (res, [key, value]) => {
      if (key.innerText === "出演")
        return {
          ...res,
          cast: value.childNodes
            .map((n) => n.innerText)
            .filter((s) => !s.includes("\n")),
        };
      if (key.innerText === "ジャンル")
        return {
          ...res,
          genres: value.childNodes
            .map((n) => n.innerText)
            .filter((s) => !s.includes("\n")),
        };
      if (key.innerText === "収録時間")
        return { ...res, length: parseInt(value.childNodes[0].innerText) };
      if (key.innerText === "配信開始日")
        return { ...res, releasedAt: value.childNodes[0].innerText };
      if (key.innerText === "品番")
        return { ...res, code: value.childNodes[0].innerText };
      if (key.innerText === "シリーズ")
        return { ...res, series: value.childNodes[0].innerText };
      if (key.innerText === "メーカー")
        return { ...res, maker: value.childNodes[0].innerText };
      if (key.innerText === "レーベル")
        return { ...res, label: value.childNodes[0].innerText };
      return res;
    },
    { imageUrls: [], title: "", sample: "", code: "", releasedAt: "" }
  );
  info.title =
    root.querySelector("title")?.innerText.match(/「(.+)」/)?.[1] ?? "";
  info.imageUrls = root
    .querySelectorAll(".sample-image-wrap > img")
    .map((img) => img.getAttribute("src"))
    .filter((src): src is string => /\.jpg$/.test(src ?? ""));
  info.sample = root.querySelector("#sample-movie")?.getAttribute("src") ?? "";

  return info;
};
