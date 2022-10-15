import { Link, useFetcher } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/node";
import { loader as castsLoader } from "~/routes/__authed/api/casts.$code";
import { useEffect } from "react";
import { route } from "routes-gen";
import { Box, Skeleton, Tag, TagLabel, TagRightIcon } from "@chakra-ui/react";
import { BiUnlink, BiLink } from "react-icons/bi";
import { useBookmarkProvider } from "~/components/BookmarkProvider";

export const Casts = ({ code }: { code: string }) => {
  const castFetcher = useFetcher<SerializeFrom<typeof castsLoader>>();
  useEffect(() => {
    castFetcher.load(route("/api/casts/:code", { code }));
  }, [castFetcher.load, code]);

  return (
    <>
      {castFetcher.type !== "done" && (
        <Skeleton borderRadius="full" height={8} />
      )}
      {castFetcher.type === "done" && castFetcher.data && (
        <Box lineHeight={2.25}>
          {castFetcher.data.casts.map((cast) => (
            <CastButton key={cast.name} cast={cast} />
          ))}
        </Box>
      )}
    </>
  );
};

const CastButton = ({
  cast,
}: {
  cast: SerializeFrom<typeof castsLoader>["casts"][number];
}) => {
  const { bookmark, handlers } = useBookmarkProvider();
  const connectedCast = bookmark?.casts.find(({ name }) => name === cast.name);

  return (
    <Tag
      size="lg"
      colorScheme="teal"
      borderRadius="full"
      mr={2}
      variant={connectedCast ? "subtle" : "outline"}
    >
      <TagLabel>
        <Link to={route("/cast/:cast", { cast: cast.name })}>
          {cast.name}
          {connectedCast
            ? `(${connectedCast._count.products})`
            : cast.productCount
            ? `(${cast.productCount})`
            : null}
        </Link>
      </TagLabel>
      <TagRightIcon
        as={connectedCast ? BiUnlink : BiLink}
        onClick={() =>
          connectedCast
            ? handlers.disconnectCast(cast.name)
            : handlers.connectCast(cast.name)
        }
      />
    </Tag>
  );
};
