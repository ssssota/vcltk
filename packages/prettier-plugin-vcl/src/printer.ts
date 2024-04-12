import type { AstPath, Printer } from "prettier";
import { doc } from "prettier";
import type { FastlyVclNode } from "./types.js";

const { group, indent, join, line, softline, hardline } = doc.builders;

export const printer: Printer<FastlyVclNode | undefined> = {
	print(path, _options, print) {
		const node = path.node;
		if (node === undefined) return "";
		switch (node.kind) {
			case "vcl":
				return join(
					[line, line],
					(path as AstPath<typeof node>).map(print, "declarations"),
				);

			// declarations
			case "sub":
				return group([
					"sub ",
					node.name,
					" ",
					(path as AstPath<typeof node>).call(print, "returnType"),
					"{",
					indent([
						hardline,
						join(line, (path as AstPath<typeof node>).map(print, "body")),
					]),
					line,
					"}",
				]);
			case "acl":
				return group([
					"acl ",
					node.name,
					" {",
					indent([
						line,
						join(line, (path as AstPath<typeof node>).map(print, "entries")),
					]),
					line,
					"}",
				]);
			case "acl-entry":
				return group([
					node.negated ? "! " : "",
					'"',
					node.address,
					'"',
					node.cidr ? `/${node.cidr}` : "",
					";",
				]);
			case "import":
				return group(["import ", node.ident, ";"]);
			case "include":
				return group(['include "', node.path, '";']);
			case "penaltybox":
			case "ratecounter":
				return group([node.kind, " ", node.name, " {", "}"]);
			case "table":
				return group([
					"table ",
					node.name,
					" ",
					(path as AstPath<typeof node>).call(print, "type"),
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
					indent([
						line,
						join(line, (path as AstPath<typeof node>).map(print, "properties")),
					]),
					line,
					indent([
						line,
						join(line, (path as AstPath<typeof node>).map(print, "directions")),
					]),
					line,
					"}",
				]);

			// statements
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
					(path as AstPath<typeof node>).call(print, "condition"),
					") {",
					indent([
						hardline,
						join(line, (path as AstPath<typeof node>).map(print, "body")),
					]),
					line,
					"}",
					(path as AstPath<typeof node>).call(print, "else"),
				]);
			case "else":
				return group([
					"else {",
					indent([
						hardline,
						join(line, (path as AstPath<typeof node>).map(print, "body")),
					]),
					line,
					"}",
				]);
			case "error":
				return group([
					"error ",
					node.status?.toString() ?? "",
					(path as AstPath<typeof node>).call(print, "message"),
					";",
				]);
			case "esi":
				return "esi;";
			case "restart":
				return "restart;";
			case "return":
				return "return;";
			case "synthetic":
				return group([
					node.base64 ? "synthetic.base64" : "synthetic",
					(path as AstPath<typeof node>).call(print, "value"),
				]);
			case "log":
				return group([
					"log ",
					(path as AstPath<typeof node>).call(print, "message"),
				]);

			// expressions
			case "binary":
				return group([
					(path as AstPath<typeof node>).call(print, "lhs"),
					" ",
					(path as AstPath<typeof node>).call(print, "operator"),
					" ",
					(path as AstPath<typeof node>).call(print, "rhs"),
				]);
			case "unary":
				return group([
					(path as AstPath<typeof node>).call(print, "operator"),
					(path as AstPath<typeof node>).call(print, "rhs"),
				]);
			case "string_concat":
				return group(
					join(" + ", (path as AstPath<typeof node>).map(print, "tokens")),
				);
			// literals
			case "object":
				return group([
					"{",
					indent([
						softline,
						join(
							softline,
							(path as AstPath<typeof node>).map(print, "properties"),
						),
					]),
					softline,
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
				return [
					node.name,
					node.properties.length > 0 ? [".", join(".", node.properties)] : [],
					node.subField ? [":", node.subField] : [],
				];
			case "string":
				return join(
					" ",
					node.tokens.map((t) => `"${t}"`),
				);
			case "rtime":
				return [node.value.toString(), node.unit];
			case "integer":
				return node.value.toString();
			case "float":
				return node.value.toString();
			case "bool":
				return node.value ? "true" : "false";
			case "parcent":
				return `${node.value}%`;

			// types
			case "ACL":
			case "BACKEND":
			case "BOOL":
			case "FLOAT":
			case "ID":
			case "INTEGER":
			case "IP":
			case "RTIME":
			case "STRING":
			case "TIME":
			case "VOID":
				return node.kind;
			case "UNKNOWN":
				return node.value;

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

			case "case":
				throw new Error(`${node.kind} is not supported yet.`);
			default:
				throw new Error(
					`Unknown node: ${JSON.stringify(node satisfies never)}`,
				);
		}
	},
};
