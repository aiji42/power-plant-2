import { parse } from "node-html-parser";

export type SearchedResult = {
  title: string;
  link: string;
  size: string;
  registeredAt: string;
  seeder: string;
  leech: string;
  completed: string;
};

export const makeSearchUrl = (keyword: string) => {
  const url = new URL(process.env.TORRENT_SEARCH_ENDPOINT!);
  url.searchParams.append("q", keyword);
  url.searchParams.append("f", "0");
  url.searchParams.append("c", "0_0");
  return url;
};

export const searchLinks = async (
  keyword: string
): Promise<SearchedResult[]> => {
  const res = await fetch(makeSearchUrl(keyword));
  const html = await res.text();
  const root = parse(html);
  const trs = root.querySelectorAll("tr.default, tr.success");
  return trs
    .map((tr) => {
      return tr
        .querySelectorAll("td")
        .slice(1)
        .map((td) => {
          const a = td.querySelector("a");
          if (a) {
            const href = a.getAttribute("href");
            if (!href?.startsWith("/download")) return a.innerText;
            return href;
          }
          return td.innerText;
        });
    })
    .reduce<SearchedResult[]>(
      (res, [title, link, size, registeredAt, seeder, leech, completed]) => [
        ...res,
        {
          title,
          link: `${process.env.TORRENT_SEARCH_ENDPOINT}${link}`,
          size,
          registeredAt,
          seeder,
          leech,
          completed,
        },
      ],
      []
    );
};
