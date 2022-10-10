import {
  Box,
  BoxProps,
  Icon,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  AvatarBadge,
  Avatar,
  Flex,
  Center,
  Text,
} from "@chakra-ui/react";
import { BiPlayCircle, BiTrash } from "react-icons/bi";
import { FocusLock } from "@chakra-ui/focus-lock";
import { useBookmarkProvider } from "~/components/BookmarkProvider";
import humanFormat from "human-format";
import { ComponentProps } from "react";
import { Alert } from "~/components/Alert";

export const MediaButton = ({
  sample,
  ...props
}: { sample?: string } & BoxProps) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { bookmark } = useBookmarkProvider();

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
            icon={<Icon as={BiPlayCircle} boxSize={8} color="white" />}
            backgroundColor="transparent"
          >
            {Number(bookmark?.medias.length) > 0 && (
              <AvatarBadge boxSize="1em" bg="teal.300" />
            )}
          </Avatar>
        </Box>
      </PopoverTrigger>
      <PopoverContent p={5}>
        <FocusLock persistentFocus={false}>
          <PopoverArrow />
          {bookmark?.medias.map((media) => (
            <Media
              key={media.id}
              media={media as ComponentProps<typeof Media>["media"]}
            />
          ))}
          {sample && <Sample sample={sample} />}
        </FocusLock>
      </PopoverContent>
    </Popover>
  );
};

type Meta = {
  codec?: string;
  width?: number;
  height?: number;
  bitRate?: string;
  duration?: string;
  frameRate?: number;
};

const Media = ({
  media,
}: {
  media: { size: string; meta: Meta; url: string; id: string };
}) => {
  const { handlers } = useBookmarkProvider();
  const alertHandler = useDisclosure();
  const meta = media.meta;
  const commit = () => {
    handlers.deleteMedia(media.id);
    alertHandler.onClose();
  };
  return (
    <Box my={4}>
      <Flex gap={2}>
        <Box>
          <video src={media.url} controls />
        </Box>
        <Center w={16}>
          <Icon as={BiTrash} boxSize={6} onClick={alertHandler.onOpen} />
          <Alert
            isOpen={alertHandler.isOpen}
            onClose={alertHandler.onClose}
            title="Delete media"
            commit={commit}
            commitName="Delete"
          />
        </Center>
      </Flex>
      <Text w="full" fontSize="xs" mt={1}>
        {humanFormat(Number(media.size), { unit: "B" })} | {meta.codec} |{" "}
        {meta.width}x{meta.height} | {Math.floor(Number(meta.duration) / 60)}m
      </Text>
    </Box>
  );
};

const Sample = ({ sample }: { sample: string }) => {
  return (
    <Box my={4}>
      <Flex gap={2}>
        <Box>
          <video src={sample} controls />
          <video
            src="https://pub-9e03c32adfb94e57bb957c8a923ef7d6.r2.dev/SP-200GANA-2757-qKZrvBwXbFLHkbFf/video.m3u8"
            controls
          />
        </Box>
        <Box w={16} />
      </Flex>
      <Text w="full" fontSize="xs">
        Sample
      </Text>
    </Box>
  );
};
