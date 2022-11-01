import { useRef } from "react";
import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { BiPlay } from "react-icons/bi";

export const PlayButton = ({
  src,
  ...props
}: { src?: string } & Partial<IconButtonProps>) => {
  const ref = useRef<HTMLVideoElement>(null);

  if (!src) return null;

  return (
    <>
      <video src={src} style={{ width: 0, height: 0 }} controls ref={ref} />
      <IconButton
        rounded="3xl"
        fontSize="2xl"
        aria-label="Play"
        {...props}
        icon={<BiPlay />}
        onClick={() => ref.current?.play()}
      />
    </>
  );
};
