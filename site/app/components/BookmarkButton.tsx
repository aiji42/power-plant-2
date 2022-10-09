import { useFetcher } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/node";
import { loader as bookmarkLoader } from "~/routes/__authed/api/bookmark.$code";
import { useEffect } from "react";
import { route } from "routes-gen";
import { BiBookmark } from "react-icons/bi";
import { Icon } from "@chakra-ui/react";

export const BookmarkButton = ({ code }: { code: string }) => {
  const bookmarkFetcher = useFetcher<SerializeFrom<typeof bookmarkLoader>>();

  useEffect(() => {
    bookmarkFetcher.load(route("/api/bookmark/:code", { code }));
  }, [code, bookmarkFetcher.load]);

  const onClick = () => {
    if (bookmarkFetcher.state !== "idle") return;

    bookmarkFetcher.submit(null, {
      action: route("/api/bookmark/:code", { code }),
      method: "post",
    });
  };

  const isBookmarked =
    bookmarkFetcher.state === "submitting"
      ? !bookmarkFetcher.data?.isBookmarked
      : !!bookmarkFetcher.data?.isBookmarked;

  return (
    <Icon
      as={BiBookmark}
      boxSize={8}
      color={isBookmarked ? "teal.300" : undefined}
      onClick={onClick}
    />
  );
};
