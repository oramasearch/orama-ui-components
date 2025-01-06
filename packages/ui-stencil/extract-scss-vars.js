const fs = require('fs')
const sass = require('sass')
const postcss = require('postcss')
const postcssScss = require('postcss-scss')

const scssFilePath = './src/styles/_tempColors.scss'

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
      },
      'background-color($arg1, $arg2)': (args) => {
        const colorKey = args[0].assertString('arg1')
        const palette = args[1].assertMap('arg2')
        let currentValue = ''
        for (const [key, value] of palette.contents.entrySeq()) {
          const currentKey = key.toString()
          if (currentKey === 'background') {
            currentValue = value.get(colorKey).toString()
            return new sass.SassString(currentValue)
          }
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
      },
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
