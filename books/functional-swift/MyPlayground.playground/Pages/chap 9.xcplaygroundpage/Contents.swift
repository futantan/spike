import Foundation

indirect enum BinarySearchTree<Element: Comparable> {
  case Leaf
  case Node(BinarySearchTree<Element>, Element, BinarySearchTree<Element>)
}

extension BinarySearchTree {
  init() {
    self = .Leaf
  }
  
  init(_ value: Element) {
    self = .Node(.Leaf, value, .Leaf)
  }
  
  var count: Int {
    switch self {
    case .Leaf:
      return 0
    case let .Node(left, _, right):
      return 1 + left.count + right.count
    }
  }
  
  var elements: [Element] {
    switch self {
    case .Leaf:
      return []
    case let .Node(left, x, right):
      return left.elements + [x] + right.elements
    }
  }
  
  var isEmpty: Bool {
    if case .Leaf = self {
      return true
    }
    return false
  }
  
  func contains(_ x: Element) -> Bool {
    switch self {
    case .Leaf:
      return false
    case let .Node(_, y, _) where x == y:
      return true
    case let .Node(left, y, _) where x < y:
      return left.contains(x)
    case let .Node(_, y, right) where x > y:
      return right.contains(x)
    default:
      fatalError("The impossible occurred")
    }
  }
  
  var isBST: Bool {
    switch self {
    case .Leaf:
      return true
    case let .Node(left, x, right):
      return left.elements.allSatisfy { y in y < x}
        && right.elements.allSatisfy { y in y > x }
        && left.isBST
        && right.isBST
    }
  }
  
  mutating func insert(_ x: Element) {
    switch self {
    case .Leaf:
      self = BinarySearchTree(x)
    case .Node(var left, let y, var right):
      if x < y { left.insert(x) }
      if x > y { right.insert(x) }
      self = .Node(left, y, right)
    }
  }
}













extension Array {
  var decompose: (Element, [Element])? {
    return isEmpty ? nil : (self[startIndex], Array(self.dropFirst()))
  }
}

struct Trie<Element: Hashable> {
  let isElement: Bool
  let children: [Element: Trie<Element>]
}

extension Trie {
  init() {
    isElement = false
    children = [:]
  }
  
  var elements: [[Element]] {
    var result: [[Element]] = isElement ? [[]] : []
    for (key, value) in children {
      result += value.elements.map { [key] + $0 }
    }
    return result
  }
  
  func lookup(_ key: [Element]) -> Bool {
    guard let (head, tail) = key.decompose else { return isElement }
    guard let subtrie = children[head] else { return false }
    return subtrie.lookup(tail)
  }
  
  func withPrefix(_ prefix: [Element]) -> Trie<Element>? {
    guard let (head, tail) = prefix.decompose else { return self }
    guard let remainder = children[head] else { return nil }
    return remainder.withPrefix(tail)
  }
  
  func autocomplete(_ key: [Element]) -> [[Element]] {
    return withPrefix(key)?.elements ?? []
  }
  
  init(_ key: [Element]) {
    if let (head, tail) = key.decompose {
      let children = [head: Trie(tail)]
      self = Trie(isElement: false, children: children)
    } else {
      self = Trie(isElement: true, children: [:])
    }
  }
  
  func insert(_ key: [Element]) -> Trie<Element> {
    guard let (head, tail) = key.decompose else {
      return Trie(isElement: true, children: children)
    }
    var newChildren = children
    if let nextTrie = children[head] {
      newChildren[head] = nextTrie.insert(tail)
    } else {
      newChildren[head] = Trie(tail)
    }
    return Trie(isElement: isElement, children: newChildren)
  }
}

func buildStringTrie(words: [String]) -> Trie<Character> {
  return words.reduce(Trie<Character>()) { (trie, word) in
    return trie.insert(Array(word))
  }
}

func autocompleteString(knownWords: Trie<Character>, word: String) -> [String] {
  let chars = Array(word)
  let completed = knownWords.autocomplete(chars)
  return completed.map { (chars) in
    word + String(chars)
  }
}

let contents = ["cat", "car", "cart", "dog"]
let trieOfWords = buildStringTrie(words: contents)
autocompleteString(knownWords: trieOfWords, word: "car")

