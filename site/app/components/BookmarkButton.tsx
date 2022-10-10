import { BiBookmark } from "react-icons/bi";
import { Icon } from "@chakra-ui/react";
import { useBookmarkProvider } from "~/components/BookmarkProvider";

export const BookmarkButton = () => {
  const { isBookmarking, handlers } = useBookmarkProvider();

  return (
    <Icon
      as={BiBookmark}
      boxSize={8}
      color={isBookmarking ? "teal.300" : undefined}
      onClick={isBookmarking ? handlers.deleteBookmark : handlers.addBookmark}
    />
  );
};
