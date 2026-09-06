import { clsx, type ClassValue } from "clsx";

/** Join optional class values without interpreting utility names. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
