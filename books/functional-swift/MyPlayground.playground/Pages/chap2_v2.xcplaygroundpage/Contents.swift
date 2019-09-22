typealias Distance = Double

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

struct Region {
    let lookup: (Position) -> Bool
    
    func shift(offset: Position) -> Region {
        return Region { point in self.lookup(point.minus(offset)) }
    }

    func invert() -> Region {
        return Region { point in !self.lookup(point) }
    }

    func intersection(_ region2: Region) -> Region {
        return Region { point in self.lookup(point) && region2.lookup(point) }
    }

    func union(_ region2: Region) -> Region {
        return Region { point in self.lookup(point) || region2.lookup(point) }
    }

    func difference(minus: Region) -> Region {
        return self.intersection(minus.invert())
    }

}

func circle(_ radius: Distance) -> Region {
    return Region { point in point.length <= radius }
}

func circle(_ radius: Distance, center: Position) -> Region {
    return Region { point in point.minus(center).length <= radius }
}

struct Position {
    var x: Double
    var y: Double
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

//        let rangeRegion = difference(circle(firingRange), minus: circle(unsafeRange))
//        let fireRegion = shift(region: rangeRegion, offset: position)
//        let friendlyRegion = shift(region: circle(unsafeRange), offset: friendly.position)
//        let resultRegion = difference(fireRegion, minus: friendlyRegion)
//        return resultRegion(target.position)
        
//        let rangeRegion = circle(firingRange).difference(minus: circle(unsafeRange))
//        let fireRegion = rangeRegion.shift(offset: position)
//        let fiendlyRegion = circle(unsafeRange).shift(offset: friendly.position)
//        let resultRegion = fireRegion.difference(minus: fiendlyRegion)
//        return resultRegion.lookup(target.position)
        
        return circle(firingRange)
            .difference(minus: circle(unsafeRange))
            .shift(offset: position)
            .difference(minus: circle(unsafeRange)
            .shift(offset: friendly.position))
            .lookup(target.position)
    }
}
