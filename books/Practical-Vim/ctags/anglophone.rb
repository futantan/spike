#---
# Excerpted from "Practical Vim",
# published by The Pragmatic Bookshelf.
# Copyrights apply to this code. It may not be used to create training material, 
# courses, books, articles, and the like. Contact us if you are in doubt.
# We make no guarantees that this code is fit for any purpose. 
# Visit http://www.pragmaticprogrammer.com/titles/dnvim for more book information.
#---
require './speaker.rb'
class Anglophone < Speaker
  def speak
    puts "Hello, my name is #{@name}"
  end
end
Anglophone.new('Jack').speak
