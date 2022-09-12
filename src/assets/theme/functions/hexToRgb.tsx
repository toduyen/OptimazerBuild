/**
 The hexToRgb() function helps you to change the hex color code to rgb
 using chroma-js library.
 */

// chroma-js is a library for all kinds of color conversions and color scales.
// @ts-ignore
import chroma from "chroma-js";

function hexToRgb(color: string) {
  return chroma(color).rgb(0, 0, 0).join(", ");
}

export default hexToRgb;
