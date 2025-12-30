/**
 * TextEncoder Polyfill
 * 为小程序环境提供 TextEncoder 支持
 */

/**
 * 初始化 TextEncoder polyfill
 */
export function setupTextEncoderPolyfill() {
  if (typeof TextEncoder === 'undefined') {
    (globalThis as any).TextEncoder = class TextEncoder {
      encoding = 'utf-8'

      encode(str: string): Uint8Array {
        const utf8: number[] = []
        for (let i = 0; i < str.length; i++) {
          let charcode = str.charCodeAt(i)
          if (charcode < 0x80) {
            utf8.push(charcode)
          } else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f))
          } else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(
              0xe0 | (charcode >> 12),
              0x80 | ((charcode >> 6) & 0x3f),
              0x80 | (charcode & 0x3f)
            )
          } else {
            i++
            charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff))
            utf8.push(
              0xf0 | (charcode >> 18),
              0x80 | ((charcode >> 12) & 0x3f),
              0x80 | ((charcode >> 6) & 0x3f),
              0x80 | (charcode & 0x3f)
            )
          }
        }
        return new Uint8Array(utf8)
      }
    }
  }

  if (typeof TextDecoder === 'undefined') {
    (globalThis as any).TextDecoder = class TextDecoder {
      encoding = 'utf-8'

      decode(bytes: Uint8Array): string {
        let result = ''
        let i = 0
        while (i < bytes.length) {
          const byte = bytes[i]
          if (byte < 0x80) {
            result += String.fromCharCode(byte)
            i++
          } else if ((byte & 0xe0) === 0xc0) {
            result += String.fromCharCode(((byte & 0x1f) << 6) | (bytes[i + 1] & 0x3f))
            i += 2
          } else if ((byte & 0xf0) === 0xe0) {
            result += String.fromCharCode(
              ((byte & 0x0f) << 12) | ((bytes[i + 1] & 0x3f) << 6) | (bytes[i + 2] & 0x3f)
            )
            i += 3
          } else if ((byte & 0xf8) === 0xf0) {
            const codepoint =
              ((byte & 0x07) << 18) |
              ((bytes[i + 1] & 0x3f) << 12) |
              ((bytes[i + 2] & 0x3f) << 6) |
              (bytes[i + 3] & 0x3f)
            result += String.fromCodePoint(codepoint)
            i += 4
          } else {
            i++
          }
        }
        return result
      }
    }
  }
}

