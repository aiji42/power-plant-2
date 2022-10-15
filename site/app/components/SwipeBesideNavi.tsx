import { ReactNode } from "react";
import { useSwipeToBeside } from "~/hooks/useSwipeToBeside";
import { Box, Icon, Slide } from "@chakra-ui/react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";

export const SwipeBesideNavi = ({
  children,
  rightTo,
  leftTo,
}: {
  children: ReactNode;
  leftTo?: string;
  rightTo?: string;
}) => {
  const { handler, swiping } = useSwipeToBeside({ leftTo, rightTo });

  return (
    <Box position="relative">
      <div {...handler}>{children}</div>
      <Slide direction="left" in={swiping === "Right"} style={{ zIndex: 10 }}>
        <Icon
          position="absolute"
          top="50%"
          color="teal.300"
          fontSize="3xl"
          as={BsFillArrowLeftCircleFill}
        />
      </Slide>
      <Slide direction="right" in={swiping === "Left"} style={{ zIndex: 10 }}>
        <Icon
          position="absolute"
          top="50%"
          right={0}
          color="teal.300"
          fontSize="3xl"
          as={BsFillArrowRightCircleFill}
        />
      </Slide>
    </Box>
  );
};
