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
            <DownloadConfirm key={item.link} item={item}>
              <Stat my={4}>
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
  item,
}: {
  children: ReactNode;
  item: SerializeFrom<typeof torrentLoader>["items"][number];
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any>(null);
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
              Download Confirm
            </AlertDialogHeader>

            <AlertDialogBody>
              <Stat>
                <StatLabel>{item.title}</StatLabel>
                <StatHelpText>
                  {item.registeredAt} {item.size}
                  <StatArrow type="increase" ml={2} />
                  {item.seeder}
                  <StatArrow type="decrease" ml={2} />
                  {item.leech}
                  <Icon as={BiCheck} ml={2} />
                  {item.completed}
                </StatHelpText>
              </Stat>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="teal" onClick={onClose} ml={3}>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
