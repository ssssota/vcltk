import type { AST } from "@vcltk/ast";
import type { AstPath, Printer } from "prettier";
import { doc } from "prettier";
import { visitorKeys } from "./visitor-keys.js";

const { group, indent, join, line, softline, hardline } = doc.builders;

const printComment = ((commentPath, _options) => {
	const node = commentPath.node;
	if (node === undefined) return "";
	// @ts-expect-error
	node.printed = true;
	switch (node.kind) {
		case "comment_block":
			return `/*${node.value.replace(/^ +/, "").replace(/ +$/, "")}*/`;
		case "comment_line":
			return `//${node.value.replace(/\s+$/, "")}`;
		case "comment_hash":
			return `#${node.value.replace(/\s+$/, "")}`;
	}
	return "";
}) satisfies Printer<AST | undefined>["printComment"];

export const printer = {
	print(path, _options, print) {
		const node = path.node;
		if (node === undefined) return "";
		const previousLine = path.previous?.span.end.line ?? node.span.start.line;
		switch (node.kind) {
			case "vcl":
				return [
					join(
						hardline,
						(path as AstPath<typeof node>).map(print, "declarations"),
					),
					hardline,
				];

			// declarations
			case "sub":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						"sub ",
						node.name,
						" ",
						node.returnType
							? [(path as AstPath<typeof node>).call(print, "returnType"), " "]
							: "",
						(path as AstPath<typeof node>).call(print, "body"),
					]),
				];
			case "acl":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						"acl ",
						node.name,
						" {",
						indent([
							line,
							join(line, (path as AstPath<typeof node>).map(print, "entries")),
						]),
						hardline,
						"}",
					]),
				];
			case "acl-entry":
				return group([
					node.negated ? "! " : "",
					'"',
					node.address.value,
					'"',
					node.cidr ? `/${node.cidr}` : "",
					";",
				]);
			case "import":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group(["import ", node.ident, ";"]),
				];
			case "include":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group(['include "', node.path.value, '";']),
				];
			case "penaltybox":
			case "ratecounter":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([node.kind, " ", node.name, " {", "}"]),
				];
			case "table":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						"table ",
						node.name,
						" ",
						(path as AstPath<typeof node>).call(print, "type"),
						node.type === undefined ? "" : " ",
						"{",
						indent([
							line,
							join(line, (path as AstPath<typeof node>).map(print, "entries")),
						]),
						line,
						"}",
					]),
				];
			case "table-entry":
				return group([
					(path as AstPath<typeof node>).call(print, "key"),
					": ",
					(path as AstPath<typeof node>).call(print, "value"),
					",",
				]);
			case "backend":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						"backend ",
						node.name,
						" {",
						indent([
							line,
							join(
								line,
								(path as AstPath<typeof node>).map(print, "properties"),
							),
						]),
						line,
						"}",
					]),
				];
			case "director":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						"director ",
						node.name,
						" ",
						node.type,
						" {",
						node.properties.length > 0
							? indent([
									hardline,
									join(
										line,
										(path as AstPath<typeof node>).map(print, "properties"),
									),
								])
							: "",
						node.properties.length > 0 && node.directions.length > 0
							? line
							: "",
						node.directions.length > 0
							? indent([
									hardline,
									join(
										line,
										(path as AstPath<typeof node>).map(print, "directions"),
									),
								])
							: "",
						line,
						"}",
					]),
				];

			// statements
			case "block":
				return group([
					"{",
					node.body.length > 0
						? indent([
								line,
								join(line, (path as AstPath<typeof node>).map(print, "body")),
							])
						: "",
					hardline,
					"}",
				]);
			case "declare":
				return group([
					"declare ",
					(path as AstPath<typeof node>).call(print, "target"),
					" ",
					(path as AstPath<typeof node>).call(print, "type"),
					";",
				]);
			case "set":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						"set ",
						(path as AstPath<typeof node>).call(print, "target"),
						" ",
						(path as AstPath<typeof node>).call(print, "operator"),
						" ",
						(path as AstPath<typeof node>).call(print, "value"),
						";",
					]),
				];
			case "unset":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						"unset ",
						(path as AstPath<typeof node>).call(print, "target"),
						";",
					]),
				];
			case "add":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						"add ",
						(path as AstPath<typeof node>).call(print, "target"),
						" = ",
						(path as AstPath<typeof node>).call(print, "value"),
						";",
					]),
				];
			case "call":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						"call ",
						(path as AstPath<typeof node>).call(print, "target"),
						";",
					]),
				];
			case "if":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						"if (",
						group([
							indent([
								softline,
								(path as AstPath<typeof node>).call(print, "condition"),
							]),
							softline,
						]),
						") ",
						(path as AstPath<typeof node>).call(print, "body"),
						node.else ? " else " : "",
						(path as AstPath<typeof node>).call(print, "else"),
					]),
				];
			case "error":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						"error ",
						node.status?.toString() ?? "",
						node.message ? " " : "",
						(path as AstPath<typeof node>).call(print, "message"),
						";",
					]),
				];
			case "esi":
				return "esi;";
			case "restart":
				return "restart;";
			case "return":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						"return",
						node.value ? " " : "",
						(path as AstPath<typeof node>).call(print, "value"),
						";",
					]),
				];
			case "return-state":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group(["return(", node.state, ");"]),
				];
			case "synthetic":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						node.base64 ? "synthetic.base64" : "synthetic",
						" ",
						(path as AstPath<typeof node>).call(print, "value"),
						";",
					]),
				];
			case "log":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([
						"log ",
						(path as AstPath<typeof node>).call(print, "message"),
						";",
					]),
				];
			case "goto":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group(["goto ", node.label, ";"]),
				];
			case "label":
				return [
					node.span.start.line - previousLine > 1 ? hardline : "",
					group([node.name, ":"]),
				];

			// expressions
			case "parenthesized":
				return group([
					"(",
					(path as AstPath<typeof node>).call(print, "expr"),
					")",
				]);
			case "binary":
				return group([
					(path as AstPath<typeof node>).call(print, "lhs"),
					" ",
					(path as AstPath<typeof node>).call(print, "operator"),
					line,
					(path as AstPath<typeof node>).call(print, "rhs"),
				]);
			case "unary":
				return group([
					(path as AstPath<typeof node>).call(print, "operator"),
					(path as AstPath<typeof node>).call(print, "rhs"),
				]);
			case "string_concat":
				return group(
					join(line, (path as AstPath<typeof node>).map(print, "tokens")),
				);
			// literals
			case "object":
				return group([
					"{",
					indent([
						line,
						join(line, (path as AstPath<typeof node>).map(print, "properties")),
					]),
					line,
					"}",
				]);
			case "object-property":
				return group([
					".",
					node.key,
					" = ",
					(path as AstPath<typeof node>).call(print, "value"),
					";",
				]);
			case "variable":
				return group([
					node.name,
					node.properties.length > 0 ? [".", join(".", node.properties)] : [],
					node.subField ? [":", node.subField] : [],
				]);
			case "function-call":
				return group([
					(path as AstPath<typeof node>).call(print, "target"),
					"(",
					indent([
						softline,
						join(
							[",", line],
							(path as AstPath<typeof node>).map(print, "arguments"),
						),
					]),
					")",
				]);
			case "string":
				return join(
					[" +", line],
					(path as AstPath<typeof node>).map(print, "tokens"),
				);
			case "rtime":
				return [node.value.toString(), node.unit];
			case "integer":
			case "float":
			case "quoted-string":
			case "heredoc":
				return node.raw;
			case "bool":
				return node.value ? "true" : "false";
			case "parcent":
				return [node.value.toString(), "%"];

			// types
			case "type":
				return node.name;

			// operators
			case "!":
			case "&&":
			case "||":
			case "==":
			case "!=":
			case "<":
			case "<=":
			case ">":
			case ">=":
			case "+":
			case "-":
			case "*":
			case "/":
			case "=":
			case "+=":
			case "-=":
			case "*=":
			case "/=":
			case "%=":
			case "&=":
			case "|=":
			case "^=":
			case "<<=":
			case ">>=":
			case "ror=":
			case "rol=":
			case "&&=":
			case "||=":
			case "~":
			case "!~":
				return node.kind;

			// comments
			case "comment_block":
			case "comment_line":
			case "comment_hash":
				return printComment(path, _options);

			case "case":
				throw new Error(`${node.kind} is not supported yet.`);
			default:
				throw new Error(
					`Unknown node: ${JSON.stringify(node satisfies never)}`,
				);
		}
	},
	handleComments: {
		ownLine(commentNode) {
			if (commentNode.precedingNode || commentNode.followingNode) return false;
			const enclosingNode: AST = commentNode.enclosingNode;
			if ("body" in enclosingNode && Array.isArray(enclosingNode.body)) {
				enclosingNode.body.push(commentNode);
				return true;
			}
			return false;
		},
	},
	isBlockComment(node) {
		return node?.kind === "comment_block";
	},
	printComment,
	canAttachComment(node) {
		if (node === undefined) return false;
		return (
			node.kind !== "comment_block" &&
			node.kind !== "comment_line" &&
			node.kind !== "comment_hash"
		);
	},
	getVisitorKeys(node, _nonTraversableKeys) {
		if (node === undefined) return [];
		return visitorKeys[node.kind] ?? [];
	},
} as const satisfies Printer<AST | undefined>;
