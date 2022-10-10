import {
  Box,
  BoxProps,
  Center,
  Icon,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Text,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/node";
import { loader as torrentLoader } from "~/routes/__authed/api/torrent.$code";
import { ReactNode, useEffect, useRef } from "react";
import { route } from "routes-gen";
import {
  BiCheck,
  BiCloudDownload,
  BiData,
  BiCalendarAlt,
} from "react-icons/bi";
import { FocusLock } from "@chakra-ui/focus-lock";
import { loader as bookmarkLoader } from "~/routes/__authed/api/bookmark.$code";

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

  const bookmarkFetcher = useFetcher<SerializeFrom<typeof bookmarkLoader>>();
  useEffect(() => {
    isOpen && bookmarkFetcher.load(route("/api/bookmark/:code", { code }));
  }, [code, bookmarkFetcher.load, isOpen]);

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom"
    >
      <PopoverTrigger>
        <Box {...props}>
          <Icon as={BiCloudDownload} boxSize={8} />
        </Box>
      </PopoverTrigger>
      <PopoverContent p={5}>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
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
            <DownloadConfirm
              key={item.link}
              item={item}
              code={code}
              isActive={!!bookmarkFetcher.data?.isBookmarked}
            >
              <Stat my={4}>
                <StatLabel noOfLines={2}>{item.title}</StatLabel>
                <StatHelpText>
                  <Icon as={BiCalendarAlt} />
                  {item.registeredAt}
                  <br />
                  <Icon as={BiData} />
                  {item.size}
                  <StatArrow type="increase" ml={2} />
                  {item.seeder}
                  <StatArrow type="decrease" ml={2} />
                  {item.leech}
                  <Icon as={BiCheck} ml={2} />
                  {item.completed}
                </StatHelpText>
              </Stat>
            </DownloadConfirm>
          ))}
          {torrentFetcher.data && torrentFetcher.data.items.length < 1 && (
            <Text>No data</Text>
          )}
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};

const DownloadConfirm = ({
  children,
  code,
  isActive,
  item,
}: {
  children: ReactNode;
  code: string;
  isActive: boolean;
  item: SerializeFrom<typeof torrentLoader>["items"][number];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any>(null);

  const fetcher = useFetcher();
  const submit = () => {
    fetcher.submit(
      { url: item.link },
      { action: route("/api/download-task/:code", { code }), method: "post" }
    );
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen}>{children}</Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {isActive ? "Download Confirm" : "Please bookmark it first"}
            </AlertDialogHeader>

            {isActive && (
              <AlertDialogBody>
                <Stat>
                  <StatLabel>{item.title}</StatLabel>
                  <StatHelpText>
                    <Icon as={BiCalendarAlt} />
                    {item.registeredAt}
                    <br />
                    <Icon as={BiData} />
                    {item.size}
                    <StatArrow type="increase" ml={2} />
                    {item.seeder}
                    <StatArrow type="decrease" ml={2} />
                    {item.leech}
                    <Icon as={BiCheck} ml={2} />
                    {item.completed}
                  </StatHelpText>
                </Stat>
              </AlertDialogBody>
            )}

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="teal"
                onClick={submit}
                ml={3}
                disabled={!isActive}
              >
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
