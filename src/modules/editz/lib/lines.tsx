/**
 * Purpose: renders editable heading text where "\n" marks a line break, producing the same
 * markup the headings used when they were hardcoded (text + <br />, optional break class).
 * A space is emitted before each <br /> by default so the accessible/crawled text does not join
 * words across lines ("growyour"); a trailing space before a line break never renders.
 */

import { Fragment } from "react"

export function renderLines(
  text: string,
  options: { brClassName?: string; spaceBeforeBreak?: boolean } = {}
) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && options.spaceBeforeBreak !== false ? " " : null}
      {i > 0 ? <br className={options.brClassName} /> : null}
      {line}
    </Fragment>
  ))
}
