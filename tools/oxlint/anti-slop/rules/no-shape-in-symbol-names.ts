import { defineRule } from "@oxlint/plugins";
import type { ESTree } from "@oxlint/plugins";

const SHAPE_SYMBOL_NAME = "shape";

function containsShapeSymbolName(name: string): boolean {
  return name.toLowerCase().includes(SHAPE_SYMBOL_NAME);
}

type NamedIdentifier = ESTree.Node & { readonly name: string };

function isBindingWrapper(parent: ESTree.Node, child: ESTree.Node): boolean {
  if (parent.type === "AssignmentPattern") return parent.left === child;
  if (parent.type === "RestElement") return parent.argument === child;
  if (parent.type === "Property") return parent.value === child;
  return parent.type === "ArrayPattern" || parent.type === "ObjectPattern";
}

function isBindingIdentifier(node: NamedIdentifier): boolean {
  let current: ESTree.Node = node;
  let parent = current.parent;

  while (parent !== null && isBindingWrapper(parent, current)) {
    current = parent;
    parent = parent.parent;
  }

  if (parent === null) return false;
  if (parent.type === "VariableDeclarator") return parent.id === current;
  if (
    parent.type === "ArrowFunctionExpression" ||
    parent.type === "FunctionDeclaration" ||
    parent.type === "FunctionExpression" ||
    parent.type === "TSDeclareFunction" ||
    parent.type === "TSEmptyBodyFunctionExpression"
  ) {
    return parent.params.some((parameter) => parameter === current);
  }
  return false;
}

function declaresNamedSymbol(node: NamedIdentifier): boolean {
  const parent = node.parent;
  if (parent === null) return false;
  if (isBindingIdentifier(node)) return true;
  if (
    (parent.type === "ClassDeclaration" ||
      parent.type === "ClassExpression" ||
      parent.type === "FunctionDeclaration" ||
      parent.type === "FunctionExpression") &&
    parent.id === node
  ) {
    return true;
  }
  if (
    (parent.type === "TSTypeAliasDeclaration" ||
      parent.type === "TSInterfaceDeclaration" ||
      parent.type === "TSEnumDeclaration") &&
    parent.id === node
  ) {
    return true;
  }
  if (parent.type === "TSTypeParameter" && parent.name === node) return true;
  return (
    (parent.type === "MethodDefinition" ||
      parent.type === "PropertyDefinition" ||
      parent.type === "AccessorProperty") &&
    parent.computed === false &&
    parent.key === node
  );
}

/** Ban the case-insensitive substring "shape" in every JavaScript and TypeScript symbol name. */
export const noShapeInSymbolNamesRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        'Disallow the case-insensitive substring "shape" in JavaScript, TypeScript, private, and JSX symbol names.',
    },
    messages: {
      forbiddenSymbolName:
        'Rename symbol "{{name}}" for its domain role; "shape" describes structure rather than ownership.',
    },
  },
  createOnce(context) {
    const reportShapeSymbolName = (node: ESTree.Node & { name: string }) => {
      if (!containsShapeSymbolName(node.name)) return;
      context.report({
        node,
        messageId: "forbiddenSymbolName",
        data: { name: node.name },
      });
    };

    return {
      Identifier(node) {
        if (declaresNamedSymbol(node)) reportShapeSymbolName(node);
      },
      PrivateIdentifier(node) {
        if (
          (node.parent.type === "MethodDefinition" ||
            node.parent.type === "PropertyDefinition" ||
            node.parent.type === "AccessorProperty") &&
          node.parent.key === node
        ) {
          reportShapeSymbolName(node);
        }
      },
    };
  },
});
