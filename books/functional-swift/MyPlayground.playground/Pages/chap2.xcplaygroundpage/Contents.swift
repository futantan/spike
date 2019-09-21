import Cocoa

typealias Distance = Double
typealias Region = (Position) -> Bool

struct Position {
    var x: Double
    var y: Double
}

extension Position {
    func inRange(range: Distance) -> Bool {
        return sqrt(x * x + y * y) <= range
    }

    func minus(_ p: Position) -> Position {
        return Position(x: x - p.x, y: y - p.y)
    }
    var length: Double {
        return sqrt(x * x + y * y)
    }
}

func shift(region: @escaping Region, offset: Position) -> Region {
    return { point in region(point.minus(offset)) }
}

func invert(_ region: @escaping Region) -> Region {
    return { point in !region(point) }
}

func intersection(_ region1: @escaping Region, _ region2: @escaping Region) -> Region {
    return { point in region1(point) && region2(point) }
}

func union(region1: @escaping Region, _ region2: @escaping Region) -> Region {
    return { point in region1(point) || region2(point) }
}

func difference(_ region: @escaping Region, minus: @escaping Region) -> Region {
    return intersection(region, invert(minus))
}

func circle(_ radius: Distance) -> Region {
    return { point in point.length <= radius }
}

func circle(_ radius: Distance, center: Position) -> Region {
    return { point in point.minus(center).length <= radius }
}

struct Ship {
    var position: Position
    var firingRange: Distance
    var unsafeRange: Distance
}

extension Ship {
    func canSafelyEnageShip(target: Ship, friendly: Ship) -> Bool {
//        let targetDistance = target.position.minus(position).length
//        let friendlyDistance = friendly.position.minus(target.position).length
//
//        return targetDistance <= firingRange
//            && targetDistance > unsafeRange
//            && friendlyDistance > unsafeRange

        let rangeRegion = difference(circle(firingRange), minus: circle(unsafeRange))
        let fireRegion = shift(region: rangeRegion, offset: position)
        let friendlyRegion = shift(region: circle(unsafeRange), offset: friendly.position)
        let resultRegion = difference(fireRegion, minus: friendlyRegion)
        return resultRegion(target.position)
    }
}
