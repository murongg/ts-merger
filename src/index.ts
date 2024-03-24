import path from 'node:path'
import type { ClassDeclaration, EnumDeclaration, FunctionDeclaration, VariableDeclaration } from 'ts-morph'
import { Project, SyntaxKind } from 'ts-morph'
import { getDeclaration, insertClassDeclaration, insertEnumDeclaration, insertFunctionDeclaration, insertVariableDeclaration } from './declaration'
const project = new Project()

const entryPath = path.join(__dirname, 'tests/index.ts')

const sourceFile = project.addSourceFileAtPath(entryPath)

for (const i of sourceFile.getImportDeclarations()) {
  const importPath = i.getModuleSpecifierValue()
  const realImportPath = `${path.join(path.dirname(entryPath), importPath)}.ts`
  const subsource = project.addSourceFileAtPath(realImportPath)
  for (const named of i.getNamedImports()) {
    const declarartion = getDeclaration(named.getText(), subsource)
    if (declarartion) {
      const kind = declarartion.getKind()
      if (kind === SyntaxKind.VariableDeclaration)
        insertVariableDeclaration(0, declarartion as VariableDeclaration, sourceFile)

      else if (kind === SyntaxKind.FunctionDeclaration)
        insertFunctionDeclaration(0, declarartion as FunctionDeclaration, sourceFile)

      else if (kind === SyntaxKind.EnumDeclaration)
        insertEnumDeclaration(0, declarartion as EnumDeclaration, sourceFile)

      else if (kind === SyntaxKind.ClassDeclaration)
        insertClassDeclaration(0, declarartion as ClassDeclaration, sourceFile)
    }
  }
  i.remove()
}

// console.log(sourceFile.getFullText())

