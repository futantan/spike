package lexer

type Lexer struct {
	input        string
	position     int  // 所输入字符串中的当前位置（指向当前字符）
	readPosition int  // 所输入字符串中的当前读取位置（指向当前字符之后的一个字符）
	ch           byte // 当前正在查看的字符
}

func New(input string) *Lexer {
	l := &Lexer{input: input}
	return l
}
