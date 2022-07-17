package token

type TokenType string

type Token struct {
	Type    TokenType
	Literal string
}

const (
	ILLEGAL = "ILLEGAL" // 表示遇到未知的词法单元或字符
	EOF     = "EOF"     // 文件结尾

	// 标识符 + 字面量
	IDENT = "IDENT" // add, foobar, x, y...
	INT   = "INT"   // 123456

	// 运算符
	ASSIGN = "="
	PLUS   = "+"

	// 分隔符
	COMMA     = ","
	SEMICOLON = ";"

	LPAREN = "("
	RPAREN = ")"
	LBRACE = "{"
	RBRACE = "}"

	// 关键字
	FUNCTION = "FUNCTION"
	LET      = "LET"
)
