import {
  Box,
  BoxProps,
  Center,
  Icon,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  useDisclosure,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/node";
import { loader as torrentLoader } from "~/routes/__authed/api/torrent.$code";
import { useEffect } from "react";
import { route } from "routes-gen";
import { BiCheck, BiCloudDownload } from "react-icons/bi";
import { FocusLock } from "@chakra-ui/focus-lock";

export const TorrentPanel = ({
  code,
  ...props
}: { code: string } & BoxProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const torrentFetcher = useFetcher<SerializeFrom<typeof torrentLoader>>();
  useEffect(() => {
    isOpen &&
      torrentFetcher.type === "init" &&
      torrentFetcher.load(route("/api/torrent/:code", { code }));
  }, [torrentFetcher, code, isOpen]);

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Box {...props}>
          <Icon as={BiCloudDownload} boxSize={8} />
        </Box>
      </PopoverTrigger>
      <PopoverContent p={5}>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          <PopoverCloseButton />
          {torrentFetcher.state === "loading" && (
            <Center>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="teal.300"
                size="xl"
              />
            </Center>
          )}
          {torrentFetcher.data?.items.map((item) => (
            <Stat key={item.link} my={4}>
              <StatLabel noOfLines={2}>{item.title}</StatLabel>
              <StatHelpText>
                {item.registeredAt}
                <br />
                {item.size}
                <StatArrow type="increase" ml={2} />
                {item.seeder}
                <StatArrow type="decrease" ml={2} />
                {item.leech}
                <Icon as={BiCheck} ml={2} />
                {item.completed}
              </StatHelpText>
            </Stat>
          ))}
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};
