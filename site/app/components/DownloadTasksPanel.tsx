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
import { useFetcher } from "@remix-run/react";
import { SerializeFrom } from "@remix-run/node";
import { loader as downloadTaskLoader } from "~/routes/__authed/api/download-task.$code";
import { useEffect } from "react";
import { route } from "routes-gen";
import {
  BiTask,
  BiPauseCircle,
  BiPlayCircle,
  BiCheckCircle,
  BiErrorCircle,
} from "react-icons/bi";
import { FocusLock } from "@chakra-ui/focus-lock";
import { clearInterval } from "timers";

export const DownloadTasksPanel = ({
  code,
  ...props
}: { code: string } & BoxProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const fetcher = useFetcher<SerializeFrom<typeof downloadTaskLoader>>();
  useEffect(() => {
    fetcher.load(route("/api/download-task/:code", { code }));
    const id = setInterval(
      () => fetcher.load(route("/api/download-task/:code", { code })),
      10000
    );
    return () => clearInterval(id);
  }, [fetcher.load, code]);

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
            {fetcher.data?.status && (
              <AvatarBadge boxSize="1em" bg={color(fetcher.data.status)} />
            )}
          </Avatar>
        </Box>
      </PopoverTrigger>
      <PopoverContent p={5}>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          {fetcher.data?.tasks.map((task) => (
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
          {fetcher.data && fetcher.data.tasks.length < 1 && (
            <Text>No tasks</Text>
          )}
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
