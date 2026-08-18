import { createNoReflectMethodRule } from "../shared/reflect-method.ts";

/** Ban Reflect.apply, which bypasses ordinary typed function calls. */
export const noReflectApplyRule = createNoReflectMethodRule({
  method: "apply",
  messageId: "reflectApply",
  message:
    "Replace `Reflect.apply` with a typed function call. Model dynamic dispatch behind a named interface.",
  description:
    "Disallow Reflect.apply; call typed functions directly or model dynamic dispatch behind an interface.",
});
