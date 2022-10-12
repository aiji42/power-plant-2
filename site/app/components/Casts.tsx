import { useFetcher } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/node";
import { loader as castsLoader } from "~/routes/__authed/api/casts.$code";
import { Fragment, useEffect } from "react";
import { route } from "routes-gen";
import {
  Box,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Tag,
  TagLabel,
  useDisclosure,
  Icon,
  Link,
  Flex,
  Spacer,
  Button,
} from "@chakra-ui/react";
import { FaSnowman, FaVial, FaPizzaSlice } from "react-icons/fa";
import { FocusLock } from "@chakra-ui/focus-lock";
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
  const { bookmark, isBookmarking, optimist, handlers } = useBookmarkProvider();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const connectedCast = bookmark?.casts.find(({ name }) => name === cast.name);
  const onClick = () => {
    connectedCast
      ? handlers.disconnectCast(cast.name)
      : handlers.connectCast(cast.name);
    onClose();
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom"
    >
      <PopoverTrigger>
        <Tag
          size="lg"
          colorScheme="red"
          borderRadius="full"
          mr={2}
          variant={connectedCast ? "subtle" : "outline"}
        >
          <TagLabel>
            {cast.name}
            {connectedCast
              ? `(${connectedCast._count.products})`
              : cast.productCount
              ? `(${cast.productCount})`
              : null}
          </TagLabel>
        </Tag>
      </PopoverTrigger>
      <PopoverContent p={4}>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          <Flex gap={5}>
            {cast.links.map((link, i) => (
              <Fragment key={link}>
                <Link
                  href={link}
                  display="block"
                  fontSize="2xl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon as={[FaSnowman, FaVial, FaPizzaSlice][i]} />
                </Link>{" "}
                <Spacer />
              </Fragment>
            ))}
            <Button
              onClick={onClick}
              disabled={!isBookmarking || optimist}
              mt={1}
            >
              {connectedCast ? "Disconnect" : "Connect"}
            </Button>
          </Flex>
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};
