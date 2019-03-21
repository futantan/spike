class Number < Struct.new(:value)
  def to_ruby
    "-> e { #{value.inspect} }"
  end
end

class Boolean < Struct.new(:value)
  def to_ruby
    "-> e { #{value.inspect} }"
  end
end

class Variable < Struct.new(:value)
  def to_ruby
    "-> e { e[#{value.inspect}]}"
  end
end

class Add < Struct.new(:left, :right)
  def to_ruby
    "-> e { (#{left.to_ruby}).call(e) + (#{right.to_ruby}).call(e) }"
  end
end

class Multiply < Struct.new(:left, :right)
  def to_ruby
    "-> e { (#{left.to_ruby}).call(e) * (#{right.to_ruby}).call(e) }"
  end
end

class LessThan < Struct.new(:left, :right)
  def to_ruby
    "-> e { (#{left.to_ruby}).call(e) < (#{right.to_ruby}).call(e) }"
  end
end

Number.new(5).to_ruby
Boolean.new(false).to_ruby

proc = eval(Number.new(5).to_ruby)
puts proc.call({})
puts eval(Variable.new(:x).to_ruby).call({ x: 7})
puts eval(Add.new(Variable.new(:x), Number.new(1)).to_ruby).call({ x: 3})
