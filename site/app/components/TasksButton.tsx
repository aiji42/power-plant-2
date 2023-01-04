import {
  Box,
  BoxProps,
  Icon,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  Stat,
  StatHelpText,
  StatLabel,
  useDisclosure,
  Text,
  AvatarBadge,
  Avatar,
  IconButton,
  Collapse,
  Button,
} from "@chakra-ui/react";
import { BsListTask } from "react-icons/bs";
import { FocusLock } from "@chakra-ui/focus-lock";
import { useBookmarkProvider } from "~/components/BookmarkProvider";
import { color, icon } from "~/libs/status/utils";
import { useReducer, Fragment } from "react";
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
      <PopoverContent p={2}>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          <TasksPanel />
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};

type Progress = {
  duration: number;
  rate: string;
  speed: string;
  expects: string;
}[];

const TasksPanel = () => {
  const [showFull, toggle] = useReducer((s) => !s, false);
  const { bookmark, handlers } = useBookmarkProvider();
  const tasks = [
    ...(bookmark?.downloadTasks ?? []),
    ...(bookmark?.compressTasks ?? []),
  ].sort(({ createdAt: a }, { createdAt: b }) => (a > b ? -1 : 1));

  return (
    <>
      {tasks.map((task) => (
        <Fragment key={task.id}>
          <Stat my={4}>
            <StatLabel>
              <Icon as={icon(task.status)} color={color(task.status)} mr={1} />
              {"mediaId" in task ? "Compress" : "Download"} {task.status}
            </StatLabel>
            <StatHelpText>
              {task.startedAt && (
                <>started: {new Date(task.startedAt).toLocaleString()}</>
              )}
              {"progress" in task &&
                Array.isArray(task.progress) &&
                task.progress.length > 0 && (
                  <>
                    <br />
                    download: {(task.progress as Progress).at(-1)?.rate}
                    <br />
                    speed: {(task.progress as Progress).at(-1)?.speed}
                    <br />
                    expects: {(task.progress as Progress).at(-1)?.expects}
                  </>
                )}
              {"progress" in task && task.status === "Running" && (
                <Button
                  colorScheme="red"
                  onClick={() => handlers.cancelDownloadTask(task.id)}
                >
                  Cancel
                </Button>
              )}
              {task.stoppedAt && (
                <>
                  <br />
                  stopped: {new Date(task.stoppedAt).toLocaleString()}
                </>
              )}
              <Collapse startingHeight={20} onClick={toggle} in={showFull}>
                {task.message}
              </Collapse>
            </StatHelpText>
          </Stat>
          {"progress" in task && Array.isArray(task.progress) && (
            <Chart data={task.progress as Progress} />
          )}
        </Fragment>
      ))}
      {(bookmark?.downloadTasks ?? []).length < 1 && <Text>No tasks</Text>}
    </>
  );
};
