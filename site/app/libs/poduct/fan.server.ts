import { Product } from "~/libs/poduct/product";
import { productsSearchFromFAN } from "~/libs/products/fan.server";

export const productFromFAN = async (code: string): Promise<Product | null> => {
  const res = await productsSearchFromFAN({ cid: code });
  const [item] = res.items;
  if (!item) return null;

  return {
    title: item.title,
    imageUrls: [
      item.imageURL.large,
      ...(item.sampleImageURL?.sample_l.image ?? []),
    ],
    code: item.content_id,
    sample: (await sampleMovie(item.content_id)) ?? undefined,
    releasedAt: item.date,
    maker: item.iteminfo.maker[0].name,
    label: item.iteminfo.label[0].name,
    cast: item.iteminfo.actress?.map(({ name }) => name) ?? [],
    length: item.volume.includes(":")
      ? Number(new Date(`1970-01-01T${item.volume.padStart(8, "0")}Z`)) / 60000
      : Number(item.volume),
    genres: item.iteminfo.genre?.map(({ name }) => name) ?? [],
  };
};

const sampleMovie = async (cid: string) => {
  const res = await fetch(`${process.env.FAN_SAMPLE_ENDPOINT}${cid}`);
  const html = await res.text();
  const [, movie] = html.match(/"src":"(.+?\.mp4)","title"/) ?? [];
  if (!movie) return null;
  return `https:${movie.replace(/\\/g, "")}`;
};
