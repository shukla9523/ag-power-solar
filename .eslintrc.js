// Purpose: ESLint config — Next.js core-web-vitals rules plus a guard that keeps every site
// colour in src/styles/tokens.css (NTF-324): raw Tailwind arbitrary hex classes such as
// `bg-[#e61e73]` are errors; add a token to tokens.css + tailwind.config.js instead.
const RAW_HEX_CLASS = String.raw`/-\x5B#[0-9a-fA-F]{3,8}\x5D/` // matches "-[#abc]" … "-[#aabbccdd]"
const RAW_HEX_MESSAGE =
  "Raw hex colour class (e.g. bg-[#e61e73]). Add a token in src/styles/tokens.css + tailwind.config.js and use its class instead."

module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "no-restricted-syntax": [
      "error",
      { selector: `Literal[value=${RAW_HEX_CLASS}]`, message: RAW_HEX_MESSAGE },
      { selector: `TemplateElement[value.raw=${RAW_HEX_CLASS}]`, message: RAW_HEX_MESSAGE },
    ],
  },
}
