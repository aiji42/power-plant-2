import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogBody,
  Button,
  ButtonProps,
} from "@chakra-ui/react";
import { ReactNode, useRef } from "react";

export const Alert = ({
  isOpen,
  onClose,
  title,
  commit,
  commitName,
  commitColorScheme = "red",
  children = null,
}: {
  isOpen: boolean;
  onClose: VoidFunction;
  title: string;
  commit: VoidFunction;
  commitName: string;
  commitColorScheme?: ButtonProps["colorScheme"];
  children?: ReactNode;
}) => {
  const cancelRef = useRef<any>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          {children && <AlertDialogBody>{children}</AlertDialogBody>}
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme={commitColorScheme} onClick={commit} ml={3}>
              {commitName}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
