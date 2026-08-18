import type { ESTree } from "@oxlint/plugins";

export function isEmptyObjectExpression(expression: ESTree.Expression): boolean {
  return expression.type === "ObjectExpression" && expression.properties.length === 0;
}
