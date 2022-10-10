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
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  AvatarBadge,
  Avatar,
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
  BiPauseCircle,
  BiPlayCircle,
  BiCheckCircle,
  BiErrorCircle,
} from "react-icons/bi";
import { FocusLock } from "@chakra-ui/focus-lock";
import { useBookmarkProvider } from "~/components/BookmarkProvider";

export const DownloadButton = ({
  code,
  ...props
}: { code: string } & BoxProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { bookmark } = useBookmarkProvider();
  const [lastTask] = bookmark?.downloadTasks ?? [];

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom"
    >
      <PopoverTrigger>
        <Box {...props}>
          <Avatar
            size="sm"
            icon={<Icon as={BiCloudDownload} boxSize={8} color="white" />}
            backgroundColor="transparent"
          >
            {lastTask && (
              <AvatarBadge boxSize="1em" bg={color(lastTask.status)} />
            )}
          </Avatar>
        </Box>
      </PopoverTrigger>
      <PopoverContent p={5}>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          <Tabs>
            <TabList>
              <Tab>Tasks</Tab>
              <Tab>Links</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <DownloadTasksPanel />
              </TabPanel>
              <TabPanel>
                <LinksPanel code={code} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};

const LinksPanel = ({ code }: { code: string }) => {
  const fetcher = useFetcher<SerializeFrom<typeof torrentLoader>>();
  useEffect(() => {
    fetcher.load(route("/api/torrent/:code", { code }));
  }, [fetcher.load, code]);

  return (
    <>
      {fetcher.state === "loading" && (
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
      {fetcher.data?.items.map((item) => (
        <DownloadConfirm key={item.link} item={item}>
          <Stat my={4}>
            <StatLabel noOfLines={2}>{item.title}</StatLabel>
            <StatHelpText>
              <Icon as={BiCalendarAlt} />
              {item.registeredAt.slice(0, 10)}
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
      {fetcher.data && fetcher.data.items.length < 1 && <Text>No data</Text>}
    </>
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

  const { isBookmarking, handlers } = useBookmarkProvider();

  const submit = () => {
    handlers.addDownloadTask(item.link);
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
              {isBookmarking ? "Download Confirm" : "Please bookmark it first"}
            </AlertDialogHeader>

            {isBookmarking && (
              <AlertDialogBody>
                <Stat>
                  <StatLabel>{item.title}</StatLabel>
                  <StatHelpText>
                    <Icon as={BiCalendarAlt} />
                    {item.registeredAt.slice(0, 10)}
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
                disabled={!isBookmarking}
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

const DownloadTasksPanel = () => {
  const { bookmark } = useBookmarkProvider();

  return (
    <>
      {bookmark?.downloadTasks.map((task) => (
        <Stat my={4}>
          <StatLabel fontSize="lg">
            <Icon as={icon(task.status)} color={color(task.status)} />
            {task.status}
          </StatLabel>
          <StatHelpText>
            {task.startedAt && (
              <>started: {new Date(task.startedAt).toLocaleString()}</>
            )}
            {task.stoppedAt && (
              <>
                <br />
                stopped: {new Date(task.stoppedAt).toLocaleString()}
              </>
            )}
            <Text noOfLines={3}>{task.message}</Text>
          </StatHelpText>
        </Stat>
      ))}
      {(bookmark?.downloadTasks ?? []).length < 1 && <Text>No tasks</Text>}
    </>
  );
};

const color = (status: string) =>
  status === "Waiting"
    ? "gray.300"
    : status === "Running"
    ? "orange.300"
    : status === "Completed"
    ? "teal.300"
    : "red.300";

const icon = (status: string) =>
  status === "Waiting"
    ? BiPauseCircle
    : status === "Running"
    ? BiPlayCircle
    : status === "Completed"
    ? BiCheckCircle
    : BiErrorCircle;
