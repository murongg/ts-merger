import type { ClassDeclaration, EnumDeclaration, FunctionDeclaration, SourceFile, Type, VariableDeclaration } from 'ts-morph'

export function getType(type: Type) {
  if (type.isLiteral())
    return ''
  else
    return type.getText()
}

export function insertVariableDeclaration(index: number, declarartion: VariableDeclaration, source: SourceFile) {
  const d = declarartion as VariableDeclaration
  const statement = d.getVariableStatement()
  if (statement) {
    source.insertVariableStatement(index, {
      declarationKind: statement.getDeclarationKind(),
      declarations: statement.getDeclarations().map((s) => {
        return {
          name: s.getName(),
          type: getType(s.getType()),
          initializer: s.getInitializer()?.getText(),
        }
      }),
    })
  }
}

export function insertFunctionDeclaration(index: number, declarartion: FunctionDeclaration, source: SourceFile) {
  const d = declarartion as FunctionDeclaration
  source.insertFunction(index, {
    name: d.getName(),
    parameters: d.getParameters().map((s) => {
      return {
        name: s.getName(),
        type: getType(s.getType()),
        initializer: s.getInitializer()?.getText(),
      }
    }),
    returnType: getType(d.getReturnType()),
    statements: d.getStatements().map(s => s.getText()),
  })
}

export function insertEnumDeclaration(index: number, declarartion: EnumDeclaration, source: SourceFile) {
  const d = declarartion as EnumDeclaration
  source.insertEnum(index, {
    name: d.getName(),
    members: d.getMembers().map((s) => {
      return {
        name: s.getName(),
        initializer: s.getInitializer()?.getText(),
      }
    }),
  })
}

export function insertClassDeclaration(index: number, declarartion: ClassDeclaration, source: SourceFile) {
  const d = declarartion as ClassDeclaration
  source.insertClass(index, {
    name: d.getName(),
    extends: d.getExtends()?.getText(),
    implements: d.getImplements().map(s => s.getText()),
    methods: d.getMethods().map(s => ({
      name: s.getName(),
      parameters: s.getParameters().map((s) => {
        return {
          name: s.getName(),
          type: getType(s.getType()),
          initializer: s.getInitializer()?.getText(),
        }
      }),
      returnType: getType(s.getReturnType()),
      statements: s.getStatements().map(s => s.getText()),
    })),
    properties: d.getProperties().map(s => ({
      name: s.getName(),
      type: getType(s.getType()),
      initializer: s.getInitializer()?.getText(),
    })),
    ctors: d.getConstructors().map(s => ({
      parameters: s.getParameters().map((s) => {
        return {
          name: s.getName(),
          type: getType(s.getType()),
          initializer: s.getInitializer()?.getText(),
          scope: s.getScope(),
          hasOverrideKeyword: s.hasOverrideKeyword(),
          isReadonly: s.isReadonly(),
        }
      }),
      scope: s.getScope(),
      typeParameters: s.getTypeParameters().map(s => s.getText()),
      statements: s.getStatements().map(s => s.getText()),
    })),
  })
}
