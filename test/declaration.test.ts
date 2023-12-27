import type { ClassDeclaration, EnumDeclaration, FunctionDeclaration, VariableDeclaration } from 'ts-morph'
import { describe, expect, it } from 'vitest'
import { insertClassDeclaration, insertEnumDeclaration, insertFunctionDeclaration, insertVariableDeclaration } from '../src/declaration'
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
})
