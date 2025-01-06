const fs = require('fs')
const sass = require('sass')
const postcss = require('postcss')
const postcssScss = require('postcss-scss')

const scssFilePath = './src/styles/_tempColors.scss'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

function createTempColorsFile() {
  const colorsContent = fs.readFileSync('./src/styles/_colors.scss', 'utf-8')
  const primitiveColors = colorsContent.match(/(\$[a-zA-Z0-9-]+:.*;)/g).join('\n')
  const palette = colorsContent.match(/(\$palette:.*;)/g).join('\n')
  const paletteDark = colorsContent.match(/(\$paletteDark:.*;)/g).join('\n')
  const primitiveColorsToExport = primitiveColors
    .replace(palette, '')
    .replace(paletteDark, '')
    .replace(/\$/g, '')
    .replace(/;/g, ';')
    .replace(/:/g, ':')

  const tempColorsContent = `
  @import 'colors';

  :export {
    ${primitiveColorsToExport}
    @each $key, $value in $palette {
      @each $subkey, $subvalue in $value {
        --#{$key}-color-#{$subkey}-light: #{$subvalue};
      }
    }

    @each $key, $value in $paletteDark {
      @each $subkey, $subvalue in $value {
        --#{$key}-color-#{$subkey}-dark: #{$subvalue};
      }
    }
  }
  `
  fs.writeFileSync('./src/styles/_tempColors.scss', tempColorsContent, 'utf-8')
}

// Function to compile SCSS to CSS
function compileScss(filePath) {
  const result = sass.compile(filePath, {
    functions: {
      'text-color($arg1, $arg2)': (args) => {
        const colorKey = args[0].assertString('arg1')
        const palette = args[1].assertMap('arg2')
        let currentValue = ''
        for (const [key, value] of palette.contents.entrySeq()) {
          const currentKey = key.toString()
          if (currentKey === 'text') {
            currentValue = value.get(colorKey).toString()
            return new sass.SassString(currentValue)
          }
        }
        return new sass.SassString('transparent')
      },
      'background-color($arg1, $arg2)': (args) => {
        try {
          const colorKey = args[0].assertString('arg1').text;
          const palette = args[1].assertMap('arg2');

          // Find color value in background section
          let colorValue = null;
          palette.contents.forEach((value, key) => {
            if (key.text === 'background') {
              value.contents.forEach((val, k) => {
                if (k.text === colorKey) colorValue = val;
              });
            }
          });

          if (!colorValue) return new sass.SassColor({ r: 0, g: 0, b: 0, a: 1 });
          if (colorValue instanceof sass.SassColor) return colorValue;

          const colorStr = colorValue.toString();

          // Handle named colors
          if (colorStr === 'white') return new sass.SassColor({ r: 255, g: 255, b: 255, a: 1 });
          if (colorStr === 'black') return new sass.SassColor({ r: 0, g: 0, b: 0, a: 1 });
          if (colorStr === 'transparent') return new sass.SassColor({ r: 0, g: 0, b: 0, a: 0 });

          // Handle hex colors
          if (colorStr.startsWith('#')) {
            const rgb = hexToRgb(colorStr);
            return new sass.SassColor({ ...rgb, a: 1 });
          }

          // Default fallback
          return new sass.SassColor({ r: 0, g: 0, b: 0, a: 1 });
        } catch (error) {
          return new sass.SassColor({ r: 0, g: 0, b: 0, a: 1 });
        }
      },
      'border-color($arg1, $arg2)': (args) => {
        const colorKey = args[0].assertString('arg1')
        const palette = args[1].assertMap('arg2')
        let currentValue = ''
        for (const [key, value] of palette.contents.entrySeq()) {
          const currentKey = key.toString()
          if (currentKey === 'border') {
            currentValue = value.get(colorKey).toString()
            return new sass.SassString(currentValue)
          }
        }
        return new sass.SassString('transparent')
      },
      'icon-color($arg1, $arg2)': (args) => {
        const colorKey = args[0].assertString('arg1')
        const palette = args[1].assertMap('arg2')
        let currentValue = ''
        for (const [key, value] of palette.contents.entrySeq()) {
          const currentKey = key.toString()
          if (currentKey === 'icon') {
            currentValue = value.get(colorKey).toString()
            return new sass.SassString(currentValue)
          }
        }
        return new sass.SassString('transparent')
      },
      'adjust($color, $kwargs)': (args) => {
        try {
          const color = args[0].assertColor('color');
          const kwargs = args[1].assertMap('kwargs');
          const alphaAdjust = kwargs.get('alpha')?.assertNumber('alpha')?.value || 0;
          
          return new sass.SassColor({
            r: color.red,
            g: color.green,
            b: color.blue,
            a: Math.max(0, Math.min(1, color.alpha + alphaAdjust))
          });
        } catch (error) {
          console.error('Error in adjust:', error);
          return new sass.SassColor({ r: 0, g: 0, b: 0, a: 1 });
        }
      }
    },
  })
  return result.css.toString()
}

// Function to extract :export block
async function extractExportVariables(css) {
  const root = postcss.parse(css, { syntax: postcssScss })
  const variables = {}

  let isExportBlock = false
  let isFirstLight = false
  let isFirstDark = false

  root.walkRules((rule) => {
    if (rule.selector === ':export') {
      isExportBlock = true

      rule.walkDecls((decl) => {
        if (decl.prop.includes('-light')) {
          if (!isFirstLight) {
            isFirstLight = true
            variables.light = {}
          }
          decl.prop = decl.prop.replace('-light', '')
          variables.light[decl.prop] = decl.value
          return
        }

        if (decl.prop.includes('-dark')) {
          if (!isFirstDark) {
            isFirstDark = true
            variables.dark = {}
          }
          decl.prop = decl.prop.replace('-dark', '')
          variables.dark[decl.prop] = decl.value
          return
        }

        variables[decl.prop] = decl.value
      })
    } else if (isExportBlock && rule.selector === '') {
      return
    }
  })

  return variables
}
// Main function
;(async () => {
  try {
    createTempColorsFile()
    const css = compileScss(scssFilePath)
    const variables = await extractExportVariables(css)

    // Convert the variables to a JavaScript object
    const jsContent = `export default ${JSON.stringify(variables, null, 2)};`

    // add a comment to the top of the file to specify that it is generated
    const comment = '// * IMPORTANT! This file is generated from _colors.scss. Do not modify this file directly.'

    // Write the JavaScript file
    fs.writeFileSync('./src/config/colors.ts', `${comment}\n${jsContent}`, 'utf-8')
        // remove the temporary file
    fs.unlinkSync(scssFilePath)
    console.log('SCSS :export variables have been extracted to _colors.js')
  } catch (error) {
    console.error('Error extracting SCSS :export variables:', error)
  }
})()
