// .stylelintrc.cjs
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss',
  ],
  rules: {
    'selector-class-pattern': null, // Allow Tailwind JIT classes like `bg-[url('/img.svg')]`
    'no-invalid-position-at-import-rule': true,
    'at-rule-no-deprecated': true,
  },
};

