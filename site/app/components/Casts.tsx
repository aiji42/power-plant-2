import { Link, useFetcher } from "@remix-run/react";
import { loader as castsLoader } from "~/routes/__authed/api/casts.$code";
import { useEffect } from "react";
import { route } from "routes-gen";
import { Box, Skeleton, Tag, TagLabel, TagRightIcon } from "@chakra-ui/react";
import { BiCheck, BiPlus } from "react-icons/bi";
import { useBookmarkProvider } from "~/components/BookmarkProvider";

export const Casts = ({ code }: { code: string }) => {
  const castFetcher = useFetcher<typeof castsLoader>();
  useEffect(() => {
    castFetcher.load(route("/api/casts/:code", { code }));
  }, [castFetcher.load, code]);
  const { bookmark } = useBookmarkProvider();

  let casts =
    bookmark?.casts?.map(({ name, _count: { products: count } }) => ({
      name,
      count,
      connected: true,
    })) ?? [];
  casts = (castFetcher.data?.casts ?? []).reduce(
    (res, { name, productCount: count }) => {
      if (res.some((item) => item.name === name)) return res;
      return [...res, { name, count, connected: false }];
    },
    casts
  );

  return (
    <>
      {casts.length > 0 ? (
        <Box lineHeight={2.25}>
          {casts.map((cast) => (
            <CastButton key={cast.name} {...cast} />
          ))}
        </Box>
      ) : castFetcher.type !== "done" ? (
        <Skeleton borderRadius="full" height={8} />
      ) : null}
    </>
  );
};

const CastButton = ({
  name,
  count,
  connected,
}: {
  name: string;
  count?: number;
  connected: boolean;
}) => {
  const { bookmark, handlers, optimist } = useBookmarkProvider();

  return (
    <Tag
      size="lg"
      colorScheme="teal"
      borderRadius="full"
      mr={2}
      variant={connected ? "subtle" : "outline"}
    >
      <TagLabel>
        <Link to={route("/cast/:cast", { cast: name })}>
          {name}
          {count ? `(${count})` : null}
        </Link>
      </TagLabel>
      {bookmark && (
        <TagRightIcon
          as={connected ? BiCheck : BiPlus}
          onClick={() => {
            if (!optimist)
              connected
                ? handlers.disconnectCast(name)
                : handlers.connectCast(name);
          }}
        />
      )}
    </Tag>
  );
};
