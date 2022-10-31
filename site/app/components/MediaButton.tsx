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
  Text,
  IconButton,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { BiPlayCircle, BiTrash, BiDotsHorizontalRounded } from "react-icons/bi";
import { FaCompressArrowsAlt } from "react-icons/fa";
import { FocusLock } from "@chakra-ui/focus-lock";
import { useBookmarkProvider } from "~/components/BookmarkProvider";
import humanFormat from "human-format";
import { ComponentProps, useReducer } from "react";
import { Alert } from "~/components/Alert";
import { PlayButton } from "~/components/PlayButton";

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
            as={IconButton}
            icon={<Icon as={BiPlayCircle} fontSize="3xl" color="white" />}
            backgroundColor="transparent"
          >
            {Number(bookmark?.medias.length) > 0 && (
              <AvatarBadge boxSize="1em" bg="teal.300" />
            )}
          </Avatar>
        </Box>
      </PopoverTrigger>
      <PopoverContent p={2}>
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
  const [action, buttonHandler] = useReducer(
    (s: "delete" | "compress", a: "delete" | "compress") => {
      alertHandler.onOpen();
      return a;
    },
    "delete"
  );
  const commit = () => {
    action === "delete"
      ? handlers.deleteMedia(media.id)
      : handlers.addCompressTask(media.id);
    alertHandler.onClose();
  };
  return (
    <>
      <Flex gap={2} my={4}>
        <Text w="full" fontSize="sm" py={2} px={1}>
          {humanFormat(Number(media.size), { unit: "B" })} | {meta.width}x
          {meta.height} | {Math.floor(Number(meta.duration) / 60)}m
        </Text>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<BiDotsHorizontalRounded />}
            bg="inherit"
            fontSize="xl"
          />
          <MenuList>
            <MenuItem
              icon={<BiTrash />}
              onClick={() => buttonHandler("delete")}
            >
              Delete
            </MenuItem>
            <MenuItem
              icon={<FaCompressArrowsAlt />}
              onClick={() => buttonHandler("compress")}
            >
              Compress
            </MenuItem>
          </MenuList>
        </Menu>
        <PlayButton src={media.url} />
      </Flex>
      <Alert
        isOpen={alertHandler.isOpen}
        onClose={alertHandler.onClose}
        title={action === "delete" ? "Delete media" : "Compress media"}
        commit={commit}
        commitName={action === "delete" ? "Delete" : "Compress"}
        commitColorScheme={action === "delete" ? "red" : "teal"}
      />
    </>
  );
};

const Sample = ({ sample }: { sample: string }) => {
  return (
    <Flex gap={2} my={4}>
      <Text w="full" fontSize="sm" py={2} px={1}>
        Sample
      </Text>
      <Spacer />
      <PlayButton src={sample} />
    </Flex>
  );
};
