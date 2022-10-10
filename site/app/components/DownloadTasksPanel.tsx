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
  Avatar,
  AvatarBadge,
} from "@chakra-ui/react";
import {
  BiTask,
  BiPauseCircle,
  BiPlayCircle,
  BiCheckCircle,
  BiErrorCircle,
} from "react-icons/bi";
import { FocusLock } from "@chakra-ui/focus-lock";
import { useBookmarkProvider } from "~/components/BookmarkProvider";

export const DownloadTasksPanel = ({ ...props }: BoxProps) => {
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
            icon={<Icon as={BiTask} boxSize={8} color="white" />}
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
        </FocusLock>
      </PopoverContent>
    </Popover>
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
