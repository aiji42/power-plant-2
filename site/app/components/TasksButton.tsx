import {
  Box,
  BoxProps,
  Icon,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  Text,
  AvatarBadge,
  Avatar,
  IconButton,
  Button,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tabs,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  AlertDialogBody,
} from "@chakra-ui/react";
import { BsListTask } from "react-icons/bs";
import { FocusLock } from "@chakra-ui/focus-lock";
import { useBookmarkProvider } from "~/components/BookmarkProvider";
import { color, icon } from "~/libs/status/utils";
import dayjs from "dayjs";
import { cloneElement, ReactElement } from "react";
import { Alert } from "~/components/Alert";
import { Chart } from "~/components/Chart";

export const TaskButton = (props: BoxProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { bookmark } = useBookmarkProvider();
  const [lastTask] = [
    ...(bookmark?.downloadTasks ?? []),
    ...(bookmark?.compressTasks ?? []),
  ].sort(({ createdAt: a }, { createdAt: b }) => (a > b ? -1 : 1));

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
            icon={<Icon as={BsListTask} fontSize="3xl" color="white" />}
            backgroundColor="transparent"
          >
            {lastTask && (
              <AvatarBadge boxSize="1em" bg={color(lastTask.status)} />
            )}
          </Avatar>
        </Box>
      </PopoverTrigger>
      <PopoverContent p={2} w="100vw">
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          <Tabs>
            <TabList>
              <Tab>
                <>
                  Download
                  {bookmark?.downloadTasks?.[0] ? (
                    <Icon
                      as={icon(bookmark.downloadTasks[0].status)}
                      color={color(bookmark.downloadTasks[0].status)}
                      ml={1}
                    />
                  ) : (
                    ""
                  )}
                </>
              </Tab>
              <Tab>
                <>
                  Compress
                  {bookmark?.compressTasks?.[0] ? (
                    <Icon
                      as={icon(bookmark.compressTasks[0].status)}
                      color={color(bookmark.compressTasks[0].status)}
                      ml={1}
                    />
                  ) : (
                    ""
                  )}
                </>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <DownloadTaskPanel />
              </TabPanel>
              <TabPanel px={0}>
                <CompressTaskPanel />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};

type Progress =
  | {
      duration: number;
      rate: string;
      speed: string;
      expects: string;
      connections: string;
    }[]
  | null;

const DownloadTaskPanel = () => {
  const { bookmark, handlers } = useBookmarkProvider();

  if (!bookmark?.downloadTasks?.[0]) return <Text>No tasks</Text>;

  return (
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Status</Th>
            <Th>PS</Th>
            <Th>DL(/s)</Th>
            <Th>CN</Th>
            <Th>ETA</Th>
            <Th>Begin</Th>
            <Th>Stopped</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {bookmark.downloadTasks.map((task) => (
            <StatsBoard key={task.id} data={task.progress as Progress}>
              <Tr _hover={{ bg: "gray.600" }}>
                <Td color={color(task.status)}>{task.status}</Td>
                <Td>{(task.progress as Progress)?.at(-1)?.rate ?? "-"}</Td>
                <Td>{(task.progress as Progress)?.at(-1)?.speed ?? "-"}</Td>
                <Td>
                  {(task.progress as Progress)?.at(-1)?.connections ?? "-"}
                </Td>
                <Td>{(task.progress as Progress)?.at(-1)?.expects ?? "-"}</Td>
                <Td>
                  {task.startedAt ? (
                    <>
                      {dayjs(task.startedAt).format("YYYY-MM-DD")}
                      <br />
                      {dayjs(task.startedAt).format("hh:mm")}
                    </>
                  ) : (
                    "-"
                  )}
                </Td>
                <Td>
                  {task.stoppedAt ? (
                    <>
                      {dayjs(task.stoppedAt).format("YYYY-MM-DD")}
                      <br />
                      {dayjs(task.stoppedAt).format("hh:mm")}
                    </>
                  ) : (
                    "-"
                  )}
                </Td>
                <Td>
                  {task.status === "Running" && (
                    <Button
                      colorScheme="red"
                      onClick={() => handlers.cancelDownloadTask(task.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </Td>
              </Tr>
            </StatsBoard>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const CompressTaskPanel = () => {
  const { bookmark } = useBookmarkProvider();

  if (!bookmark?.compressTasks?.[0]) return <Text>No tasks</Text>;

  return (
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Status</Th>
            <Th>Begin</Th>
            <Th>Stopped</Th>
          </Tr>
        </Thead>
        <Tbody>
          {bookmark.compressTasks.map((task) => (
            <Tr key={task.id}>
              <Td color={color(task.status)}>{task.status}</Td>
              <Td>
                {task.startedAt ? (
                  <>
                    {dayjs(task.startedAt).format("YYYY-MM-DD")}
                    <br />
                    {dayjs(task.startedAt).format("hh:mm")}
                  </>
                ) : (
                  "-"
                )}
              </Td>
              <Td>
                {task.stoppedAt ? (
                  <>
                    {dayjs(task.stoppedAt).format("YYYY-MM-DD")}
                    <br />
                    {dayjs(task.stoppedAt).format("hh:mm")}
                  </>
                ) : (
                  "-"
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

const StatsBoard = ({
  children,
  data,
}: {
  children: ReactElement;
  data: Progress;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  if (!data) return children;

  const Trigger = cloneElement(children, { onClick: onOpen });

  return (
    <>
      {Trigger}
      <Alert
        title=""
        isOpen={isOpen}
        onClose={onClose}
        commit={onClose}
        commitName="OK"
        commitColorScheme="teal"
      >
        <AlertDialogBody p={0}>
          <Chart data={data} />
        </AlertDialogBody>
      </Alert>
    </>
  );
};
