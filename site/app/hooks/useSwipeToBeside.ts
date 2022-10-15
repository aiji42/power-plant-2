import { useNavigate } from "@remix-run/react";
import { LEFT, RIGHT, useSwipeable } from "react-swipeable";
import { useState } from "react";

export const useSwipeToBeside = ([leftTo, rightTo]: [string, string]) => {
  const navi = useNavigate();
  const [swiping, setSwiping] = useState<typeof LEFT | typeof RIGHT | null>(
    null
  );

  const handler = useSwipeable({
    onSwipedLeft: () => {
      navi(rightTo);
    },
    onSwipedRight: () => {
      navi(leftTo);
    },
    onSwiping: ({ dir }) => {
      if (dir === LEFT || dir === RIGHT) setSwiping(dir);
    },
    onSwiped: () => {
      setSwiping(null);
    },
    delta: 200,
  });

  return { handler, swiping };
};
