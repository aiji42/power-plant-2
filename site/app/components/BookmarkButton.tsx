import { BiBookmark } from "react-icons/bi";
import { Icon, useDisclosure } from "@chakra-ui/react";
import { useBookmarkProvider } from "~/components/BookmarkProvider";
import { Alert } from "~/components/Alert";

export const BookmarkButton = () => {
  const { isBookmarking, handlers } = useBookmarkProvider();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Icon
        as={BiBookmark}
        boxSize={8}
        color={isBookmarking ? "teal.300" : undefined}
        onClick={isBookmarking ? onOpen : handlers.addBookmark}
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
