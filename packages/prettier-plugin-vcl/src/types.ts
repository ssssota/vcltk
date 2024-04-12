import type {
	AclEntry,
	AssignmentOperator,
	BinaryOperator,
	Case,
	Declaration,
	Expr,
	Literal,
	ObjectProperty,
	Stmt,
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
	| Declaration
	| Expr
	| Literal
	| ObjectProperty
	| Stmt
	| TableEntry
	| Type
	| UnaryOperator
	| Variable
	| VCL;
