import type { ClassDeclaration, EnumDeclaration, FunctionDeclaration, InterfaceDeclaration, TypeAliasDeclaration, VariableDeclaration } from 'ts-morph'
import { describe, expect, it } from 'vitest'
import { insertClassDeclaration, insertEnumDeclaration, insertFunctionDeclaration, insertInterfaceDeclaration, insertTypeAliasDeclaration, insertVariableDeclaration } from '../src/declaration'
import { getInfoFromText } from './helper/getInfoFromText'

describe('declaration', () => {
  describe('insertVariableDeclaration', () => {
    function doTest(startCode: string, declarartion: VariableDeclaration, expected: string) {
      const { sourceFile } = getInfoFromText(startCode)
      insertVariableDeclaration(0, declarartion, sourceFile)
      expect(sourceFile.getFullText()).toMatch(expected)
    }
    it('should insert variable declaration at the beginning of the file', () => {
      const { sourceFile } = getInfoFromText('export const b = 1;')
      doTest('export const a = 1;', sourceFile.getVariableDeclaration('b')!, `const b = 1;
export const a = 1;`)
    })
    it('should insert string variable declaration at the beginning of the file', () => {
      const { sourceFile } = getInfoFromText('export const b = \'1\';')
      doTest('export const a = 1;', sourceFile.getVariableDeclaration('b')!, `const b = '1';
export const a = 1;`)
    })
    it('should insert variable declaration with variable type at the end of the file', () => {
      const { sourceFile } = getInfoFromText('export const b: number = 1;')
      doTest('export const a = 1;', sourceFile.getVariableDeclaration('b')!, `const b: number = 1;
export const a = 1;`)
    })
  })
  describe('insertFunctionDeclaration', () => {
    function doTest(startCode: string, declarartion: FunctionDeclaration, expected: string) {
      const { sourceFile } = getInfoFromText(startCode)
      insertFunctionDeclaration(0, declarartion, sourceFile)
      expect(sourceFile.getFullText()).toMatch(expected)
    }
    it('should insert function declaration at the beginning of the file', () => {
      const { sourceFile } = getInfoFromText('export function b() {}')
      doTest('export function a() {}', sourceFile.getFunction('b')!, `function b(): void {
}

export function a() {}`)
    })
    it('should insert function declaration with return type at the end of the file', () => {
      const { sourceFile } = getInfoFromText('export function b(): number {}')
      doTest('export function a() {}', sourceFile.getFunction('b')!, `function b(): number {
}

export function a() {}`)
    })
  })
  describe('insertEnumDeclaration', () => {
    function doTest(startCode: string, declarartion: EnumDeclaration, expected: string) {
      const { sourceFile } = getInfoFromText(startCode)
      insertEnumDeclaration(0, declarartion, sourceFile)
      expect(sourceFile.getFullText()).toMatch(expected)
    }
    it('should insert enum declaration at the beginning of the file', () => {
      const { sourceFile } = getInfoFromText('export enum b {b1, b2} export enum a {a1, a2}')
      doTest('export enum a {}', sourceFile.getEnum('b')!, `enum b {
    b1,
    b2
}

export enum a {}`)
    })
    it('should insert enum declaration with members and member value at the end of the file', () => {
      const { sourceFile } = getInfoFromText('export enum b {b1 = \'b1\', b2} export enum a {a1, a2}')
      doTest('export enum a {}', sourceFile.getEnum('b')!, `enum b {
    b1 = 'b1',
    b2
}

export enum a {}`)
    })
  })
  describe('insertClassDeclaration', () => {
    function doTest(startCode: string, declarartion: ClassDeclaration, expected: string) {
      const { sourceFile } = getInfoFromText(startCode)
      insertClassDeclaration(0, declarartion, sourceFile)
      expect(sourceFile.getFullText()).toMatch(expected)
    }
    it('should insert class declaration at the beginning of the file', () => {
      const { sourceFile } = getInfoFromText('export class b {}')
      doTest('export class a {}', sourceFile.getClass('b')!, `class b {
}

export class a {}`)
    })
    it('should insert class declaration with extends at the end of the file', () => {
      const { sourceFile } = getInfoFromText('export class b extends a {}')
      doTest('export class a {}', sourceFile.getClass('b')!, `class b extends a {
}

export class a {}`)
    })
    it('should insert class declaration with implements at the end of the file', () => {
      const { sourceFile } = getInfoFromText('export class b implements a {} export class a {}')
      doTest('export class a {}', sourceFile.getClass('b')!, `class b implements a {
}

export class a {}`)
    })
    it('should insert class declaration with methods and properties at the end of the file', () => {
      const { sourceFile } = getInfoFromText(`export class b {
        public a() {}
        b: number = 1;
        c = "1"
      }`)
      doTest('export class a {}', sourceFile.getClass('b')!, `class b {
    b: number = 1;
    c: string = "1";

    a(): void {
    }
}

export class a {}`,
      )
    })
    it('should insert class declaration with ctors at the end of the file', () => {
      const { sourceFile } = getInfoFromText(`export class b {
        constructor(public readonly a = 1) {
          this.a = a
        }
      }`)
      doTest('export class a {}', sourceFile.getClass('b')!, `class b {
    public constructor(public readonly a: number = 1) {
        this.a = a
    }
}

export class a {}`,
      )
    })
  })
  describe('insertInterfaceDeclaration', () => {
    function doTest(startCode: string, declarartion: InterfaceDeclaration, expected: string) {
      const { sourceFile } = getInfoFromText(startCode)
      insertInterfaceDeclaration(0, declarartion, sourceFile)
      expect(sourceFile.getFullText()).toMatch(expected)
    }
    it('should insert interface declaration at the beginning of the file', () => {
      const { sourceFile } = getInfoFromText('export interface b {}')
      doTest('export interface a {}', sourceFile.getInterface('b')!, `interface b {
}

export interface a {}`)
    })

    it('should insert interface declaration with extends at the end of the file', () => {
      const { sourceFile } = getInfoFromText('export interface b extends a {}')
      doTest('export interface a {}', sourceFile.getInterface('b')!, `interface b extends a {
}

export interface a {}`)
    })

    it('should insert interface declaration with properties at the end of the file', () => {
      const { sourceFile } = getInfoFromText('export interface b {a: number} export interface a {}')
      doTest('export interface a {}', sourceFile.getInterface('b')!, `interface b {
    a: number;
}

export interface a {}`)
    })
    it('should insert interface declaration with ctors at the end of the file', () => {
      const { sourceFile } = getInfoFromText(`export interface b {
        constructor(a = 1): void
      }`)
      doTest('export interface a {}', sourceFile.getInterface('b')!, `interface b {
    constructor(a: number = 1): void;
}

export interface a {}`)
    })
    it('should insert interface declaration with methods at the end of the file', () => {
      const { sourceFile } = getInfoFromText(`export interface b {
        a(): void
      }`)
      doTest('export interface a {}', sourceFile.getInterface('b')!, `interface b {
    a(): void;
}

export interface a {}`)
    })
    it('should insert interface declaration with methods and properties at the end of the file', () => {
      const { sourceFile } = getInfoFromText(`export interface b {
        a(): void
        b: number;
        c: string
      }`)
      doTest('export interface a {}', sourceFile.getInterface('b')!, `interface b {
    b: number;
    c: string;
    a(): void;
}

export interface a {}`)
    })
  })
  describe('insertTypeAliasDeclaration', () => {
    function doTest(startCode: string, declarartion: TypeAliasDeclaration, expected: string) {
      const { sourceFile } = getInfoFromText(startCode)
      insertTypeAliasDeclaration(0, declarartion, sourceFile)
      expect(sourceFile.getFullText()).toMatch(expected)
    }
    it('should insert type alias declaration at the beginning of the file', () => {
      const { sourceFile } = getInfoFromText('export type b = a')
      doTest('export type a = b', sourceFile.getTypeAlias('b')!, `type b = a;
export type a = b`)
    })
  })
})
