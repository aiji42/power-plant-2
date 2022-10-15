import { useNavigate } from "@remix-run/react";
import { LEFT, RIGHT, useSwipeable } from "react-swipeable";
import { useState } from "react";

export const useSwipeToBeside = ({
  leftTo,
  rightTo,
}: {
  leftTo?: string;
  rightTo?: string;
}) => {
  const navi = useNavigate();
  const [swiping, setSwiping] = useState<typeof LEFT | typeof RIGHT | null>(
    null
  );

  const handler = useSwipeable({
    onSwipedLeft: () => {
      rightTo && navi(rightTo);
    },
    onSwipedRight: () => {
      leftTo && navi(leftTo);
    },
    onSwiping: ({ dir }) => {
      if ((dir === LEFT && rightTo) || (dir === RIGHT && leftTo))
        setSwiping(dir);
    },
    onSwiped: () => {
      setSwiping(null);
    },
    delta: 80,
  });

  return { handler, swiping };
};
