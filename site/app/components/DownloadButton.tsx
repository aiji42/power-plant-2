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
  Flex,
  Input,
  IconButton,
  Button,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableContainer,
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
  useRef,
  useState,
} from "react";
import { route } from "routes-gen";
import { BiCloudDownload } from "react-icons/bi";
import { BsArrowUp } from "react-icons/bs";
import { FocusLock } from "@chakra-ui/focus-lock";
import { useBookmarkProvider } from "~/components/BookmarkProvider";
import { Alert } from "~/components/Alert";
import { color, icon } from "~/libs/status/utils";

export const DownloadButton = ({
  code,
  ...props
}: { code: string } & BoxProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom"
    >
      <PopoverTrigger>
        <Box {...props}>
          <IconButton
            rounded="3xl"
            aria-label="Download media"
            icon={<Icon as={BiCloudDownload} fontSize="3xl" />}
            boxSize={8}
            backgroundColor="transparent"
          />
        </Box>
      </PopoverTrigger>
      <PopoverContent p={2} w="100vw">
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          <Tabs>
            <TabList>
              <Tab>Links</Tab>
              <Tab>Manual</Tab>
              <Tab>Upload</Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <LinksPanel code={code} />
              </TabPanel>
              <TabPanel>
                <ManualLinkPanel />
              </TabPanel>
              <TabPanel>
                <DirectUploadPanel onComplete={onClose} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};

const LinksPanel = ({ code }: { code: string }) => {
  const { bookmark } = useBookmarkProvider();
  const fetcher = useFetcher<SerializeFrom<typeof torrentLoader>>();
  useEffect(() => {
    fetcher.load(route("/api/torrent/:code", { code }));
  }, [fetcher.load, code]);

  if (fetcher.state === "loading")
    return (
      <Center>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="teal.300"
          size="xl"
        />
      </Center>
    );

  if (fetcher.data && fetcher.data.items.length < 1)
    return <Text>No data</Text>;

  return (
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Size</Th>
            <Th>Seeder</Th>
            <Th>Leech</Th>
            <Th>Completed</Th>
            <Th>Date</Th>
            <Th>Title</Th>
          </Tr>
        </Thead>
        <Tbody>
          {fetcher.data?.items.map((item, i) => {
            const task = bookmark?.downloadTasks?.find(
              ({ targetUrl }) => targetUrl === item.link
            );

            return (
              <DownloadConfirm key={item.link + i} item={item}>
                <Tr>
                  <Td>
                    {task && (
                      <Icon as={icon(task.status)} color={color(task.status)} />
                    )}
                  </Td>
                  <Td>{item.size}</Td>
                  <Td>{item.seeder}</Td>
                  <Td>{item.leech}</Td>
                  <Td>{item.completed}</Td>
                  <Td>{item.registeredAt.slice(0, 10)}</Td>
                  <Td>{item.title}</Td>
                </Tr>
              </DownloadConfirm>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
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

const DirectUploadPanel = ({ onComplete }: { onComplete?: VoidFunction }) => {
  const { isBookmarking, handlers, signedUploadUrl } = useBookmarkProvider();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const fileName = useRef("");
  const [isLoading, setLoading] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const [file] = e.target.files ?? [];
    if (file && isBookmarking) {
      setPreviewUrl(URL.createObjectURL(file));
      const [ext] = file.name.split(".").slice(-1);
      fileName.current = `${new Date().getTime()}.${ext}`;
      handlers.uploadFileDirect(fileName.current);
    }
  };

  const upload = async () => {
    const [file] = fileRef.current?.files ?? [];
    if (!file || !signedUploadUrl || !fileName.current) return;

    setLoading(true);
    await fetch(signedUploadUrl, {
      headers: { "Content-Type": file.type },
      method: "PUT",
      body: file,
    });
    handlers.addMedia({ name: fileName.current, size: String(file.size) });
    setLoading(false);
    onComplete?.();
  };

  return (
    <>
      <input type="file" onChange={onChange} ref={fileRef} accept="video/*" />
      {previewUrl && (
        <Box my={2}>
          <video src={previewUrl} controls />
        </Box>
      )}
      {signedUploadUrl && (
        <Flex justify="flex-end">
          <Button
            disabled={isLoading}
            onClick={upload}
            colorScheme="teal"
            isLoading={isLoading}
          >
            Upload
          </Button>
        </Flex>
      )}
    </>
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
