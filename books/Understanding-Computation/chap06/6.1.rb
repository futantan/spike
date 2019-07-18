(1..100).map do |n|
  if (n % 15).zero?
    'FuzzBuzz'
  elsif (n % 3).zero?
    'Fizz'
  else
    n.to_s
  end
end

ZERO  = -> p { -> x { x } }
ONE   = -> p { -> x { p[x]} }
TWO   = -> p { -> x { p[p[x]]} }
THREE = -> p { -> x { p[p[p[x]]]} }
FIVE  = -> p { -> x { p[p[p[p[p[x]]]]] } }
FIFTEEN = -> p { -> x { p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[x]]]]]]]]]]]]]]] } }
HUNDRED = -> p { -> x { p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[x]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] } }

def to_integer(proc)
  proc[-> n { n + 1 }][0]
end

# puts to_integer(ONE)

TRUE  = -> x { -> y { x }}
FALSE = -> x { -> y { y }}
IF    = -> b { b }
# IF = -> b { -> x { -> y { b[x][y] }}}

def to_boolean(proc)
  IF[proc][true][false]
end
# puts to_boolean(TRUE)
# puts to_boolean(FALSE)

IS_ZERO = -> n { n[-> x {FALSE}][TRUE] }
# puts to_boolean(IS_ZERO[ZERO])
# puts to_boolean(IS_ZERO[THREE])

PAIR  = -> x { -> y { -> f { f[x][y] }}}
LEFT  = -> p { p[-> x { -> y { x }}]}
RIGHT = -> p { p[-> x { -> y { y }}]}

# my_pair = PAIR[THREE][FIVE]
# puts to_integer(LEFT[my_pair])

INCREMENT = -> n { -> p { -> x { p[n[p][x]] } } }
SLIDE     = -> p { PAIR[RIGHT[p]][INCREMENT[RIGHT[p]]]}
DECREMENT = -> n { LEFT[n[SLIDE][PAIR[ZERO][ZERO]]]}

# puts to_integer(DECREMENT[FIFTEEN])

ADD      = -> m { -> n { n[INCREMENT][m] }}
SUBTRACT = -> m { -> n { n[DECREMENT][m] }}
MULTIPLY = -> m { -> n { n[ADD[m]][ZERO] }}
POWER    = -> m { -> n { n[MULTIPLY[m]][ONE] }}

IS_LESS_OR_EQUAL = -> m { -> n { IS_ZERO[SUBTRACT[m][n]]}}
# puts to_boolean(IS_LESS_OR_EQUAL[ONE][TWO])
# puts to_boolean(IS_LESS_OR_EQUAL[TWO][TWO])
# puts to_boolean(IS_LESS_OR_EQUAL[THREE][TWO])

# MOD = -> m { -> n {
#   IF[IS_LESS_OR_EQUAL[n][m]][
#     -> x {
#       MOD[SUBTRACT[m][n]][n][x]
#     }
#   ][
#     m
#   ]
# }}

Z = -> f { -> x { f[-> y { x[x][y] }] }[-> x { f[-> y { x[x][y] }] }] }
MOD = Z[-> f { -> m { -> n {
  IF[IS_LESS_OR_EQUAL[n][m]][
    -> x {
      f[SUBTRACT[m][n]][n][x]
    }
  ][
    m
  ]
}}}]

# puts to_integer(MOD[THREE][TWO])
# puts to_integer(MOD[POWER[THREE][THREE]][ADD[THREE][TWO]])

EMPTY    = PAIR[TRUE][TRUE]
UNSHIFT  = -> l { -> x {
  PAIR[FALSE][PAIR[x][l]]
}}
IS_EMPTY = LEFT
FIRST    = -> l { LEFT[RIGHT[l]] }
REST     = -> l { RIGHT[RIGHT[l]] }

my_list = UNSHIFT[
  UNSHIFT[
    UNSHIFT[EMPTY][THREE]
  ][TWO]
][ONE]

# puts to_integer(FIRST[my_list])
# puts to_integer(FIRST[REST[my_list]])
# puts to_integer(FIRST[REST[REST[my_list]]])
# puts to_boolean(IS_EMPTY[my_list])
# puts to_boolean(IS_EMPTY[EMPTY])
def to_array(proc)
  array = []

  until to_boolean(IS_EMPTY[proc])
    array.push(FIRST[proc])
    proc = REST[proc]
  end

  array
end

# puts to_array(my_list).map { |p| to_integer(p) }

# def range(m, n)
#   if m <= n
#     range(m + 1, n).unshift(m)
#   else
#     []
#   end
# end
# puts range(1,5)

RANGE = Z[
  -> f {
    -> m { -> n {
      IF[IS_LESS_OR_EQUAL[m][n]][
        -> x {
          UNSHIFT[f[INCREMENT[m]][n]][m][x]
        }
      ][
        EMPTY
      ]
    }}
  }
]

# my_range = RANGE[ONE][FIVE]
# puts to_array(my_range).map { |p| to_integer(p) }

FOLD =
  Z[ -> f {
    -> l { -> x { -> g {
      IF[IS_EMPTY[l]][
        x
      ][
        -> y {
          g[f[REST[l]][x][g]][FIRST[l]][y]
        }
      ]
    }}}
  }
]
# puts to_integer(FOLD[RANGE[ONE][FIVE]][ZERO][ADD])
# puts to_integer(FOLD[RANGE[ONE][FIVE]][ONE][MULTIPLY])

MAP = -> k { -> f {
  FOLD[k][EMPTY][
    -> l { -> x { UNSHIFT[l][f[x]]}}
  ]
}}
# my_list = MAP[RANGE[ONE][FIVE]][INCREMENT]
# puts to_array(my_list).map { |p| to_integer(p) }


TEN = MULTIPLY[TWO][FIVE]
B   = TEN
F   = INCREMENT[B]
I   = INCREMENT[F]
U   = INCREMENT[I]
ZED = INCREMENT[U]


a = MAP[RANGE[ONE][HUNDRED]][-> n {
  IF[IS_ZERO[MOD[n][FIFTEEN]]][
    'FuzzBuzz'
  ][IF[IS_ZERO[MOD[n][THREE]]][
   'Fizz'
  ][IF[IS_ZERO[MOD[n][FIVE]]][
    'Buzz'
  ][
    n.to_s
  ]]]
}]

puts a
