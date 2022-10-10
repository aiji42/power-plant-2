import { BiBookmark } from "react-icons/bi";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Icon,
  useDisclosure,
} from "@chakra-ui/react";
import { useBookmarkProvider } from "~/components/BookmarkProvider";
import { useRef } from "react";

export const BookmarkButton = () => {
  const { isBookmarking, handlers } = useBookmarkProvider();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any>(null);

  return (
    <>
      <Icon
        as={BiBookmark}
        boxSize={8}
        color={isBookmarking ? "teal.300" : undefined}
        onClick={isBookmarking ? onOpen : handlers.addBookmark}
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete bookmark
            </AlertDialogHeader>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handlers.deleteBookmark();
                  onClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
