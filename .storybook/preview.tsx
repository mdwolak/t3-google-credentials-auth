import { Inter, Roboto_Mono } from "next/font/google";
import React from "react";

import type { Preview } from "@storybook/react";

import "../src/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [
    //should follow root layout
    (Story) => (
      <div className={`font-sans ${inter.variable} ${roboto_mono.variable}`}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
