import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { Icon, IconButton, useDisclosure } from "@chakra-ui/react";
import { useBookmarkProvider } from "~/components/BookmarkProvider";
import { Alert } from "~/components/Alert";

export const BookmarkButton = () => {
  const { isBookmarking, handlers } = useBookmarkProvider();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label="Bookmark"
        icon={
          <Icon
            as={isBookmarking ? BsBookmarkFill : BsBookmark}
            fontSize="2xl"
          />
        }
        boxSize={8}
        color={isBookmarking ? "teal.300" : undefined}
        onClick={isBookmarking ? onOpen : handlers.addBookmark}
        backgroundColor="transparent"
        rounded="3xl"
      />

      <Alert
        isOpen={isOpen}
        onClose={onClose}
        title="Delete bookmark"
        commit={() => {
          handlers.deleteBookmark();
          onClose();
        }}
        commitName="Delete"
      />
    </>
  );
};
