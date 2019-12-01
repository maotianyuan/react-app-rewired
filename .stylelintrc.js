// @ts-nocheck
module.exports = {
  extends: ['stylelint-config-css-modules', 'stylelint-config-standard'],
  rules: {
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],
    'at-rule-no-unknown': null,
    'block-closing-brace-newline-before': null
  }
}
