import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@remix-run/react";
import throttle from "lodash.throttle";
import { UP, useSwipeable } from "react-swipeable";

export const useSwipeToNext = (nextTo: string) => {
  const isBottom = useRef(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const navi = useNavigate();

  useEffect(() => {
    const onScroll = throttle(() => {
      isBottom.current =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;
    }, 400);
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handler = useSwipeable({
    onSwipedUp: () => {
      isSwiping && navi(nextTo);
    },
    onSwiping: ({ dir }) => {
      setIsSwiping(isBottom.current && dir === UP);
    },
    onSwiped: () => {
      setIsSwiping(false);
    },
    delta: 200,
  });

  return { handler, swiping: isSwiping };
};
