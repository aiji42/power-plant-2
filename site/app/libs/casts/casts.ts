import { parse } from "node-html-parser";
import { countByCast } from "~/libs/prisma/product.server";

type Cast = {
  name: string;
  productCount: number;
};

export type Casts = Cast[];

export const searchCasts = async (s: string): Promise<Casts> => {
  const [castsA, castsB, castsC] = await Promise.all([
    searchCastsFromA(s),
    searchCastsFromB(s),
    searchCastsFromC(s),
  ]);
  const casts = mergeCasts(mergeCasts(castsA, castsB), castsC);
  return await Promise.all(
    casts.map(async (name) => ({
      name,
      productCount: await countByCast(name),
    }))
  );
};

const mergeCasts = (casts1: string[], casts2: string[]): string[] => {
  const casts1Names = casts1.map((name) => name);
  return [...casts1, ...casts2.filter((name) => !casts1Names.includes(name))];
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

const searchCastsFromA = async (s: string): Promise<string[]> => {
  const [url] = searchCastUrls(s);
  const res = await fetch(url);
  const html = await res.text();
  const root = parse(html);
  return root
    .querySelectorAll("div.actress-name .mlink")
    .map<string>((el) => el.innerText);
};

const searchCastsFromB = async (s: string): Promise<string[]> => {
  const [, url] = searchCastUrls(s);
  const res = await fetch(url);
  const html = await res.text();
  const root = parse(html);
  return root
    .querySelectorAll(".actress-name a")
    .map<string>((el) => el.innerText)
    .filter((name) => name !== "(≥o≤)");
};

const searchCastsFromC = async (s: string): Promise<string[]> => {
  const [, , url] = searchCastUrls(s);
  const res = await fetch(url);
  const html = await res.text();
  const root = parse(html);
  return root.querySelectorAll("a.actress").map<string>((el) => el.innerText);
};

type Result = {
  actress: Array<{
    id: number;
    name: string;
    ruby: string;
    imageURL?: {
      small: string;
      large: string;
    };
  }>;
};

export const searchFromFan = async (
  s: string
): Promise<Result["actress"][number] | null> => {
  const url = new URL(`${process.env.FAN_API_CAST_ENDPOINT}`);
  url.searchParams.set("api_id", process.env.FAN_API_ID!);
  url.searchParams.set("affiliate_id", process.env.FAN_AFF_ID!);
  url.searchParams.set("keyword", s);

  const res: { result: Result } = await fetch(url).then((res) => res.json());

  return res.result.actress[0];
};
