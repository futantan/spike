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

Number.new(5).to_ruby
Boolean.new(false).to_ruby

proc = eval(Number.new(5).to_ruby)
puts proc.call({})
