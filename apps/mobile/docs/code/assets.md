# Assets

## SVG icons

The SVG icons are stored in the `assets/icons` folder and are actually React components. This way we can apply styles (size, color, hover style, ...) to them using Restyle.

### Adding new icons

To add a new icon, copy it from Figma and use [this page](https://react-svgr.com/playground/) to convert it to a React Native component. If a svg icon has a fill color, it should be replaced with the `currentColor` value if it's black or white. This way you can style it with passed-in color.

## Non-vector images

The images are stored in the `assets/` folder. The folder structure should be split further under this folder, just like with icons.

### Image optimization

We are using `expo-image` library for images instead of the built-in Image component from React Native. It allows you to achieve better native performance and has additional features like blur-in.
