import type {
	AclEntry,
	AssignmentOperator,
	BinaryOperator,
	Case,
	Comment,
	Declaration,
	Expr,
	Literal,
	ObjectProperty,
	Stmt,
	StringToken,
	TableEntry,
	Type,
	UnaryOperator,
	VCL,
	Variable,
} from "@vcltk/ast";

export type FastlyVclNode =
	| AclEntry
	| AssignmentOperator
	| BinaryOperator
	| Case
	| Comment
	| Declaration
	| Expr
	| Literal
	| ObjectProperty
	| Stmt
	| StringToken
	| TableEntry
	| Type
	| UnaryOperator
	| Variable
	| VCL;
