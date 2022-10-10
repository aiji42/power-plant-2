import { parse } from "node-html-parser";

type Cast = {
  link: string;
  name: string;
};

export type Casts = Cast[];

export const searchCasts = async (s: string): Promise<Casts> => {
  const [castsA, castsB, castsC] = await Promise.all([
    searchCastsFromA(s),
    searchCastsFromB(s),
    searchCastsFromC(s),
  ]);
  return mergeCasts(mergeCasts(castsA, castsB), castsC);
};

const mergeCasts = (casts1: Casts, casts2: Casts): Casts => {
  const casts1Names = casts1.map(({ name }) => name);
  return [
    ...casts1,
    ...casts2.filter(({ name }) => !casts1Names.includes(name)),
  ];
};

export const searchCastUrls = (s: string): [URL, URL, URL] => {
  const urlA = new URL(process.env.CAST_SEARCH_ENDPOINT_A!);
  urlA.searchParams.set("s", s);
  const urlB = new URL(process.env.CAST_SEARCH_ENDPOINT_B!);
  urlB.searchParams.set("s", s);
  const urlC = new URL(process.env.CAST_SEARCH_ENDPOINT_C!);
  urlC.searchParams.set("s", s);

  return [urlA, urlB, urlC];
};

const searchCastsFromA = async (s: string): Promise<Casts> => {
  const [url] = searchCastUrls(s);
  const res = await fetch(url);
  const html = await res.text();
  const root = parse(html);
  return root.querySelectorAll("div.actress-name .mlink").map<Cast>((el) => ({
    link: el.getAttribute("href") ?? "",
    name: el.innerText,
  }));
};

const searchCastsFromB = async (s: string): Promise<Casts> => {
  const [, url] = searchCastUrls(s);
  const res = await fetch(url);
  const html = await res.text();
  const root = parse(html);
  return root
    .querySelectorAll(".actress-name a")
    .map<Cast>((el) => ({
      link: el.getAttribute("href") ?? "",
      name: el.innerText,
    }))
    .filter(({ name }) => name !== "(≥o≤)");
};

const searchCastsFromC = async (s: string): Promise<Casts> => {
  const [, , url] = searchCastUrls(s);
  const res = await fetch(url);
  const html = await res.text();
  const root = parse(html);
  return root.querySelectorAll("a.actress").map<Cast>((el) => ({
    link: el.getAttribute("href") ?? "",
    name: el.innerText,
  }));
};
