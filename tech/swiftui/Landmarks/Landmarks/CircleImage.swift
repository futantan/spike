//
//  CircleImage.swift
//  Landmarks
//
//  Created by 傅坦坦 on 2019/11/21.
//  Copyright © 2019 futantan. All rights reserved.
//

import SwiftUI

struct CircleImage: View {
  var body: some View {
    Image("turtlerock")
      .clipShape(Circle())
      .overlay(Circle().stroke(Color.white, lineWidth: 4))
      .shadow(radius: 10)
  }
}

struct SwiftUIView_Previews: PreviewProvider {
  static var previews: some View {
    CircleImage()
  }
}
