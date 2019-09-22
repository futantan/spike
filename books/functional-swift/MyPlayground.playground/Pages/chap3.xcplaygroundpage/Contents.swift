import Cocoa
import PlaygroundSupport

typealias Filter = (CIImage) -> CIImage

func blur(radius: Double) -> Filter {
    return { image in
        let parameters = [
            kCIInputRadiusKey: radius,
            kCIInputImageKey: image
        ] as [String : Any]
        guard let filter = CIFilter(name: "CIGaussianBlur", parameters: parameters) else { fatalError() }
        guard let outputImage = filter.outputImage else { fatalError() }
        return outputImage
    }
}

func colorGenerator(color: NSColor) -> Filter {
    return { _ in
        guard let c = CIColor(color: color) else { fatalError() }
        let parameters = [kCIInputColorKey: c]
        guard let filter = CIFilter(name: "CIConstantColorGenerator", parameters: parameters) else { fatalError() }
        guard let outputImage = filter.outputImage else { fatalError() }
        return outputImage
    }
}

func compositeSourceOver(overlay: CIImage) -> Filter {
    return { image in
        let parameters = [
            kCIInputBackgroundImageKey: image,
            kCIInputImageKey: overlay
        ]
        guard let filter = CIFilter(name: "CISourceOverCompositing", parameters: parameters) else { fatalError() }
        guard let outputImage = filter.outputImage else { fatalError() }
        let cropRect = image.extent
        return outputImage.cropped(to: cropRect)
    }
}

func colorOverlay(color: NSColor) -> Filter {
    return { image in
        let overlay = colorGenerator(color: color)(image)
        return compositeSourceOver(overlay: overlay)(image)
    }
}

let url = URL(string: "https://cdn.pixabay.com/photo/2018/12/18/10/16/pathway-3882061_960_720.jpg")!
let image = CIImage(contentsOf: url)!

let blurRadius = 5.0
let overlayColor = NSColor.red.withAlphaComponent(0.2)
//let blurredImage = blur(radius: blurRadius)(image)
//let overlaidImage = colorOverlay(color: overlayColor)(blurredImage)

//let result = colorOverlay(color: overlayColor)(blur(radius: blurRadius)(image))

//func composeFilters(_ filter1: @escaping Filter, _ filter2: @escaping Filter) -> Filter {
//    return { image in filter2(filter1(image)) }
//}
//let result = composeFilters(blur(radius: blurRadius), colorOverlay(color: overlayColor))(image)

infix operator >>>: ComposePrecedence
precedencegroup ComposePrecedence {
    associativity: left
}
func >>> (filter1: @escaping Filter, filter2: @escaping Filter) -> Filter {
    return { image in filter2(filter1(image)) }
}
let myFilter = blur(radius: blurRadius) >>> colorOverlay(color: overlayColor)
