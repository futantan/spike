//
//  ContentView.swift
//  Landmarks
//
//  Created by 傅坦坦 on 2019/11/21.
//  Copyright © 2019 futantan. All rights reserved.
//

import SwiftUI

struct ContentView: View {
  var body: some View {
    VStack {
      MapView().frame(height: 300).edgesIgnoringSafeArea(.top)
      
      CircleImage()
        .offset(y: -130)
        .padding(.bottom, -130)
      
      VStack(alignment: .leading) {
        Text("Turtle Rock")
          .font(.title)
        HStack {
          Text("Joshua Tree National Park")
            .font(.subheadline)
          Spacer()
          Text("California")
            .font(.subheadline)
        }
      }
      .padding()
      
      Spacer()
    }
  }
}

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView()
  }
}
