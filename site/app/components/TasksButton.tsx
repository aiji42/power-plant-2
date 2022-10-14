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
} from "@chakra-ui/react";
import { BsListTask } from "react-icons/bs";
import { FocusLock } from "@chakra-ui/focus-lock";
import { useBookmarkProvider } from "~/components/BookmarkProvider";
import { color, icon } from "~/libs/status/utils";

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
            icon={<Icon as={BsListTask} boxSize={8} color="white" />}
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

const TasksPanel = () => {
  const { bookmark } = useBookmarkProvider();
  const tasks = [
    ...(bookmark?.downloadTasks ?? []),
    ...(bookmark?.compressTasks ?? []),
  ].sort(({ createdAt: a }, { createdAt: b }) => (a > b ? -1 : 1));

  return (
    <>
      {tasks.map((task) => (
        <Stat my={4} key={task.id}>
          <StatLabel>
            <Icon as={icon(task.status)} color={color(task.status)} mr={1} />
            {"mediaId" in task ? "Compress" : "Download"} {task.status}
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
