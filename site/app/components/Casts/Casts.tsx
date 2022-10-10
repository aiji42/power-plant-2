import { useFetcher } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/node";
import { loader as castsLoader } from "~/routes/__authed/api/casts.$code";
import { useEffect } from "react";
import { route } from "routes-gen";
import { Box, Skeleton, Tag, TagLabel } from "@chakra-ui/react";

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
          {castFetcher.data.casts.map((c) => (
            <Tag
              key={c.name}
              size="lg"
              colorScheme="red"
              borderRadius="full"
              mr={2}
            >
              <TagLabel>{c.name}</TagLabel>
            </Tag>
          ))}
        </Box>
      )}
    </>
  );
};
