import {
  BiCheckCircle,
  BiErrorCircle,
  BiPauseCircle,
  BiPlayCircle,
  BiStopCircle,
} from "react-icons/bi";

export const color = (status: string, index = 300) =>
  status === "Waiting"
    ? `gray.${index}`
    : status === "Running"
    ? `orange.${index}`
    : status === "Completed"
    ? `teal.${index}`
    : status === "Canceled"
    ? `yellow.${index}`
    : `red.${index}`;

export const icon = (status: string) =>
  status === "Waiting"
    ? BiPauseCircle
    : status === "Running"
    ? BiPlayCircle
    : status === "Completed"
    ? BiCheckCircle
    : status === "Canceled"
    ? BiStopCircle
    : BiErrorCircle;
