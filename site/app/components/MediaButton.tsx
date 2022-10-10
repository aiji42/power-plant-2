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
import { Media } from "@prisma/client";
import { ComponentProps, useRef } from "react";

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
  media: { size: number; meta: Meta; url: string };
}) => {
  const meta = media.meta;
  const ref = useRef<HTMLVideoElement>(null);
  const onClick = () => {
    ref.current?.play();
  };
  return (
    <Flex my={4} justify="start">
      <Center w={8}>
        <video src={media.url} width="100%" ref={ref} controls />
      </Center>
      <Text w="full" fontSize="xs" px={2} onClick={onClick}>
        {humanFormat(media.size, { unit: "B" })} | {meta.codec} | {meta.width}x
        {meta.height}
        <br />
        {humanFormat(Number(meta.bitRate))}bps |{" "}
        {Math.floor(Number(meta.duration) / 60)}m |{" "}
        {Math.floor(meta.frameRate ?? NaN)}fps
      </Text>
      <Center w={6}>
        <Icon as={BiTrash} boxSize={6} />
      </Center>
    </Flex>
  );
};

const Sample = ({ sample }: { sample: string }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const onClick = () => {
    ref.current?.play();
  };
  return (
    <Flex my={4}>
      <Center w={8}>
        <video src={sample} width="100%" ref={ref} controls />
      </Center>
      <Text w="full" fontSize="xs" px={2} onClick={onClick}>
        Sample
      </Text>
      <Box w={6} />
    </Flex>
  );
};
