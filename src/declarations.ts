/* eslint-disable */

declare module "is_js" {
  export const boolean: (a: any) => a is boolean
  export const number: (a: any) => a is number
  export const integer: (a: any) => a is number
  export const string: (a: any) => a is string
  export const array: (a: any) => a is Array<any>
  export const object: (a: any) => a is object
}


declare module "protocol-buffers-encodings" {
  export namespace string {
    export const encode: (val: any, buffer: Buffer, offset?: number) => Buffer
    export const decode: (buf: Buffer | number[], offset?: number) => any
    export const encodingLength: (val: any) => number
  }

  export namespace bytes {
    export const encode: (val: any, buffer: Buffer, offset?: number) => Buffer
    export const decode: (buf: Buffer | number[], offset?: number) => any
    export const encodingLength: (val: any) => number
  }

  export namespace bool {
    export const encode: (val: any, buffer: Buffer, offset?: number) => Buffer
    export const decode: (buf: Buffer | number[], offset?: number) => any
    export const encodingLength: (val: any) => number
  }

  export namespace varint {
    export const encode: (val: any, buffer: Buffer, offset?: number) => Buffer
    export const decode: (buf: Buffer | number[], offset?: number) => any
    export const encodingLength: (val: any) => number
  }
}
