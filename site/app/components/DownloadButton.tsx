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
  AlertDialogBody,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  AvatarBadge,
  Avatar,
  Flex,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { useFetcher } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/node";
import { loader as torrentLoader } from "~/routes/__authed/api/torrent.$code";
import {
  ChangeEvent,
  cloneElement,
  ReactElement,
  useEffect,
  useReducer,
} from "react";
import { route } from "routes-gen";
import {
  BiCheck,
  BiCloudDownload,
  BiData,
  BiCalendarAlt,
} from "react-icons/bi";
import { BsArrowUp } from "react-icons/bs";
import { FocusLock } from "@chakra-ui/focus-lock";
import { useBookmarkProvider } from "~/components/BookmarkProvider";
import { color } from "~/libs/status/utils";
import { Alert } from "~/components/Alert";

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
            as={IconButton}
            icon={<Icon as={BiCloudDownload} boxSize={8} color="white" />}
            backgroundColor="transparent"
          >
            {lastTask && (
              <AvatarBadge boxSize="1em" bg={color(lastTask.status)} />
            )}
          </Avatar>
        </Box>
      </PopoverTrigger>
      <PopoverContent p={2}>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          <Tabs>
            <TabList>
              <Tab>Links</Tab>
              <Tab>Manual</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <LinksPanel code={code} />
              </TabPanel>
              <TabPanel>
                <ManualLinkPanel />
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
      {fetcher.data?.items.map((item, i) => (
        <DownloadConfirm key={item.link + i} item={item}>
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

const ManualLinkPanel = () => {
  const [value, onChange] = useReducer(
    (s: string, e: ChangeEvent<HTMLInputElement>) => e.target.value,
    ""
  );
  return (
    <Flex gap={1}>
      <Input onChange={onChange} placeholder="Input custom link url" />
      <DownloadConfirm item={{ title: "Custom link", link: value }}>
        <IconButton
          rounded="3xl"
          aria-label="Submit"
          icon={<BsArrowUp />}
          disabled={!value}
          colorScheme="teal"
        />
      </DownloadConfirm>
    </Flex>
  );
};

const DownloadConfirm = ({
  children,
  item,
}: {
  children: ReactElement;
  item: Pick<
    SerializeFrom<typeof torrentLoader>["items"][number],
    "link" | "title"
  >;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isBookmarking, handlers } = useBookmarkProvider();

  const submit = () => {
    isBookmarking && handlers.addDownloadTask(item.link);
    onClose();
  };

  const Trigger = cloneElement(children, { onClick: onOpen });

  return (
    <>
      {Trigger}
      <Alert
        isOpen={isOpen}
        onClose={onClose}
        title={isBookmarking ? "Download Confirm" : "Please bookmark it first"}
        commit={submit}
        commitName="OK"
        commitColorScheme="teal"
      >
        {isBookmarking && (
          <AlertDialogBody>
            <Stat>
              <StatLabel noOfLines={3}>{item.title}</StatLabel>
              <StatHelpText>{item.link}</StatHelpText>
            </Stat>
          </AlertDialogBody>
        )}
      </Alert>
    </>
  );
};
