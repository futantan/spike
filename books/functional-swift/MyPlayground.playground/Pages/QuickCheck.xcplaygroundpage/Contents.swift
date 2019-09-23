import Foundation

protocol Arbitrary {
    static func arbitrary() -> Self
}

extension Int: Arbitrary {
    static func arbitrary() -> Int {
        return Int(arc4random())
    }
}

extension Character: Arbitrary {
    static func arbitrary() -> Character {
        return Character(UnicodeScalar(Int.random(in: 65...90))!)
    }
}

func tabulate<A>(times: Int, transform: (Int) -> A) -> [A] {
    return (0..<times).map(transform)
}

extension Int {
    static func random(from: Int, to: Int) -> Int {
        return Int.random(in: from...to)
    }
}

extension String: Arbitrary {
    static func arbitrary() -> String {
        let randomLength = Int.random(from: 0, to: 40)
        let randomCharacters = tabulate(times: randomLength) { (_) in
            Character.arbitrary()
        }
        return String(randomCharacters)
    }
}

func check1<A: Arbitrary>(message: String, _ property: (A) -> Bool) -> () {
    let numberOfIterations = 100
    for _ in 0..<numberOfIterations {
        let value = A.arbitrary()
        guard property(value) else {
            print("\"\(message)\" doesn't hold: \(value)")
            return
        }
    }
    print("\"\(message)\" passed \(numberOfIterations) tests.")
}

extension CGSize {
    var area: CGFloat {
        return width * height
    }
}

//extension CGFloat {
//
//}
//
//extension CGSize: Arbitrary {
//    static func arbitrary() -> CGSize {
//        return CGSize(width: CGFloat.a, height: <#T##CGFloat#>)
//    }
//}
