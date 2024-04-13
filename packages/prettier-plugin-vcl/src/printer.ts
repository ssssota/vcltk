import type { AstPath, Printer } from "prettier";
import { doc } from "prettier";
import type { FastlyVclNode } from "./types.js";

const { group, indent, join, line, softline, hardline } = doc.builders;

const printComment = ((commentPath, _options) => {
	const node = commentPath.node;
	switch (node?.kind) {
		case "comment_block":
			return `/*${node.value.replace(/^ +/, "").replace(/ +$/, "")}*/`;
		case "comment_line":
			return `//${node.value.replace(/\s+$/, "")}`;
		case "comment_hash":
			return `#${node.value.replace(/\s+$/, "")}`;
	}
	return "";
}) satisfies Printer<FastlyVclNode | undefined>["printComment"];

export const printer = {
	print(path, _options, print) {
		const node = path.node;
		if (node === undefined) return "";
		switch (node.kind) {
			case "vcl":
				return [
					join(
						[hardline, hardline],
						(path as AstPath<typeof node>).map(print, "declarations"),
					),
					hardline,
				];

			// declarations
			case "sub":
				return group([
					"sub ",
					node.name,
					" ",
					(path as AstPath<typeof node>).call(print, "returnType"),
					(path as AstPath<typeof node>).call(print, "body"),
				]);
			case "acl":
				return group([
					"acl ",
					node.name,
					" {",
					indent([
						hardline,
						join(line, (path as AstPath<typeof node>).map(print, "entries")),
					]),
					line,
					"}",
				]);
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
				return group(["import ", node.ident, ";"]);
			case "include":
				return group(['include "', node.path.value, '";']);
			case "penaltybox":
			case "ratecounter":
				return group([node.kind, " ", node.name, " {", "}"]);
			case "table":
				return group([
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
				]);
			case "table-entry":
				return group([
					(path as AstPath<typeof node>).call(print, "key"),
					": ",
					(path as AstPath<typeof node>).call(print, "value"),
					",",
				]);
			case "backend":
				return group([
					"backend ",
					node.name,
					" {",
					indent([
						line,
						join(line, (path as AstPath<typeof node>).map(print, "properties")),
					]),
					line,
					"}",
				]);
			case "director":
				return group([
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
					node.properties.length > 0 && node.directions.length > 0 ? line : "",
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
				]);

			// statements
			case "block":
				return group([
					"{",
					indent([
						hardline,
						join(line, (path as AstPath<typeof node>).map(print, "body")),
					]),
					line,
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
				return group([
					"set ",
					(path as AstPath<typeof node>).call(print, "target"),
					" ",
					(path as AstPath<typeof node>).call(print, "operator"),
					" ",
					(path as AstPath<typeof node>).call(print, "value"),
					";",
				]);
			case "unset":
				return group([
					"unset ",
					(path as AstPath<typeof node>).call(print, "target"),
					";",
				]);
			case "add":
				return group([
					"add ",
					(path as AstPath<typeof node>).call(print, "target"),
					" = ",
					(path as AstPath<typeof node>).call(print, "value"),
					";",
				]);
			case "call":
				return group([
					"call ",
					(path as AstPath<typeof node>).call(print, "target"),
					";",
				]);
			case "if":
				return group([
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
				]);
			case "error":
				return group([
					"error ",
					node.status?.toString() ?? "",
					node.message ? " " : "",
					(path as AstPath<typeof node>).call(print, "message"),
					";",
				]);
			case "esi":
				return "esi;";
			case "restart":
				return "restart;";
			case "return":
				return group([
					"return",
					node.value ? " " : "",
					(path as AstPath<typeof node>).call(print, "value"),
					";",
				]);
			case "return-state":
				return group(["return(", node.state, ");"]);
			case "synthetic":
				return group([
					node.base64 ? "synthetic.base64" : "synthetic",
					" ",
					(path as AstPath<typeof node>).call(print, "value"),
					";",
				]);
			case "log":
				return group([
					"log ",
					(path as AstPath<typeof node>).call(print, "message"),
					";",
				]);

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
					join(
						[" +", line],
						(path as AstPath<typeof node>).map(print, "tokens"),
					),
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
		switch (node.kind) {
			case "vcl":
				return ["declarations"];
			case "sub":
				return ["returnType", "body"];
			case "acl":
				return ["entries"];
			case "acl-entry":
				return ["address"];
			case "import":
				return ["ident"];
			case "include":
				return ["path"];
			case "penaltybox":
			case "ratecounter":
				return ["name"];
			case "table":
				return ["type", "entries"];
			case "table-entry":
				return ["key", "value"];
			case "backend":
				return ["properties"];
			case "director":
				return ["properties", "directions"];
			case "declare":
				return ["target", "type"];
			case "set":
				return ["target", "operator", "value"];
			case "unset":
				return ["target"];
			case "add":
				return ["target", "value"];
			case "call":
				return ["target"];
			case "return":
				return ["value"];
			case "block":
				return ["body"];
			case "if":
				return ["condition", "body", "else"];
			case "error":
				return ["message"];
			case "synthetic":
				return ["value"];
			case "log":
				return ["message"];
			case "parenthesized":
				return ["expr"];
			case "binary":
				return ["lhs", "rhs"];
			case "unary":
				return ["rhs"];
			case "string_concat":
				return ["tokens"];
			case "object":
				return ["properties"];
			case "object-property":
				return ["value"];
			case "function-call":
				return ["target", "arguments"];
			case "variable":
				return [];
			case "string":
				return ["tokens"];
			case "!":
			case "!=":
			case "!~":
			case "%=":
			case "&&":
			case "&&=":
			case "&=":
			case "*":
			case "*=":
			case "+":
			case "+=":
			case "-":
			case "-=":
			case "/":
			case "/=":
			case "<":
			case "<<=":
			case "<=":
			case "=":
			case "==":
			case ">":
			case ">=":
			case ">>=":
			case "^=":
			case "bool":
			case "case":
			case "comment_block":
			case "comment_hash":
			case "comment_line":
			case "esi":
			case "float":
			case "heredoc":
			case "integer":
			case "parcent":
			case "quoted-string":
			case "restart":
			case "return-state":
			case "rol=":
			case "ror=":
			case "rtime":
			case "type":
			case "|=":
			case "||":
			case "||=":
			case "~":
				return [];
			default:
				throw new Error(
					`Unknown node: ${JSON.stringify(node satisfies never)}`,
				);
		}
	},
} as const satisfies Printer<FastlyVclNode | undefined>;
