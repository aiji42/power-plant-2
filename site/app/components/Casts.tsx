import { useFetcher } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/node";
import { loader as castsLoader } from "~/routes/__authed/api/casts.$code";
import { useEffect } from "react";
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
          {castFetcher.data.casts.map((c) => (
            <CastButton key={c.name} {...c} />
          ))}
        </Box>
      )}
    </>
  );
};

const CastButton = ({ name, links }: { name: string; links: string[] }) => {
  const { bookmark, isBookmarking, optimist, handlers } = useBookmarkProvider();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const connected = !!bookmark?.casts.find((c) => c.name === name);
  const onClick = () => {
    connected ? handlers.disconnectCast(name) : handlers.connectCast(name);
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
          variant={connected ? "subtle" : "outline"}
        >
          <TagLabel>{name}</TagLabel>
        </Tag>
      </PopoverTrigger>
      <PopoverContent p={5}>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          <Flex gap={5}>
            {links.map((link, i) => (
              <Link
                href={link}
                key={link}
                display="block"
                fontSize="2xl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon as={[FaSnowman, FaVial, FaPizzaSlice][i]} />
              </Link>
            ))}
            <Spacer />
            <Button
              onClick={onClick}
              disabled={!isBookmarking || optimist}
              mt={1}
            >
              {connected ? "Disconnect" : "Connect"}
            </Button>
          </Flex>
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};
